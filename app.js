const express = require('express');
const app = express();

const port = 3000;

app.get("/", function(req,res) {
    res.send("YelpCamp");
});

app.listen(port, function() {
    console.log("YelpCamp has started");
})