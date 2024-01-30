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

function addListItem() {
  // Determine the number of existing list items
  var list = document.getElementById("dynamicList");
  var itemCount = list.getElementsByTagName("li").length + 1;

  // Create new list item
  var newItem = document.createElement("li");

  // Create labels and inputs
  var label1 = document.createElement("label");
  label1.setAttribute("for", "field" + itemCount);
  label1.textContent = "Child " + itemCount + ":";

  var input1 = document.createElement("input");
  input1.setAttribute("type", "text");
  input1.setAttribute("id", "field" + itemCount);

  var label2 = document.createElement("label");
  label2.setAttribute("for", "selector" + itemCount);
  label2.textContent = "selector " + itemCount + ":";

  var input2 = document.createElement("input");
  input2.setAttribute("type", "text");
  input2.setAttribute("id", "selector" + itemCount);

  // Append labels and inputs to the new list item
  newItem.appendChild(label1);
  newItem.appendChild(input1);
  newItem.appendChild(label2);
  newItem.appendChild(input2);

  // Append the new list item to the existing list
  list.appendChild(newItem);
}

const mapFieldsToSelectorArray = () => {
  const childSelectors = [];

  // Get values of scrapeUrl and parentSelector
  const scrapeUrl = document.getElementById("scrapeUrl").value;
  const parentSelector = document.getElementById("domSelector").value;

  // Get the number of existing list items
  const listItemCount = document.querySelectorAll("#dynamicList li").length;

  // Iterate through each list item to get field-value and selector-value pairs
  for (let i = 1; i <= listItemCount; i++) {
    const field = document.getElementById("field" + i).value;
    const selector = document.getElementById("selector" + i).value;

    // Create an object with field-value and selector-value pairs
    const childSelectorObj = {};
    childSelectorObj[field] = selector;

    // Push the object to the childSelectors array
    childSelectors.push(childSelectorObj);
  }

  return {
    scrapeUrl: scrapeUrl,
    parentSelector: parentSelector,
    childSelectors: childSelectors,
  };
};

const snippitizer = (items) => {
  const terminalElement = document.getElementById("scrappedData");
  terminalElement.innerHTML = "<span>Scraped data = [</span><br>";

  items.forEach((item) => {
    terminalElement.innerHTML += `<span>&nbsp;&nbsp;&nbsp;&nbsp;${JSON.stringify(
      item
    )},</span><br>`;
  });

  terminalElement.innerHTML += "<span>];</span>";
};

const result = mapFieldsToSelectorArray();
console.log(result);

document.getElementById("myButton").addEventListener("click", async () => {
  const { scrapeUrl, parentSelector, childSelectors } =
    mapFieldsToSelectorArray();
  try {
    const response = await axios.post("/api/data", {
      url: scrapeUrl,
      parentSelector: parentSelector,
      childSelectors,
    });

    const data = await response.data;
    if (data.scrapedData.length > 0) {
      snippitizer(data.scrapedData);
      document.getElementById("message").innerText = "";
    } else {
      console.log("tk resp shorter");
      document.getElementById("scrappedData").innerHTML = "";
      document.getElementById("message").innerText = "not found";
    }
    updateMetadata(data.metaData);
  } catch (error) {
    console.error(error);
    document.getElementById("message").innerText = "Error occurred";
  }
});
