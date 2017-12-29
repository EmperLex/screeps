var BinaryMinHeap = require('../dist/ds.js');

function arrayMin(arr) {
  return arr.reduce(function (p, v) {
    return ( p < v ? p : v );
  });
}

function arrayMax(arr) {
  return arr.reduce(function (p, v) {
    return ( p > v ? p : v );
  });
}

var fs = require('fs');
var data = fs.readFileSync('./random_numbers.txt', 'utf-8');
var numbers = data.split('\n');

var numberArray = [];
for (var n of numbers) {
  numberArray.push(parseInt(n));
}

var min = Math.min.apply(null, numberArray);
var max = Math.max.apply(null, numberArray);

var t0 = new Date().getTime();
var binMinHeap = new BinaryMinHeap();
for (var n of numberArray) {
  binMinHeap.add( { value: n } );
}
console.log(new Date().getTime() - t0 + " msecs");
