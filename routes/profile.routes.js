const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/middlewares.js");
const User = require("../models/User.model.js");
const Nft = require("../models/Nft.model.js");

// GET renderizamos el perfil
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const { _id } = req.session.activeUser;
    const profileDetails = await User.findById(_id);
    const userNft = await Nft.find({ owner: _id });
    res.render("profile/main.hbs", {
      profileDetails: profileDetails,
      userNft: userNft,
    });
  } catch (error) {
    next(error);
  }
});

// GET => renderizar el formulario para editar los detalles del usuario
router.get("/edit", (req, res, next) => {
  res.render("profile/details.hbs");
});

// POST => editar el perfil de usuario
router.post("/edit", async (req, res, next) => {
  try {
    const { _id } = req.session.activeUser;
    await User.findByIdAndUpdate(_id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      url: req.body.url,
    });
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

// GET => renderizar el formulario para crear un nft
router.get("/create", (req, res, next) => {
  res.render("nft/create-nft.hbs");
});

// POST crear un Nft
router.post("/create", async (req, res, next) => {
  try {
    await Nft.create({
      name: req.body.name,
      url: req.body.url,
      price: req.body.price,
      owner: req.session.activeUser._id,
      collectionType: req.body.collectionType,
    });
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

// GET => renderizar los detalles del NFT
router.get("/:id/details", async (req, res, next) => {
  try {
    const { id } = req.params;
    const nftDetails = await Nft.findById(id);
    res.render("nft/nft-profile-details.hbs", {
      nftDetails: nftDetails,
    });
  } catch (error) {
    next(error);
  }
});

// POST cambiar el estado de venta
router.post("/:id/details", async (req, res, next) => {
  //   console.log("El estado es", isForSale)
  try {
    let { isForSale } = req.body;
    const { id } = req.params;

    if (!!isForSale === false) {
      isForSale = true;
    } else if (!!isForSale === true) {
      isForSale = false;
    }
    await Nft.findByIdAndUpdate(id, {
      isForSale: isForSale,
    });
    res.redirect(`/profile/${id}/details`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
