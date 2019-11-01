'use strict';
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
let config = require('../config');
const User = require('../models/usersModel.js');

exports.loginUser = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log('login: ',email);
    
    // For the given email/password fetch user from DB
    User.getUserByEmail(email, 
    function(err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'Email not registered. Enter correct email or signup first.'
                });
        }
        let user;
        result.forEach(row => { user = row });
        console.log(user.email);
        if (email && password && email === user.email) {
            bcrypt.compare(password, user.password, function(isError, isSuccessfull) {
                if(isSuccessfull) {
                    let token = jwt.sign({email: email},
                        config.secret,
                        // { expiresIn: '24h' // expires in 24 hours
                        // }
                    );
                    // return the JWT token for the future API calls
                    res.json({
                        success: true,
                        message: 'Signin Successful!',
                        token: token
                    });
                } else {  
                    res.json({
                        success: false,
                        message: 'Incorrect password.'
                        });
                }
            });
        } else {
            res.json({
                success: false,
                message: 'Incorrect email'
            });
        }
    });

}