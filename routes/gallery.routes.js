const express = require("express");
const router = express.Router();
const {isLoggedIn, updateLocals} = require("../middlewares/middlewares.js")
router.use(updateLocals)
const Nft = require("../models/Nft.model.js")


// GET "/gallery"
router.get("/", async (req, res, next)=> {
  
  try {
    const availableNfts = await Nft.find({isForSale: true})
    res.render("gallery/main.hbs", {
      availableNfts: availableNfts
    })
  } catch (error) {
    next(error)
  }
})


module.exports = router;