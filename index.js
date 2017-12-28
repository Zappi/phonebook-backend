const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');


morgan.token('personData', function getName (res) {
  return JSON.stringify(res.body);
});

app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':method: :url :personData :response-time'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
		},
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
]

app.get('/api/persons', (req,res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id)

  if(person)
    res.json(person)
  else
    res.status(404).end();

});

const generateId = () => {
  return Math.floor(Math.random()*900+1);
}


app.post('/api/persons/', (req,res) => {
  const body = req.body;

  if(persons.some(person => person.name === body.name)) {
    res.status(400).json({error: 'name must be unique'});
  }

  if(body.name === undefined || body.number === undefined) {
    res.status(400).json({error: 'name or number is missing'});
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person);
  res.json(person);

})

app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id === id)
  res.status(204).end();
});


app.get('/info', (req,res) => {
  const personsArrayLength = persons.length;
  const date = new Date();

  res.send('Puhelinluettelossa on ' + personsArrayLength + ' henkilön tiedot '
  + date);

})

const port = 3001;
app.listen(port,() => {
  console.log(`Server running on port ${port}`);
})
