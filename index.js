/* */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const isUrl = require("is-url");
require("dotenv").config();
const app = express();

// App middleware

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

let counter = 0;

const shortendUrls = {};

// Response for POST request

app.post("/api/shorturl/", async (req, res) => {
  const url = req.body.url;
  shortendUrls[counter] = url;
  if (!isUrl(url)){
    return res.send({ error: "Invalid Url" });
  } else {
    return res.send({ original_url: req.body.url, short_url: counter++ });
  }
});

// Redirect Shortened URL to Original URL

app.get("/api/shorturl/:id", (req, res) => {
  const id = req.params.id;
  const url = shortendUrls[id];
  return res.redirect(url);
});

// Listens for connections

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`Node.js listening on port ${PORT}...`);
});
