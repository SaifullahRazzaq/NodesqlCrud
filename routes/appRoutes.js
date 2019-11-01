'use strict';
let middleware = require('../middleware');
const multer = require('multer');

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './images')
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
  },
})

const upload = multer({ storage: Storage });

module.exports = function(app) {
  var users = require('../controllers/usersController');
  var userAuthentication = require('../controllers/loginController');
  var emailverification = require('../controllers/verifyEmailController');
  var passwordReset = require('../controllers/resetPassController.js');
  var posts = require('../controllers/postsController');

  // users Routes
  app.route('/users')
    .get(middleware.checkToken, users.list_all_users)
    .post(users.create_a_user);
   
  app.route('/users/:userId')
    .get(middleware.checkToken, users.read_a_user)
    .put(middleware.checkToken, users.update_a_user)
    .delete(middleware.checkToken, users.delete_a_user);
  
  // user login Route
  app.post('/login', userAuthentication.loginUser);

  // email verify Route
  app.get('/verify/:token', emailverification.verify);
  
   // password reset Route
   app.post('/reset', passwordReset.resetPasswordRequest);
   app.get('/reset/:token', passwordReset.reset);

     // posts Routes
  app.route('/posts').get(middleware.checkToken, posts.list_all_posts)
  app.route('/posts/user/:userId').get(middleware.checkToken, posts.list_user_posts)
  app.route('/posts/campus/:campusId').get(middleware.checkToken, posts.list_campus_posts)
  
  app.route('/posts/')
      .post(middleware.checkToken, upload.array('post_images', 3), posts.create_a_post);
 
  app.route('/posts/:postId')
    .get(middleware.checkToken, posts.read_a_post)
    .put(middleware.checkToken, posts.update_a_post)
    .delete(middleware.checkToken, posts.delete_a_post);

   app.post('/upload', middleware.checkToken, upload.array('photo', 3), (req, res) => {
    console.log('file', req.files)
    console.log('body', req.body)
    res.status(200).json({
      success: true,
      message: 'success!',
    })
  })

};



