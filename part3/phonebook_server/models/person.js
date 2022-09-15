require('dotenv').config();
const mongoose = require('mongoose')

const mongoDbPassword = process.env.MONGODB_PASSWORD
if (!mongoDbPassword) {
    console.log("Please set mongoDB password as env variable MONGODB_PASSWORD")
    process.exit(1)
}

let mongoDbUrl = process.env.MONGODB_URI
if (!mongoDbUrl) {
    console.log("Please set mongoDB URI as env variable MONGODB_URI")
    process.exit(1)
}

mongoDbUrl = mongoDbUrl.replace("<password>", mongoDbPassword)

mongoose.connect(mongoDbUrl)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
              return /\d{2,3}-\d+/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
    
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)