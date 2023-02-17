const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../middlewares/middlewares.js")
const User = require("../models/User.model.js")
const Nft = require("../models/Nft.model.js")

// GET renderizamos el perfil
router.get("/", isLoggedIn, async (req,res,next)=>{
  try {
    const { _id } = req.session.activeUser
    const profileDetails = await User.findById(_id)
    const userNft = await Nft.find({owner: _id})
    res.render("profile/main.hbs", {
      profileDetails: profileDetails,
      userNft: userNft
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router;