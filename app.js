"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Campground = require("./models/campground");

const port = 3000;

const seedDB = require("./seeds")
//seedDB();



mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX
app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", { campgrounds: campgrounds });
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
app.get("/campgrounds/new", function (req, res) {
    res.render("new")
});

// SHOW
app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { campground: campground });
        }
    });
});

app.listen(port, function () {
    console.log("YelpCamp has started");
    console.log("http://localhost:" + port + "\n")
});