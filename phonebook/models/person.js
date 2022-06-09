const mongoose = require('mongoose')
// require('dotenv').config()
/* NOTE: It's important that dotenv gets imported before the note model is imported.
This ensures that the environment variables from the .env file are available globally
before the code from the other modules is imported. */

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  // name: String,
  // number: String,
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        // NOTE: regex matches the previous token n times
        // return /\d{2}-\d{6,}/.test(v);
        // return /^\d{2}-\d{6,}$/.test(v);
        // regex matches the previous token 1 or 2 times
        return /^\d{1}-\d{6,}$|^\d{2}-\d{6,}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
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