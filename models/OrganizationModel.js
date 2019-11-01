'use strict';
const sql = require('./dbConnection.js');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// let config = require('../config');
//Organizations object
class Organizations {
    constructor(Organizations) {
        this.Organizations = Organizations;
        this.created_at = new Date();
    }
    static createOrganizations(newOrganizations, result) {
        Organizations.getOrganizationsByEmail(newOrganizations.email, 
            function(err, organizations) {
                if(organizations.length > 0) {
                    result(null, 'ERROR_Organizations_EXISTS');
                } else {
                    bcrypt.hash(newOrganizations.password, 10, function(err, hash) {
                        newOrganizations.password = hash;
                        sql.query("INSERT INTO organizations set ?", newOrganizations, function (err, res) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            else {
                                let token = jwt.sign({email: newOrganizations.email},
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
    static getOrganizationsById(OrganizationsId, result) {
        sql.query("Select * from organizations where id = ? ", OrganizationsId, function (err, res) {
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

    static getAllorganizations(result) {
        sql.query("Select * from organizations", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                console.log('organizations : ', res);
                result(null, res);
            }
        });
    }
    static updateById(id, values, result) {
        let update_set = Object.keys(values).map(value => ` ${value}  = "${values[value]}"`);
     
        let update_query =  `UPDATE organizations SET ${update_set.join(" ,")} WHERE id = ?`;
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
        sql.query("DELETE FROM organizations WHERE id = ?", [id], function (err, res) {
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

module.exports = Organizations;