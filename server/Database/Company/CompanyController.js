var Q = require('q')
var jwt = require('jwt-simple')
var Company = require('./CompanyModel.js')
var nodemailer = require('nodemailer');

module.exports.handleUsers = {
  signin : function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    Company.findOne({username: username})
      .then(function (user) {

     console.log(user)
        if (!user) {

          res.status(404).json("user not found")
        } else {
          user.comparePasswords(password)
            .then(function (isMatch) {
              if (isMatch) {
                var token = jwt.encode(user, 'secret');
                res.json({token : token, user : user});

              } else {
                res.json("password not matched")
              }
            });
        }
      });
  },
  // add user to data base
  signup: function(req, res) {
    var username = req.body.username
    var password = req.body.password;
    // check to see if user already exists
    Company.findOne({username: username})
      .exec(function (err, user) {
        if (user) {
          res.json('User already exist!');
        } else {
          // make a new user if not

          return Company.create({
            username: username,
            password: password
          }, function (err, newUser) {
              // create token to send back for auth
              if(err){
                res.json(err);
              } else {
                var token = jwt.encode(user, 'secret');
                res.json({token: token});
              }
          });
        }
      });
  },
  sendemail: function(req, res) {
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'offerapp1@gmail.com',
        pass: 'msmRBK!@12'
      }
    });
    var mailOptions = {
      from: 'offerapp1@gmail.com',
      to: req.body.email,
      subject: 'From ' + req.body.name,
      text: req.body.msg

    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        res.json({Message: 'opss, some thing went wrong please try later'});
      } else {
        res.json({Message: 'your e-mail has been sent successfully'});
      }
    });
  },
  // get user in data base
  getUsers: function(req, res) {
    Company.find({}, function(err, users){
      if(err){
        res.json(err);
      } else {
        res.json(users);
      }
    });
  }

}
