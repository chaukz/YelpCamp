module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in to create a new campground!');
    return res.redirect('/login');
  } 
  next();    
}
