"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');

const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");

//const seedDB = require("./seeds")
//seedDB();

const port = 3000;
const app = express();

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(require('express-session')({
    secret: "Ross is my name",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user; // adds currentUser to all of our templates
    next();
});

app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX
app.get("/campgrounds", function (req, res) {;
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds});
        }
    })
});

// CREATE
app.post("/campgrounds", function (req, res) {
    let newCampground = { name: req.body.name, image: req.body.image, description: req.body.description };
    Campground.create(newCampground, function (err, thing) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
            console.log("Added:");
            console.log(thing);
        }
    });

});

// NEW
app.get("/campgrounds/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new")
});

// SHOW
app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: campground });
        }
    });
});

// NEW
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });

});

// CREATE
app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
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

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) { });

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

app.listen(port, function () {
    console.log("YelpCamp has started at http://localhost:" + port + "\n")
});