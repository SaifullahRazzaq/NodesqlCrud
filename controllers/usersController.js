'use strict';

const User = require('../models/usersModel.js');
const sendSignupMail = require('../server-mails/signup.js');

exports.list_all_users = function(req, res) {
  User.getAllUsers(function(err, user) {

    console.log('controller')
    if (err)
      res.send(err);
      console.log('res', user);
    res.send(user);
  });
}

exports.create_a_user = function(req, res) {
  var new_user = new User(req.body);

  //handles null error 
   if(!new_user.user){
            res.status(400).send({ error:true, message: 'Unable to create user!' });
    }
    else {
      User.createUser(new_user.user, function(err, token) {
        if (err)
          res.send(err);
        res.json({ error:false, message: 'User created!', token });
        sendSignupMail(new_user.user.email, new_user.user.first_name, new_user.user.id);
      });
    }
}

exports.read_a_user = function(req, res) {
  User.getUserById(req.params.userId, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
}


exports.update_a_user = function(req, res) {
  User.updateById(req.params.userId, req.body, function(err, user) {
    if (err)
      res.send(err);
      res.json({ message: 'User successfully updated.' });
  });
}

exports.delete_a_user = function(req, res) {
  User.remove( req.params.userId, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
}

