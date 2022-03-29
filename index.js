const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.json())

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

persons = [
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

const generateID = () => {
    return Math.floor(Math.random()*9999999);
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req,res) => {
    let id = Number(req.params.id)
    let person = persons.find(p=>p.id===id)
    if (!person){
        return res.status(404).end()
    }
    //more code here
    res.json(person);
})

//Add the morgan middleware to your application for logging. Configure it to log messages to your console based on the tiny configuration.
    

/*
3.5: Phonebook backend step5
Expand the backend so that new phonebook entries can be added by making HTTP POST requests to the address http://localhost:3001/api/persons.

Generate a new id for the phonebook entry with the Math.random function. Use a big enough range for your random values so that the likelihood of creating duplicate ids is small.

3.6: Phonebook backend step6
Implement error handling for creating new entries. The request is not allowed to succeed, if:

The name or number is missing
The name already exists in the phonebook
Respond to requests like these with the appropriate status code, and also send back information that explains the reason for the error, e.g.:

{ error: 'name must be unique' }
*/
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number){
        return res.status(400).json({error: 'name or number missing'})
    }
    const person = persons.find(p=>p.name===body.name)
    if (person){
        return res.status(400).json({error: 'name must be unique'})
    }
    const newPerson = {
        id: generateID(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    res.json(newPerson)
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




const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)