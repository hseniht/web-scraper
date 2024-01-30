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

// Parse JSON request bodies
app.use(express.json());

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

// POST
app.post("/api/data", async (req, res) => {
  const requestData = req.body;
  // res.json({ message: "POST request received " + requestData.url });

  const targetUrl = requestData.url;
  const parentSelector = requestData.parentSelector;
  const childSelectors = requestData.childSelectors;
  const scrapedData = [];
  try {
    const response = await axios.get(targetUrl);
    const html = response.data;

    // Parse HTML using Cheerio
    const $ = cheerio.load(html);

    const modifiedSelector = escapeColons(parentSelector);

    const scrapedDom = $(parentSelector, html);

    // console.log("tk scrapedDOM", $(parentSelector).attr('class'));
    // make it more dynamic base on input

    scrapedDom.each(function () {
      const dataObject = {}; // Create an empty object to store each pair of title and price

      for (let i = 0; i < childSelectors.length; i++) {
        const field = Object.keys(childSelectors[i]);
        const text = $(this).find(childSelectors[i][field]).text().trim();

        if (field.length > 0) {
          // Add the key-value pair to the dataObject
          dataObject[field[0]] = text;
        }
      }

      // Push the combined title and price to scrapedData
      scrapedData.push(dataObject);
    });

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
