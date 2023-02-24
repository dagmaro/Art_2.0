const express = require("express");
const router = express.Router();
const { updateLocals } = require("../middlewares/middlewares.js");
router.use(updateLocals);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const galleryRoutes = require("./gallery.routes.js");
router.use("/gallery", galleryRoutes);

const authRoutes = require("./auth.routes.js");
router.use("/auth", authRoutes);

const profileRoutes = require("./profile.routes.js");
router.use("/profile", profileRoutes);

module.exports = router;
