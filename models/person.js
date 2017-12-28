const mongoose = require('mongoose');

const url = 'mongodb://jerry:jerry@ds133127.mlab.com:33127/sandbox';

mongoose.connect(url, {useMongoClient: true});
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: Number
})

module.exports = Person;
