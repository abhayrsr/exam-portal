const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
    res.send("Listening");
})

app.listen(port, (req, res) => {
    console.log("server is listening to port number", port)
})