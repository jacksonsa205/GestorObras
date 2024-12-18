// authMiddleware.js

const checkSession = (req, res, next) => {
  // If there is no session, redirect to '/'
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }
  // If the session is present, proceed to the next middleware or route handler
  next();
};

module.exports = {
  checkSession,
};
