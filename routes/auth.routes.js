const express = require("express");
const router = express.Router();

const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

// GET => renderizar el formulario
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

// POST => reicibir/info
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.status(401).render("auth/signup.hbs", {
      errorMessage: "All fields should be completed",
    });
    return;
  }
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (passwordRegex.test(password) === false) {
    res.status(401).render("auth/signup.hbs", {
      error:
        "The password should have at least 8 char, one uppercase, one lowercase and special char",
    });
    return;
  }
  try {
    // si existe o no el usuario con ese nombre en la DB
    const uniqueUser = await User.findOne({ username: username });
    if (uniqueUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Username already exists",
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      username: username,
      password: hashPassword,
    });
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

// GET renderizar el formulario
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});
// POST recibir la info del formulario de login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.status(401).render("auth/login.hbs", {
      errorMessage: "All the fields should not be empty",
    });
    return;
  }
  try {
    const foundUser = await User.findOne({ username: username });
    if (foundUser === null) {
      res.render("auth/login.hbs", {
        errorMesssage: "Username is not registed",
      });
      return;
    }
    const passwordCorrect = await bcrypt.compare(password, foundUser.password);
    if (passwordCorrect === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Incorrect Password",
      });
      return;
    }
    req.session.activeUser = foundUser;
    req.session.save(() => {
      res.redirect("/profile");
    });
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
})

module.exports = router;
