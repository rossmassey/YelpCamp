const Campground = require('../models/campground');
const Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not comment creator");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Need to be logged in");
        res.redirect("back");
    }
};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {

                if (!campground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }

                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not campground creator");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Need to be logged in");
        res.redirect("back");
    }
};

module.exports = middlewareObj;