const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../middlewares/middlewares.js")
const User = require("../models/User.model.js")

// GET renderizamos el perfil
router.get("/:id", isLoggedIn, async (req,res,next)=>{
  try {
    const { id } = req.params
    const profileDetails = await User.findById(id)
    res.render("profile/main.hbs", {
      profileDetails: profileDetails
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router;