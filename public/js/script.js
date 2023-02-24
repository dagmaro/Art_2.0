// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("Art_2.0 JS imported successfully!");
});

// Switch button
document
  .getElementById("flexSwitchCheckDefault")
  .addEventListener("change", () => {
    document.getElementById("details-nft").submit();
  });

// Scroll Button
const myButton = document.getElementById("myBtn");
window.onscroll = function () {
  scrollFunction();
};

function topFunction() {
  document.body.scrollTop = 0; // For safari
  document.documentElement.scrollTop = 0; // For Chrome...
}
