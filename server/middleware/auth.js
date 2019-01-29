const models = require('../models');
const Promise = require('bluebird');

/*
In middleware/auth.js, write a createSession middleware function that accesses the parsed cookies on the request, looks up the user data related to that session, and assigns an object to a session property on the request that contains relevant user information. (Ask yourself: what information about the user would you want to keep in this session object?)
Things to keep in mind:
An incoming request with no cookies should generate a session with a unique hash and store it the sessions database. The middleware function should use this unique hash to set a cookie in the response headers. (Ask yourself: How do I set cookies using Express?).
If an incoming request has a cookie, the middleware should verify that the cookie is valid (i.e., it is a session that is stored in your database).
If an incoming cookie is not valid, what do you think you should do with that session and cookie?

  // Access parsed cookies on the request
    // verify that the cookie is valid
      // if not a valid cookie
        // terminate any session
        // Get rid of cookie?
    // Look up user data related to the session
      // Create a session property on the request
        // username and userID
    // If no cookies on the request
    // Create new session with a unique hash
      // set a cookie in the response header

*/


module.exports.createSession = (req, res, next) => {
  // Access parsed cookies on request
  Promise.resolve(req.cookies)
  .then((cookie)=> {
    var hash = cookie.shortlyid;
    if(!hash) { // verify if cookie has a hash
      throw new Error('no hash found');
    }
    return models.Sessions.get({ hash })  // if the cookie has a hash, get the existing session
  })
  .then((session) => {
    // Check if valid session is found with cookie
    if (!session) {
      // need to throw away not valid/malicious cookie before creating new session?
      throw new Error ('No session is found');
    }
    // get username from Users table
    return models.Users.get({id: session.userId});
  })
  .then(user => {
    // Create a session property on the request
    // username, userID, and hash
    req.session = {user: {username: user.username}, userId: user.id, hash: req.cookies.shortlyid};
    // what to do next, such as send us to another page
    next();
  })
  .catch((err) => {
    // Creating a new session
    models.Sessions.create()
    .then(results => {
      // look up recently created session and get all the parameters for the session
      return models.Sessions.get({id: results.insertId});
    })
    .then (session => {
      // creating a new cookie and attaching to the response
      res.cookie('shortlyid', session.hash);
      // Updating the request with the new session
      req.session = {user: {username: null}, userId: null, hash: session.hash};
      // do the next thing, such as go to a different page
      next();
    })
  })

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

