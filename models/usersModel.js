'use strict';
const sql = require('./dbConnection.js');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let config = require('../config');
//Organization object
class Organization {
    constructor(organization) {
        this.organization = organization;
        this.created_at = new Date();
    }
    static createOrganization(newOrganization, result) {
        Organization.getOrganizationByEmail(newOrganization.email, 
            function(err, organizations) {
                if(organizations.length > 0) {
                    result(null, 'ERROR_USER_EXISTS');
                } else {
                    bcrypt.hash(newOrganization.password, 10, function(err, hash) {
                        newOrganization.password = hash;
                        sql.query("INSERT INTO organizations set ?", newOrganization, function (err, res) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            else {
                                let token = jwt.sign({email: newOrganization.email},
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
    static getOrganizationById(organizationId, result) {
        sql.query("Select * from organizations where id = ? ", organizationId, function (err, res) {
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
    static getOrganizationByEmail(email, result) {
        sql.query("Select * from organizations where email = ? ", email, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                result(null, res);
            }
        });
    }
    static getAllOrganizations(result) {
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
    static updateByEmail(email, values, result) {
        let update_set = Object.keys(values).map(value => ` ${value}  = "${values[value]}"`);
     
        let update_query =  `UPDATE organizations SET ${update_set.join(" ,")} WHERE email = ?`;
        sql.query(update_query, [email], function (err, res) {
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

module.exports = Organization;