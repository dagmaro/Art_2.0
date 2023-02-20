const express = require("express");
const router = express.Router();
const Nft = require("../models/Nft.model.js")
const { isLoggedIn } = require("../middlewares/middlewares.js");
const User = require("../models/User.model.js");

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

// GET => renderizar vista de los detalles
router.get("/:id/details", async (req, res, next) => {
  try {
    const { id } = req.params;
    const nftDetails = await Nft.findById(id);
    // console.log(nftDetails)
    res.render("nft/details.hbs", {
      nftDetails: nftDetails,
    });
  } catch (error) {
    next(error);
  }
})
// POST
router.post("/:id/details", async (req, res, next) => {
 try {
  const{id} = req.params;
  console.log(req.session.activeUser._id)
  await Nft.findByIdAndUpdate(id, {
    owner: req.session.activeUser._id,
    isForSale: false
  })
  // const updateCredit = await User.findByIdAndUpdate(req.session.activeUser._id).select("wallet")
  res.redirect("/profile")

 } catch (error) {
  next(error)
 }
})

module.exports = router;