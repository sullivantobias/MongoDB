const express = require('express');
const bodyParser = require('body-parser');

const server = express();

server.use(bodyParser.urlencoded({extended: true}));
server.listen(80);

server.get('/form.html', function(request, response) {
   response.sendFile( __dirname + '/form.html');
});

server.post('/post.html', function(request, response) {
   const p1 = request.body.p1;
   console.log(p1);
});
