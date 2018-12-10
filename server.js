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

server.get('/form.html', (request, response) => {
   response.sendFile( __dirname + '/form.html');
});

server.post('/signUp.html', (request, response) => {
   const name = request.body.name;
   const pass = request.body.password;

   MongoClient.connect(url, (err, db) => {
      if (err) throw err;
      const dbo = db.db('Form');
      const user = {name: name, password: pass};
      dbo.collection('users').insertOne(user, (err, res) => {
         if (err) throw err;
         response.sendFile( __dirname + '/form.html');
         db.close();
      });
   });
});

server.post('/signIn.html', (request, response) => {
   const nameIn = request.body.nameIn;
   const passIn = request.body.passwordIn;

   MongoClient.connect(url, (err, db) => {
      if (err) throw err;
      const dbo = db.db('Form');
      const user = {name: nameIn, password: passIn};

      dbo.collection('users').countDocuments(user, (err, res) => {
         if (res > 0) response.sendFile( __dirname + '/signIn.html');
         else {
            response.sendFile( __dirname + '/form.html');
         }

         if (err) throw err;

         db.close();
      });
   });
});
