'use strict';
const sql = require('./dbConnection.js');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let config = require('../config');
//Post object

class Post {
    constructor(post) {
        this.post = post;
        this.created_at = new Date();
    }

    static createPost(newPost, result) {
        sql.query("INSERT INTO posts set ?", newPost, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                result(null, res);
            }
        });
    }
    
    static getPostById(postId, result) {
        sql.query("Select * from posts where id = ? ", postId, function (err, res) {
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
    static getPostsByUser(userId, result) {
        sql.query("Select * from posts where user_id = ? ", userId, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                result(null, res);
            }
        });
    }
    static getPostsByCampus(campusId, result) {
        sql.query("Select * from posts where campus_id = ? ", campusId, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                result(null, res);
            }
        });
    }
    static getAllPosts(result) {
        sql.query("Select * from posts", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else {
                console.log('posts : ', res);
                result(null, res);
            }
        });
    }

    static updateById(id, values, result) {
        let update_set = Object.keys(values).map(value => ` ${value}  = "${values[value]}"`);
     
        let update_query =  `UPDATE posts SET ${update_set.join(" ,")} WHERE id = ?`;
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
        sql.query("DELETE FROM posts WHERE id = ?", [id], function (err, res) {
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

module.exports = Post;