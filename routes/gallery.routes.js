const express = require("express");
const router = express.Router();
const Nft = require("../models/Nft.model.js");
const User = require("../models/User.model.js");

// GET "/gallery"
router.get("/", async (req, res, next) => {
  try {
    const availableNfts = await Nft.find({ isForSale: true });
    res.render("gallery/main.hbs", {
      availableNfts: availableNfts,
    });
  } catch (error) {
    next(error);
  }
});

// GET => renderizar vista de los detalles
router.get("/:id/details", async (req, res, next) => {
  try {
    const { id } = req.params;
    const nftDetails = await Nft.findById(id);
    let sameId = false;
    if (req.session.activeUser._id == nftDetails.owner) {
      sameId = true;
    } else {
      sameId = false;
    }
    res.render("nft/details.hbs", {
      nftDetails: nftDetails,
      sameId: sameId,
    });
  } catch (error) {
    next(error);
  }
});

// POST ==> lleva a cabo la transaccion de compra-venta
router.post("/:id/details", async (req, res, next) => {
  try {
    const { id } = req.params;
    const nftInfo = await Nft.findById(id).populate("owner");
    const walletSeller = nftInfo.owner.wallet + nftInfo.price;
    const transactionRest = req.session.activeUser.wallet - nftInfo.price;
    if (req.session.activeUser.wallet >= nftInfo.price) {
      await User.findByIdAndUpdate(nftInfo.owner._id, {
        wallet: walletSeller,
      });
      await Nft.findByIdAndUpdate(id, {
        owner: req.session.activeUser._id,
        isForSale: false,
      });
      await User.findByIdAndUpdate(req.session.activeUser._id, {
        wallet: transactionRest,
      });
      res.redirect("/profile");
    } else {
      const infoNft = await Nft.findByIdAndUpdate(id);
      res.render("nft/details.hbs", {
        nftDetails: infoNft,
        errorMessage: "You don't have enough credit to buy this Nft",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
