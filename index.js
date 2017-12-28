const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token('personData', function getName (res) {
  return JSON.stringify(res.body);
});

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(morgan(':method: :url :personData :response-time'))

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person.id
  }
}

app.get('/api/persons', (req,res) => {
  Person
    .find({}, {__v:0})
    .then(persons => {
      res.json(persons.map(formatPerson));
    }).catch(error => {
      console.log(error);
    })
});

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(formatPerson(person))
      }else {
        res.status(404).end();
      }
    })
    .catch(error => {
      console.log(error)
      res.status(404).send({error: 'malformatted id'});
    })
});

const generateId = () => {
  return Math.floor(Math.random()*900+1);
}


app.post('/api/persons/', (req,res) => {

  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  });

  person
  .save()
  .then(savedPerson => {
   res.json(formatPerson(savedPerson));
  }).catch(error => {
    console.log(error);
  })
})

app.delete('/api/persons/:id', (req,res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => {
      res.status(404).send({error: 'malformatted error'});
    })
});

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true } )
    .then(updatedPerson => {
      res.json(formatPerson(updatedPerson));
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})


app.get('/info', (req,res) => {
  var list = 0;
  Person
    .find({})
    .then(people => {
      res.send('Puhelinluettelossa on ' + people.length + ' henkilön tiedot '
      + new Date());
    })
})


const port = process.env.PORT || 3001;
app.listen(port,() => {
  console.log(`Server running on port ${port}`);
})
