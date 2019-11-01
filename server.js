const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  port = process.env.PORT || 3000;
  
const mysql = require('mysql');
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'campusgruv'
});
 
// connect to database
mc.connect();

app.listen(port);

console.log(`API server started on: http://localhost:${port}`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes/appRoutes'); //importing route
routes(app); //register the route


