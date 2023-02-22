// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("Art_2.0 JS imported successfully!");
});

// document.getElementById("details-nft").addEventListener("submit", (e)=>{
//   e.preventDefault()
// })

document.getElementById("flexSwitchCheckDefault")
.addEventListener("change", ()=>{
  document.getElementById("details-nft").submit()
})

const myButton = document.getElementById("myBtn")

window.onscroll = function() {scrollFunction()}

function topFunction() {
  document.body.scrollTop = 0; // For safari
  document.documentElement.scrollTop = 0; // For Chrome...
}