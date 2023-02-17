const isLoggedIn = (req,res,next) => {
  if (req.session.activeUser === undefined){
    res.redirect("/auth/login")
  } else {
    next()
  }
}

const updateLocals = (req, res, next) => {
  if (req.session.activeUser === undefined) {
    res.locals.isUserActive = false
  } else {
    res.locals.isUserActive = true
  }
  next()
}

module.exports = {
  isLoggedIn: isLoggedIn,
  updateLocals: updateLocals
}