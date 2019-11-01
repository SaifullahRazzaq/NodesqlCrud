'use strict';

const User = require('../models/usersModel.js');
let jwt = require('jsonwebtoken');
let config = require('../config');
const bcrypt = require('bcrypt');
const sendPasswordResetEmail = require('../server-mails/password-reset.js');

exports.resetPasswordRequest = function(req, res) {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
            let token = jwt.sign(
                {
                    email: req.body.email,
                    password: hash
                },
                config.secret,
                { 
                    expiresIn: '24h' // expires in 24 hours
                }
            );
            res.send({ 'success': true });
            sendPasswordResetEmail(req.body.email, token);
        });
}

exports.reset = function(req, res) {
    if((`${req.protocol}://${req.get('host')}`) == (config.apiBaseUrl))
    {
        console.log("Domain is matched. Information is from authentic email");
        const decoded = jwt.verify(req.params.token, config.secret);
        console.log(decoded);
        User.updateByEmail(decoded.email, { password: decoded.password }, function(err, resp) {
            if (err)
                res.send(err);
            if(resp.affectedRows > 0) {
                console.log("Password updated");
                res.send("<h2>Your password has been updated successfully. </h2>");    
            } else {
                console.log("Password not updated");
                res.send("Bad request.");
            }
        });
    }
}