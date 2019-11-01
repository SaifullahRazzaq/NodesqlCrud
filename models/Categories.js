'use strict';
const sql = require('./dbConnection.js');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// let config = require('../config');
//categories object
class categories {
    constructor(categories) {
        this.categories = categories;
        this.created_at = new Date();
    }
    static createcategories(newcategories, result) {
        categories.getcategoriesByEmail(newcategories.email, 
            function(err, categories) {
                if(categories.length > 0) {
                    result(null, 'ERROR_categories_EXISTS');
                } else {
                    bcrypt.hash(newcategories.password, 10, function(err, hash) {
                        newcategories.password = hash;
                        sql.query("INSERT INTO categories set ?", newcategories, function (err, res) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            else {
                                let token = jwt.sign({email: newcategories.email},
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
    static getcategoriesById(categoriesId, result) {
        sql.query("Select * from categories where id = ? ", categoriesId, function (err, res) {
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

    static getAllcategoriess(result) {
        sql.query("Select * from categories", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                console.log('categories : ', res);
                result(null, res);
            }
        });
    }
    static updateById(id, values, result) {
        let update_set = Object.keys(values).map(value => ` ${value}  = "${values[value]}"`);
     
        let update_query =  `UPDATE categories SET ${update_set.join(" ,")} WHERE id = ?`;
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
        sql.query("DELETE FROM categories WHERE id = ?", [id], function (err, res) {
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

module.exports = categories;