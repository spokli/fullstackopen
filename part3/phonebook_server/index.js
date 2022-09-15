require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

const app = express()

app.use(cors())
app.use(express.static("build"))
app.use(express.json())


const requestLogger = () => {
	morgan.token("post_content", (req, ) => {
		if (req.method === "POST") {
			return JSON.stringify(req.body)
		}
	})

	return morgan(":method :url :status :res[content-length] - :response-time ms :post_content")
}
app.use(requestLogger())


app.get("/info", (request, response, next) => {
	Person.find({})
		.then(result => {
			const numPersons = result.length
			response.send(`<p>Phonebook has info for ${numPersons} people</p><p>${Date()}</p>`)
		})
		.catch(error => next(error))
})

app.get("/api/persons", (req, res, next) => {
	// Get persons from DB
	Person.find({})
		.then(result => {
			res.json(result)
		})
		.catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id)
		.then(result => {
			if (result) {
				res.json(result).end()
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
	const updatedPerson = {
		name: req.body.name,
		number: req.body.number
	}

	Person.findByIdAndUpdate(
		req.params.id,
		updatedPerson,
		{ new: true, runValidators: true, context: "query" })
		.then(updatedNote => {
			res.json(updatedNote)
		})
		.catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
	if (req.headers["content-type"] !== "application/json") {
		return res.status(400).end()
	}

	const newPerson = { ...req.body }

	if (!newPerson.name || newPerson.name === "") {
		console.log("Name is empty!")
		res.status(400).json({ "error": "name is empty" })
		return
	}

	if (!newPerson.number || newPerson.number === "") {
		console.log("Number is empty!")
		res.status(400).json({ "error": "number is empty" })
		return
	}

	// If a person with the name already exists, deny the request.
	// Should be checked in the frontend too but better safe than sorry.
	Person.find({ name: newPerson.name })
		.then(result => {
			if (result.length) {
				console.log(result)
				res.status(400).json({ "error": "name already exists" })
			} else {
				// Create and insert person
				new Person({ ...newPerson }).save()
					.then(result => {
						res.json(result)
					})
					.catch(error => next(error))
			}
		})
		.catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

// Error handler middleware
const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" })
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)

// MAIN
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})