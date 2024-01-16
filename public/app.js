// public/app.js

document.getElementById("myButton").addEventListener("click", async () => {
  console.log("tk html button clicked 2");
  try {
    //   document.getElementById("message").innerText = "Button clicked!";
    const response = await fetch("/api/data"); // Assumes your server is running on the same domain
    const data = await response.json();
    console.log("tk resp data", data);
    document.getElementById("message").innerText = JSON.stringify(data);
  } catch (error) {
    console.error(error);
    document.getElementById("message").innerText = "Error occurred";
  }
});
