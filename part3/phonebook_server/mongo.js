const mongoose = require('mongoose');


const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

if (! password) {
    console.log("Please provede the password")
    process.exit(1)
}

const url =
  `mongodb+srv://fullstack:${password}@cluster0.gymmody.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

// Create schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if (newName && newNumber) {
    const newPerson = new Person({
        name: newName,
        number: newNumber
    })

    newPerson.save().then(result => {
        console.log(`Person ${result.name} with number ${result.number} saved!`)
        mongoose.connection.close()
    })

} else {
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}

