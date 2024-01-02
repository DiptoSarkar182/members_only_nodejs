const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.createHash = async(password)=>{
    return await bcrypt.hash(password,10);
}

passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  
passport.deserializeUser(async (userId, done) => {
    try {
      const user = await User.findById(userId);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
});