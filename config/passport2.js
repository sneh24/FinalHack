const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Host = require('../models/hostModel');

module.exports = function(passport) {
    passport.use(
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
    passport.serializeUser((host, done) => {
        done(null, host.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, host) => {
          done(err, host);
        });
      });
}