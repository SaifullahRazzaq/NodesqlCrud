'use strict';

const User = require('../models/usersModel.js');
let jwt = require('jsonwebtoken');
let config = require('../config');

exports.verify = function(req, res) {
    if((`${req.protocol}://${req.get('host')}`) ==(config.apiBaseUrl))
    {
        console.log("Domain is matched. Information is from Authentic email");
        const decoded = jwt.verify(req.params.token, config.secret);
        console.log(decoded);
        
        User.updateById(decoded.userId, { email_verified: 1 }, function(err, resp) {
            if (err)
                res.send(err);
            if(resp.affectedRows > 0) {
                console.log("Email is verified");
                res.send("<h2>Your email has been verified successfully. </h2>");    
            } else {
                console.log("Email not verified");
                res.send("Bad request.");
            }
        });
    }
}