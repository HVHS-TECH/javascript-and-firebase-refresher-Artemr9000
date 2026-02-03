//first step\\ 
console.log("Hello world")
document.getElementById("welcomeMessage").innerHTML = "You've connected to the JavaScript!";

//second step\\ 
function myFunction() {
  document.getElementById("welcomeMessage").innerHTML = "Hello World";
}

//third step\\ 
function thirdstep() {
  var x = document.getElementById("myText").value;
  document.getElementById("demo").innerHTML = x;
}