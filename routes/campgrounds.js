const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middleware = require("../middleware");

// INDEX
router.get("/", function (req, res) {
    ;
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    })
});

// CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    let newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.sanitize(req.body.description),
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
router.get("/new", middleware.isLoggedIn, function (req, res) {
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

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, campground) {
            res.render("campgrounds/edit", { campground: campground });
        });
    } else {
        req.flash("error", "Please login first!");
    }
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    let newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.sanitize(req.body.description),
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Campground.findByIdAndUpdate(req.params.id, newCampground, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Updated " + campground.name);
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany({ _id: { $in: campground.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            req.flash("success", "Deleted " + campground.name);
            res.redirect("/campgrounds");
        });
    })
});

module.exports = router;