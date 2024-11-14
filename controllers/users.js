const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup");
}

module.exports.signup = async(req, res) => {
    try {
        let { username, email, password } = req.body;
        newUser = new User ({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login (registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("Success", "New User Added");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        console.log(e);
        res.render("users/signup");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.renderLoginsuccess = async(req, res) => {
    req.flash("Success","Welcome you're successfully logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("Success", "You're logged out");
        res.redirect("/listings");
    })
}