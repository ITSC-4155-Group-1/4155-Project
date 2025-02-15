// Simple test functions to ensure jest is working
// try running them with npm test 

function add(a, b) {
    return a + b;
  }
  function isEven(num) {
    return num % 2 === 0;
  }

  function greet(name) {
    return `Hello, ${name}!`;
  }
  
  module.exports = { add, isEven, greet };

