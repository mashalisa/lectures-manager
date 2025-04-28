const passport = require('passport');
//Passport.js is a middleware for Node.js that makes it easy to handle user authentication. 
// Log in with Google, Facebook, GitHub, etc.
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//users log in with their Google account
const session = require('express-session');
//express-session is a middleware for Node.js that makes it easy to handle user sessions

function setupPassport(app) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    scope: 'profile email' //scope is the information we want to access from the user's Google account
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  // 🔁 return the configured passport
  return passport;
}

module.exports = setupPassport;
