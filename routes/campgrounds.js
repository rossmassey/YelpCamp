const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const Comment = require('../models/comment');

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
router.post("/", isLoggedIn, function (req, res) {
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

// EDIT
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, campground) {
            res.render("campgrounds/edit", { campground: campground });
        });
    } else {
        console.log("Need to be logged in to do that");
    }
});

// UPDATE
router.put("/:id", checkCampgroundOwnership, function (req, res) {
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
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, campgroundRemoved) {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    })
});


function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("You are not campground creator");
                    res.redirect("back");
                }       
            }
        });
    } else {
        console.log("Need to be logged in to do that");
        res.redirect("back");
    }
};

//TODO move to middleware file
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;