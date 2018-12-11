const express = require('express');

const bodyParser = require('body-parser');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./storage');

const server = express();

/**
 * Data Base Co
 */

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

server.use(express.static(__dirname));
server.use(bodyParser.urlencoded({extended: true}));

server.listen(80);

server.get('/form.html', (request, response) => {
  response.sendFile(__dirname + '/form.html');
});

/* sign up form  */
server.post('/signUp.html', (request, response) => {
  const name = request.body.name;
  const pass = request.body.password;
  const adminPass = request.body.adminPass;

  MongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      const dbo = db.db('Form');
      let admin = 'normal';

      if (adminPass === 'iamanadmin') admin = 'admin';

      const user = {name: name, password: pass, status: admin};

      dbo.collection('users').countDocuments(user, (err, res) => {
        if (res > 0) {
          response.sendFile(__dirname + '/form.html');
        } else {
          dbo.collection('users').insertOne(user, (err, res) => {
            if (err) throw err;
            response.sendFile(__dirname + '/form.html');
            db.close();
          });
        }
        if (err) throw err;

        db.close();
      });
    }
  );
});

/* sign in form */
server.post('/signIn.html', (request, response) => {
  const nameIn = request.body.nameIn;
  const passIn = request.body.passwordIn;

  MongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      const dbo = db.db('Form');
      const user = {name: nameIn, password: passIn};

      localStorage.setItem('userName', user.name);

      dbo.collection('users').countDocuments(user, (err, res) => {
        let users = [];
        if (res > 0) {
          dbo
            .collection('users')
            .find({})
            .toArray((err, res) => {
              for (let i = 0; i < res.length; i++) {
                users.push('<li>' + res[i].name + '</li>');
              }
              response.send(
                '<h1>Welcome ' +
                  user.name +
                  '</h1>List of users : <ul>' +
                  users.join(' ') +
                  '</ul>' +
                  '<form method="post" action="/change.html"><h3>Change your password ?</h3> <input type="text" name="changePass" placeholder="change password"></input> <button type="submit" name="changePassword">Change</button></form>' +
                  '<form method="post" action="/delete.html"><h3>Delete your account ?</h3> <button type="submit" name="deleteAccount">Delete</button></form>'
              );
              db.close();
            });
        } else {
          response.sendFile(__dirname + '/form.html');
        }

        if (err) throw err;

        db.close();
      });
    }
  );
});

server.post('/change.html', (request, response) => {
  const pass = request.body.changePass;

  MongoClient.connect(
    url,
    (err, db) => {
      if (err) throw err;
      const dbo = db.db('Form');
      const selected = {name: localStorage.getItem('userName')};
      const updated = {$set: {password: pass}};

      dbo.collection('users').updateOne(selected, updated, function(err, res) {
        if (err) throw err;
        db.close();
      });
    }
  );
  response.send(
    '<h1>Password Changed</h1><a href="/form.html">return to form</a>'
  );
});

server.post('/delete.html', (request, response) => {
  MongoClient.connect(
    url,
    function(err, db) {
      if (err) throw err;
      let dbo = db.db('Form');
      let deletedUser = {name: localStorage.getItem('userName')};
      dbo.collection('users').deleteOne(deletedUser, function(err, obj) {
        if (err) throw err;
        db.close();
      });
    }
  );
  response.send(
    '<h1>Account deleted</h1><a href="/form.html">return to form</a>'
  );
});
