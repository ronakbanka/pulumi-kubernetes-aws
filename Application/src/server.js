"use strict";
const express = require("express");

let value = process.env.VALUE || "abc123"

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

var data = "Hello World" + " " + value

// App
const app = express();
app.get('/', (req, res) => {
  res.send(data);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);