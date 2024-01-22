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
  const scrapeUrl = document.getElementById("scrapeUrl").value;
  const parentSelector = document.getElementById("domSelector").value;
  const field1 = document.getElementById("field1").value;
  const selector1 = document.getElementById("selector1").value;
  const field2 = document.getElementById("field2").value;
  const selector2 = document.getElementById("selector2").value;

  childSelectors = [{ [field1]: selector1 }, { [field2]: selector2 }];
  console.log("tk dynamic arr", childSelectors);
  console.log("tk dynamic arr 1", childSelectors[1]);
  try {
    const response = await axios.post("/api/data", {
      url: scrapeUrl,
      parentSelector: parentSelector,
      childSelectors,
    });

    const data = await response.data;
    console.log("tk resp data", data);
    updateMetadata(data.metaData);
    document.getElementById("message").innerText = JSON.stringify(
      data.scrapedData || "not found"
    );
  } catch (error) {
    console.error(error);
    document.getElementById("message").innerText = "Error occurred";
  }
});
