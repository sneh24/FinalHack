const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const Host = require('../models/hostModel');

function SessionConstructor(userId, userGroup, details) {
    this.userId = userId;
    this.userGroup = userGroup;
    this.details = details;
  }

module.exports =  function(passport) {
    passport.use('user-local',
        new LocalStrategy({ usernameField : 'email'}, (email,password,done) => {
            User.findOne({ email: email })
            .then(user => {
                if(!user) {
                    return done(null, false , {message: 'Email is not registered'});
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null , false, { message: 'Password incorrect'});
                    }

                });

            })
            .catch(err => console.log(err));
        })
    );


    passport.use('host-local',
        new LocalStrategy({ usernameField : 'email'}, (email,password,done) => {
            Host.findOne({ email: email })
            .then(host => {
                if(!host) {
                    return done(null, false , {message: 'Email is not registered'});
                }

                bcrypt.compare(password, host.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, host);
                    } else {
                        return done(null , false, { message: 'Password incorrect'});
                    }

                });

            })
            .catch(err => console.log(err));
        })
    );
    passport.serializeUser(function (userObject, done) {
        
        let userGroup = "user";
        let userPrototype =  Object.getPrototypeOf(userObject);
    
        if (userPrototype === User.prototype) {
          userGroup = "user";
        } else if (userPrototype === Host.prototype) {
          userGroup = "host";
        }
    
        let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
        done(null,sessionConstructor);
      });
    
      passport.deserializeUser(function (sessionConstructor, done) {
    
        if (sessionConstructor.userGroup == 'user') {
          User.findOne({
              _id: sessionConstructor.userId
          }, '-localStrategy.password', function (err, user) {
              done(err, user);
          });
        } else if (sessionConstructor.userGroup == 'host') {
          Host.findOne({
              _id: sessionConstructor.userId
          }, '-localStrategy.password', function (err, user) { 
              done(err, user);
          });
        } 
    
      });
}






