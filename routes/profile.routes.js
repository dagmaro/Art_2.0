const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/middlewares.js");
const User = require("../models/User.model.js");
const Nft = require("../models/Nft.model.js");
const Solicitude = require("../models/Solicitude.model.js");
const uploader = require("../middlewares/cloudinary.js");

// GET renderizamos el perfil del usuario
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const { _id } = req.session.activeUser;
    const profileDetails = await User.findById(_id);
    const userNft = await Nft.find({ owner: _id });
    const solictudeInfoPending = await Solicitude.find({
      pendingApproval: "pending",
    }).populate("owner");
    const solictudeInfoAccepted = await Solicitude.find({
      pendingApproval: "accepted",
    }).populate("owner");
    const solictudeInfoRejected = await Solicitude.find({
      pendingApproval: "rejected",
    }).populate("owner");
    let status = "";
    const loggedUserSolicitude = solictudeInfoPending.filter(
      (eachSolicitude) => {
        if (_id == eachSolicitude.owner._id) {
          return true;
        } else {
          return false;
        }
      }
    );
    if (loggedUserSolicitude[0] !== undefined) {
      status = loggedUserSolicitude[0].pendingApproval;
    } else {
      status = "";
    }
    res.render("profile/main.hbs", {
      profileDetails: profileDetails,
      userNft: userNft,
      pendingApproval: solictudeInfoPending,
      acceptedApproval: solictudeInfoAccepted,
      rejectedApproval: solictudeInfoRejected,
      status: status,
    });
  } catch (error) {
    next(error);
  }
});

// GET => para renderizar los detalles de las solicitudes
router.get("/:id/solicitude-details", async (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.activeUser._id;
  try {
    const profileDetails = await User.findById(userId);
    const solicitudeCreditAdmin = await Solicitude.find({
      pendingApproval: "pending",
    }).populate("owner");
    const eachSolicitude = await Solicitude.findById(id).populate("owner");
    res.render("profile/solicitude-details.hbs", {
      profileDetails: profileDetails,
      solicitudeCreditAdmin: solicitudeCreditAdmin,
      eachSolicitude: eachSolicitude,
    });
  } catch (error) {
    next(error);
  }
});

// POST => actualizar la DB con el resultado de la solicitud
router.post("/:id/solicitude-details/:response", async (req, res, next) => {
  const id = req.params.id;
  const response = req.params.response;
  try {
    const solicitudeInfo = await Solicitude.findById(id).populate("owner");
    const transactionCredit =
      solicitudeInfo.owner.wallet + solicitudeInfo.credit;
    const ownerId = solicitudeInfo.owner._id;

    if (response === "yes") {
      await Solicitude.findByIdAndUpdate(id, {
        pendingApproval: "accepted",
      });
      await User.findByIdAndUpdate(ownerId, {
        wallet: transactionCredit,
      });
    } else if (response === "no") {
      await Solicitude.findByIdAndUpdate(id, {
        pendingApproval: "rejected",
      });
    }
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

// GET => renderizar el formulario para editar los detalles del usuario
router.get("/edit", (req, res, next) => {
  res.render("profile/details.hbs");
});

// POST => editar el perfil de usuario
router.post("/edit", uploader.single("url"), async (req, res, next) => {
  try {
    const { _id } = req.session.activeUser;
    await User.findByIdAndUpdate(_id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      url: req.file.path,
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
router.post("/create", uploader.single("url"), async (req, res, next) => {
  try {
    await Nft.create({
      name: req.body.name,
      url: req.file.path,
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
  try {
    let { isForSale } = req.body;
    const { id } = req.params;
    if (!!isForSale === false) {
      isForSale = false;
    } else if (!!isForSale === true) {
      isForSale = true;
    }
    await Nft.findByIdAndUpdate(id, {
      isForSale: isForSale,
    });
    res.redirect(`/profile/${id}/details`);
  } catch (error) {
    next(error);
  }
});

// GET ==> renderizo el formulario de recarga de credito
router.get("/credit", async (req, res, next) => {
  const { _id } = req.session.activeUser;
  try {
    const userInfo = await User.findById(_id);
    res.render("profile/recharge-credit.hbs", {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
    });
  } catch (error) {
    next(error);
  }
});

// POST ==> solicitud de recarga de credito al admin
router.post("/credit", async (req, res, next) => {
  const { credit, cardNumber, expiration, secretCode } = req.body;
  if (
    credit === "" ||
    cardNumber === "" ||
    expiration === "" ||
    secretCode === ""
  ) {
    res.status(401).render("profile/recharge-credit.hbs", {
      errorMessage: "All fields should be completed",
    });
    return;
  }
  const passwordRegex1 = /^[0-9]{16,}$/;
  if (passwordRegex1.test(cardNumber) === false) {
    res.status(401).render("profile/recharge-credit.hbs", {
      errorMessage: "The card number should have 16 digits",
    });
    return;
  }
  const passwordRegex2 = /^[0-9]{3,4}$/;
  if (passwordRegex2.test(secretCode) === false) {
    res.status(401).render("profile/recharge-credit.hbs", {
      errorMessage: "The CVV should have 3 digits (4 in case of AMEX card)",
    });
    return;
  }
  try {
    await Solicitude.create({
      credit: credit,
      pendingApproval: "pending",
      owner: req.session.activeUser._id,
    });
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
