var assert = require('chai').assert;

var BinaryMinHeap = require('../dist/ds.js');

describe('binary heap', function() {

  it('should return undefined as min for empty heaps', function() {
    let binMinHeap = new BinaryMinHeap();
    assert.strictEqual(binMinHeap.getMin(), undefined);
  });

  it('should return 0 as size for empty heaps', function() {
    let binMinHeap = new BinaryMinHeap();
    assert.strictEqual(binMinHeap.size(), 0);
  });

  it('should return the only item if there is only one in it', function() {
    let binMinHeap = new BinaryMinHeap();
    binMinHeap.add({ value : Number.MIN_SAFE_INTEGER });
    assert.strictEqual(binMinHeap.getMin().value, Number.MIN_SAFE_INTEGER);
  });

  it('should return the min if min and max is added', function() {
    let binMinHeap = new BinaryMinHeap();
    binMinHeap.add({ value : Number.MAX_SAFE_INTEGER });
    binMinHeap.add({ value : Number.MIN_SAFE_INTEGER });
    assert.strictEqual(binMinHeap.getMin().value, Number.MIN_SAFE_INTEGER);
  });

  it('should return the correct min for heaps with floats', function() {
    let minHeap = new BinaryMinHeap();
    minHeap.add({ item: 'A', value: 10.332});
    minHeap.add({ item: 'B', value: 20.323});
    minHeap.add({ item: 'C', value: 5.7556});
    minHeap.add({ item: 'D', value: 13.1});
    minHeap.add({ item: 'E', value: 2.0});
    minHeap.add({ item: 'F', value: 45.33450});
    minHeap.add({ item: 'G', value: 1.551});
    minHeap.add({ item: 'H', value: 45.5512});
    minHeap.add({ item: 'I', value: -55.2211});
    minHeap.add({ item: 'J', value: -23.11});
    minHeap.add({ item: 'K', value: 12.6123});
    minHeap.add({ item: 'L', value: 11.566612});
    minHeap.add({ item: 'M', value: 99.63351});
    minHeap.add({ item: 'N', value: 2331.251});
    minHeap.add({ item: 'O', value: -3.1});
    minHeap.add({ item: 'P', value: -0});
    assert.strictEqual(minHeap.getMin().value, -55.2211);
  });
});
