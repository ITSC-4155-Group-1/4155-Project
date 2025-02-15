// sample test cases to make sure jest is running smoothly in the current build

const { add, isEven, greet } = require('./functions');

describe('Basic Functions Tests', () => {
    
    test('should correctly add two numbers', () => {
      expect(add(2, 3)).toBe(5); 
      expect(add(-1, 1)).toBe(0); 
    });
    test('should correctly check if a number is even', () => {
      expect(isEven(2)).toBe(true); 
      expect(isEven(3)).toBe(false); 
    }); 
    test('should return a greeting message', () => {
      expect(greet('John')).toBe('Hello, John!'); 
      expect(greet('Steve')).toBe('Hello, Steve!'); 
    });
  });