const Campground = require('../models/campground');
const Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("You are not comment creator");
                    res.redirect("back");
                }       
            }
        });
    } else {
        console.log("Need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
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

module.exports = middlewareObj;