const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.json())

app.use(express.static('build'))

morgan.token('body', function getBody (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
// app.use(morgan('tiny'))

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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${new Date()}</div>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  // const maxId = persons.length > 0
  //   ? Math.max(...persons.map(n => n.id))
  //   : 0
  // return maxId + 1
  let id = Math.floor(Math.random() * 1000000)
  // console.log(id)
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }
  
  const checkDuplicate = () => {
    for (let o of persons) {
      if (o.name === body.name) {
        return true
      }
    }
    return false
  }
  if (checkDuplicate()) {
    return response.status(400).json({
      error: 'The name already exists in the phonebook. It must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})