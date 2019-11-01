'use strict';

const Post = require('../models/PostModel.js');

exports.list_all_posts = function(req, res) {
  Post.getAllPosts(function(err, posts) {
    if (err)
      res.send(err);
    console.log('res', posts);
    res.send(posts);
  });
}
exports.list_user_posts = function(req, res) {
  Post.getPostsByUser(req.params.userId, function(err, posts) {
    if (err)
      res.send(err);
    console.log('res', posts);
    res.send(posts);
  });
}
exports.list_campus_posts = function(req, res) {
  Post.getPostsByCampus(req.params.campusId, function(err, posts) {
    if (err)
      res.send(err);
    console.log('res', posts);
    res.send(posts);
  });
}
exports.create_a_post = function(req, res) {
  var new_post = new Post(req.body);
  console.log('images: ', req.files)
  console.log('body: ', req.body)
  //handles null error 
   if(!new_post.post){
            res.status(400).send({ error:true, message: 'Unable to create post!' });
    }
    else {
      Post.createPost(new_post.post, function(err, resp) {
        if (err)
          res.send(err);
        res.json({ error: false, message: 'Post created', resp });
      });
    }
}

exports.read_a_post = function(req, res) {
  Post.getPostById(req.params.postId, function(err, post) {
    if (err)
      res.send(err);
    res.json(post);
  });
}


exports.update_a_post = function(req, res) {
  Post.updateById(req.params.postId, req.body, function(err, post) {
    if (err)
      res.send(err);
      res.json({ message: 'Post successfully updated.' });
  });
}

exports.delete_a_post = function(req, res) {
  Post.remove( req.params.postId, function(err, post) {
    if (err)
      res.send(err);
    res.json({ message: 'Post successfully deleted' });
  });
}

