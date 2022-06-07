const mongoose = require('mongoose')
// require('dotenv').config()
/* NOTE: It's important that dotenv gets imported before the note model is imported.
This ensures that the environment variables from the .env file are available globally
before the code from the other modules is imported. */

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const Person = mongoose.model('Person', personSchema)
module.exports = mongoose.model('Person', personSchema)