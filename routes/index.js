const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        })
    });
});

router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) { });

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

//TODO move to middleware file
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;