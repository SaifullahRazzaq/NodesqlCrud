'use strict';
const sql = require('./dbConnection.js');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// let config = require('../config');
//likes object
class likes {
    constructor(user) {
        this.user = user;
        this.created_at = new Date();
    }
    static createlikes(newlikes, result) {
        likes.getlikesByEmail(newlikes.email, 
            function(err, likes) {
                if(likes.length > 0) {
                    result(null, 'ERROR_USER_EXISTS');
                } else {
                    bcrypt.hash(newlikes.password, 10, function(err, hash) {
                        newlikes.password = hash;
                        sql.query("INSERT INTO likes set ?", newlikes, function (err, res) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            else {
                                let token = jwt.sign({email: newlikes.email},
                                    config.secret,
                                    // { expiresIn: '24h' // expires in 24 hours
                                    // }
                                );
                                // return the JWT token for the future API calls
                                console.log(token);
                                result(null, token);
                            }
                        });
                });
            }
        });
    }
    static getlikesById(userId, result) {
        sql.query("Select * from likes where id = ? ", userId, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                console.log('Response from server: ', res);
                result(null, res);
            }
        });
    }

    static getAlllikes(result) {
        sql.query("Select * from likes", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                console.log('likes : ', res);
                result(null, res);
            }
        });
    }
    static updateById(id, values, result) {
        let update_set = Object.keys(values).map(value => ` ${value}  = "${values[value]}"`);
     
        let update_query =  `UPDATE likes SET ${update_set.join(" ,")} WHERE id = ?`;
        sql.query(update_query, [id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                console.log("response: ", res);
                result(null, res);
            }
        });
    }

    static remove(id, result) {
        sql.query("DELETE FROM likes WHERE id = ?", [id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                result(null, res);
            }
        });
    }
}

module.exports = likes;