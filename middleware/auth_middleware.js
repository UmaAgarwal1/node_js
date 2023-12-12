const isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.user_id) {
      return res.redirect("/"); // Redirect to login page if not logged in
    }
    next(); // Continue with the request if logged in
  };
  
module.exports = isAuthenticated;