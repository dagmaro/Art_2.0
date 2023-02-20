const isLoggedIn = (req,res,next) => {
  if (req.session.activeUser === undefined){
    res.redirect("/auth/login")
  } else {
    isAdmin(req, res)
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

const isAdmin = (req, res)=> {
  if (req.session.activeUser.userType === "admin"){
    res.locals.isUserAdmin = true
  } else {
    res.locals.isUserAdmin = false
  }
}


module.exports = {
  isLoggedIn: isLoggedIn,
  updateLocals: updateLocals,
}