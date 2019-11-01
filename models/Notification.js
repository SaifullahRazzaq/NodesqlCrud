'use strict';
const sql = require('./dbConnection.js');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// let config = require('../config');
//notifications object
class notifications {
    constructor(notifications) {
        this.notifications = notifications;
        this.created_at = new Date();
    }
    static createnotifications(newnotifications, result) {
        notifications.getnotificationsByEmail(newnotifications.email, 
            function(err, notifications) {
                if(notifications.length > 0) {
                    result(null, 'ERROR_notifications_EXISTS');
                } else {
                    bcrypt.hash(newnotifications.password, 10, function(err, hash) {
                        newnotifications.password = hash;
                        sql.query("INSERT INTO notifications set ?", newnotifications, function (err, res) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            else {
                                let token = jwt.sign({email: newnotifications.email},
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
    static getnotificationsById(notificationsId, result) {
        sql.query("Select * from notifications where id = ? ", notificationsId, function (err, res) {
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

    static getAllnotifications(result) {
        sql.query("Select * from notifications", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                console.log('notifications : ', res);
                result(null, res);
            }
        });
    }
    static updateById(id, values, result) {
        let update_set = Object.keys(values).map(value => ` ${value}  = "${values[value]}"`);
     
        let update_query =  `UPDATE notifications SET ${update_set.join(" ,")} WHERE id = ?`;
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
        sql.query("DELETE FROM notifications WHERE id = ?", [id], function (err, res) {
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

module.exports = notifications;