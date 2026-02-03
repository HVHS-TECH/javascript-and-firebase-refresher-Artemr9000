//first step\\ 
console.log("Hello world")
document.getElementById("welcomeMessage").innerHTML = "You've connected to the JavaScript!";

//second step\\ 
document.addEventListener('DOMContentLoaded', () => {
function myFunction() {
  document.getElementById("demo").innerHTML = "Hello World";
}
});