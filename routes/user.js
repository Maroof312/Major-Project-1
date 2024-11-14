const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route ("/signup")
    // Signup
    .get(userController.renderSignup)

    .post(wrapAsync(userController.signup));

router.route ("/login")
// Login
    .get(userController.renderLogin)

    .post(saveRedirectUrl,
        passport.authenticate
        ("local", 
            {failureRedirect:"/login", failureFlash: true}
        ),userController.renderLoginsuccess
    );

// Logout
router.get("/logout", userController.Logout);

module.exports = router;