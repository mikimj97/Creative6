var express = require('express');
var router = express.Router();
var expressSession = require('express-session');



/* Set up mongoose in order to connect to mongo database */
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/commentDB', { useMongoClient: true }); //Connects to a mongo database called "commentDB"

var commentSchema = mongoose.Schema({ //Defines the Schema for this database
  Name: String,
  Comment: String
});

var Comment = mongoose.model('Comment', commentSchema); //Makes an object from that schema as a model



var users = require('../controllers/users_controller');
console.log("before / Route");
router.get('/', function(req, res) {
  console.log("/ Route");
  //    console.log(req);
  console.log(req.session);
  if (req.session.user) {
    console.log("/ Route if user");
    res.render('index', {
      username: req.session.username,
      msg: req.session.msg,
      color: req.session.color
    });
  }
  else {
    console.log("/ Route else user");
    req.session.msg = 'Access denied!';
    res.redirect('/login');
  }
});
router.get('/user', function(req, res) {
  console.log("/user Route");
  if (req.session.user) {
    res.render('user', { msg: req.session.msg });
  }
  else {
    req.session.msg = 'Access denied!';
    res.redirect('/login');
  }
});
router.get('/signup', function(req, res) {
  console.log("/signup Route");
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('signup', { msg: req.session.msg });
});
router.get('/login', function(req, res) {
  console.log("/login Route");
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('login', { msg: req.session.msg });
});
router.get('/logout', function(req, res) {
  console.log("/logout Route");
  req.session.destroy(function() {
    res.redirect('/login');
  });
});
router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);


router.post('/comment', function(req, res, next) {
  console.log("POST comment route"); //[1]
  console.log(req.body);
  var newcomment = new Comment(req.body); //[3]
  console.log(newcomment); //[3]
  newcomment.save(function(err, post) { //[4]
    if (err) return console.error(err);
    console.log(post);
    res.sendStatus(200);
  });
});

router.get('/comment', function(req, res, next) {


  console.log("In query route");
  console.log(req.body);
  console.log("Request");
  var requestname = req.query["q"];
  console.log(requestname);
  console.log("flag");
  var obj = {};
  if (requestname) {
    obj = { Name: requestname };
    Comment.find(obj, function(err, list) {
      console.log(list);
      res.json(list);
    })
  }
  else {
    Comment.find({}, function(err, list) { //Calls the find() method on your database
      console.log(list);
      res.json(list);
    })
  }

});


module.exports = router;
