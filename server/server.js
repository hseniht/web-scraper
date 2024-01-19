// src/app.js
// const getPosts = require("./scrapper");
const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const app = express();
const port = 3000;
const url = require("url");

// Serve static files from the "public" directory
app.use(express.static("../public"));

// Sanitize
function escapeColons(selector) {
  return selector.replace(/\:/g, "\\:");
}

// Handle requests to the root URL
app.get("/api/data", async (req, res) => {
  const targetUrl =
    "https://books.toscrape.com/catalogue/category/books/mystery_3/index.html";

  try {
    const response = await axios.get(targetUrl);
    const html = response.data;

    // Parse HTML using Cheerio
    const $ = cheerio.load(html);

    const selector = "h1";

    const modifiedSelector = escapeColons(selector);

    const scrapedData = $(selector, html).text();

    // Function to resolve relative URLs to absolute URLs
    function resolveRelativeUrl(baseUrl, relativeUrl) {
      return url.resolve(baseUrl, relativeUrl);
    }

    faviconRelativeUrl = $('link[rel="icon"]').attr("href");
    const faviconUrl = faviconRelativeUrl
      ? resolveRelativeUrl(targetUrl, faviconRelativeUrl)
      : null;

    const basicMeta = {
      title: $("head title").text(),
      description: $('meta[name="description"]').attr("content"),
      keywords: $('meta[name="keywords"]').attr("content"),
      author: $('meta[name="author"]').attr("content"),
      image: $('meta[property="og:image"]').attr("content"),
      favicon: faviconUrl,
      url: targetUrl,
    };
    res.json({ scrapedData: scrapedData, metaData: basicMeta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
