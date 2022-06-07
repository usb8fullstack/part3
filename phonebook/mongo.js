// node mongo.js <password>
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

// TODO: change link, then <phonebookApp>
const url = `mongodb+srv://hp:${password}@cluster0.2znsjnu.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({  // TODO: change name note >> person ...
  // content: String,
  // date: Date,
  // important: Boolean,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')
    Person.find({}).then(result => {
    // Person.find({ name: "hihi"}).then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })

    // const person = new Person({
    //   name: 'hihi',
    //   number: '2222',
    // })

    // return person.save()
  })
  // .then(() => {
  //   console.log('person saved!')
  //   return mongoose.connection.close()
  // })
  .catch((err) => console.log(err))