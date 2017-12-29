const mongoose = require('mongoose');
const keys = require('../config/keys');

const url = keys.mongodb.dbURI;

mongoose.connect(url, {useMongoClient: true});
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: Number
})

module.exports = Person;
