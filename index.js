require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



//endpoints
const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.json())

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

const generateID = () => {
    return Math.floor(Math.random()*9999999)
}

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

//write a delete endpoint
app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

//find person by id
app.get('/api/persons/:id', ((req, res,next) => {
    const id = req.params.id
    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
}))



//Change the backend so that new numbers are saved to the database. Verify that your frontend still works after the changes.
app.post('/api/persons', (req, res) => {
    const body = req.body
    // console.log(body);
    if (!body.name || !body.number){
        return res.status(400).json({ error: 'name or number missing' })
    }
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

// (req,res)=>{
//     let id = generateID();
//     let ids = persons.map(p=>p.id);
//     if (ids.includes(id)){
//         return res.status(404).json({ error: 'id must be unique' });
//     }else if (!req.body.name || !req.body.number){
//         return res.status(404).json({ error: 'missing field' });
//     }
//     person = {
//         name: req.body.name,
//         number: req.body.number,
//         id: id
//     }
//     persons.push(person);
//     res.json(persons);
// })
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name==='CastError') {return response.status(400).send({ error: 'malformatted id' });}
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)