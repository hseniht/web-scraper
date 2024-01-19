// public/app.js

function updateMetadata(metadata) {
  document.getElementById("title").textContent =
    "Title: " + (metadata.title || "Not found");
  document.getElementById("description").textContent =
    "Description: " + (metadata.description || "Not found");
  document.getElementById("keywords").textContent =
    "Keywords: " + (metadata.keywords || "Not found");
  document.getElementById("author").textContent =
    "Author: " + (metadata.author || "Not found");
  document.getElementById("image").textContent =
    "Image: " + (metadata.image || "Not found");
  document.getElementById("favicon").textContent =
    "Favicon: " + (metadata.favicon || "Not found");
  document.getElementById("url").textContent = "URL: " + metadata.url;
}

document.getElementById("myButton").addEventListener("click", async () => {
  console.log("tk html button clicked 2");
  const scrapeUrl = document.getElementById("scrapeUrl").value;
  try {
    const response = await axios.post("/api/data", { url: scrapeUrl });

    const data = await response.data;
    console.log("tk resp data", data);
    updateMetadata(data.metaData);
    document.getElementById("message").innerText = JSON.stringify(data);
  } catch (error) {
    console.error(error);
    document.getElementById("message").innerText = "Error occurred";
  }
});
