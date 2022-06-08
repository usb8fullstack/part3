const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.json())

/*************************************************/
app.use(express.static('build'))

morgan.token('body', function getBody (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/*************************************************/
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

/*************************************************/
const Person = require('./models/person')

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.send(`
      <div>Phonebook has info for ${persons.length} people</div>
      <div>${new Date()}</div>`
    )
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      // response.status(500).end()  // NOTE: status 400 is better
      response.status(400).send({ error: 'malformatted id' })
    })
})

// TODO: delete method, id is string for frontend
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }
  
  // TODO:
  // const checkDuplicate = () => {
  //   for (let o of persons) {
  //     if (o.name === body.name) {
  //       return true
  //     }
  //   }
  //   return false
  // }
  // if (checkDuplicate()) {
  //   return response.status(400).json({
  //     error: 'The name already exists in the phonebook. It must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
})

/********************************************************/
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})