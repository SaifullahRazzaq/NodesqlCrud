'use strict';
const sql = require('./dbConnection.js');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// let config = require('../config');
//campuses object
class campuses {
    constructor(campuses) {
        this.campuses = campuses;
        this.created_at = new Date();
    }
    static createcampuses(newcampuses, result) {
        campuses.getcampusesByEmail(newcampuses.email, 
            function(err, campusess) {
                if(campusess.length > 0) {
                    result(null, 'ERROR_campuses_EXISTS');
                } else {
                    bcrypt.hash(newcampuses.password, 10, function(err, hash) {
                        newcampuses.password = hash;
                        sql.query("INSERT INTO campusess set ?", newcampuses, function (err, res) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            else {
                                let token = jwt.sign({email: newcampuses.email},
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
    static getcampusesById(campusesId, result) {
        sql.query("Select * from campusess where id = ? ", campusesId, function (err, res) {
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

    static getAllcampusess(result) {
        sql.query("Select * from campusess", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                console.log('campusess : ', res);
                result(null, res);
            }
        });
    }
    static updateById(id, values, result) {
        let update_set = Object.keys(values).map(value => ` ${value}  = "${values[value]}"`);
     
        let update_query =  `UPDATE campusess SET ${update_set.join(" ,")} WHERE id = ?`;
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
        sql.query("DELETE FROM campusess WHERE id = ?", [id], function (err, res) {
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

module.exports = campuses;