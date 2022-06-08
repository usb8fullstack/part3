const express = require('express')
const app = express()
require('dotenv').config()

const cors = require('cors')
app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

/*************************************************/
const morgan = require('morgan')
morgan.token('body', function getBody (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    // .catch(error => {
    //   console.log(error)
    //   // response.status(500).end()
    //   // NOTE: status 400 is better: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.1
    //   response.status(400).send({ error: 'malformatted id' })
    // })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then((result) => {
    response.status(result ? 204 : 404).end()  // NOTE: 404 id not found  >> frontend then throw err
  })
  .catch(error => next(error))  // NOTE: id not valid type
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})