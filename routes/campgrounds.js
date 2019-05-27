const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const Comment = require('../models/comment');

// INDEX
router.get("/", function (req, res) {;
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds});
        }
    })
});

// CREATE
router.post("/", isLoggedIn, function (req, res) {
    let newCampground = { 
        name: req.body.name, 
        image: req.body.image, 
        description: req.body.description ,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    console.log(newCampground);
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
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new")
});

// SHOW
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: campground });
        }
    });
});

//TODO move to middleware file
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;