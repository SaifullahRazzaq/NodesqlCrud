'use strict';
const sql = require('./dbConnection.js');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// let config = require('../config');
//messages object
class messages {
    constructor(messages) {
        this.messages = messages;
        this.created_at = new Date();
    }
    static createmessages(newmessages, result) {
        messages.getmessagesByEmail(newmessages.email, 
            function(err, messages) {
                if(messages.length > 0) {
                    result(null, 'ERROR_messages_EXISTS');
                } else {
                    bcrypt.hash(newmessages.password, 10, function(err, hash) {
                        newmessages.password = hash;
                        sql.query("INSERT INTO messages set ?", newmessages, function (err, res) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            else {
                                let token = jwt.sign({email: newmessages.email},
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
    static getmessagesById(messagesId, result) {
        sql.query("Select * from messages where id = ? ", messagesId, function (err, res) {
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

    static getAllmessages(result) {
        sql.query("Select * from messages", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                console.log('messages : ', res);
                result(null, res);
            }
        });
    }
    static updateById(id, values, result) {
        let update_set = Object.keys(values).map(value => ` ${value}  = "${values[value]}"`);
     
        let update_query =  `UPDATE messages SET ${update_set.join(" ,")} WHERE id = ?`;
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
        sql.query("DELETE FROM messages WHERE id = ?", [id], function (err, res) {
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

module.exports = messages;