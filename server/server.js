// src/app.js
// const getPosts = require("./scrapper");
const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static("../public"));

// Sanitize
function escapeColons(selector) {
  return selector.replace(/\:/g, "\\:");
}

// Handle requests to the root URL
app.get("/api/data", async (req, res) => {
  const url =
    "https://books.toscrape.com/catalogue/category/books/mystery_3/index.html";

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const selector = "h1";

    const modifiedSelector = escapeColons(selector);

    const scrapedData = $(selector, html).text();
    res.json(scrapedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
