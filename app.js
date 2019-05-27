"use strict";

const   express = require('express'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        localStrategy = require('passport-local'),
        methodOverride = require('method-override'),
        expressSanitizer    = require('express-sanitizer');

const   Campground = require("./models/campground"),
        Comment = require("./models/comment"),
        User = require("./models/user");

const   indexRoutes = require("./routes/index"),
        campgroundRoutes = require("./routes/campgrounds"),
        commentRoutes = require("./routes/comments");

//const seedDB = require("./seeds")
//seedDB();

const port = 3000;
const app = express();

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(require('express-session')({
    secret: "Ross is my name",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user; // adds currentUser to all of our templates
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(port, function () {
    console.log("YelpCamp has started at http://localhost:" + port + "\n")
});