const express = require('express');
const bodyParser = require('body-parser');

const server = express();

/**
 * Data Base Co
 */

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

server.use(bodyParser.urlencoded({extended: true}));
server.listen(80);

server.get('/form.html', function(request, response) {
   response.sendFile( __dirname + '/form.html');
});

server.post('/post.html', function(request, response) {
   const name = request.body.name;
   const address = request.body.address;

   MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      const dbo = db.db('Form');
      const myobj = {name: name, address: address};
      dbo.collection('users').insertOne(myobj, function(err, res) {
         if (err) throw err;
         console.log('inserted');
         db.close();
      });
   });
   
});



