const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

// temporary, until mongodb added
let campgrounds = [
    {name: "Camp 1", image:"https://live.staticflickr.com/2416/5821513608_053ed3fd70_b.jpg"},
    {name: "Camp 2", image:"https://cdn.pixabay.com/photo/2017/08/06/02/32/camp-2587926_960_720.jpg"},
    {name: "Camp 3", image:"https://live.staticflickr.com/2512/5733464781_8787e851b0_b.jpg"}
]

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req,res) {
    res.render("landing");
});

app.get("/campgrounds", function(req,res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req,res) {
    let name = req.body.name;
    let image = req.body.url;
    let newCampground = {name: name, image: image};

    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req,res) {
    res.render("new")
});

app.listen(port, function() {
    console.log("YelpCamp has started");
})