module.exports = BinaryMinHeap;

/**
 Contructor
 @constructor
 **/
function BinaryMinHeap() {
      this._arr = [];
}

// { item: new Object(), value: 10 }
BinaryMinHeap.prototype.add = function add(item) {
  this._arr.push(item);
  this.checkHeap(this._arr.length - 1);
};

BinaryMinHeap.prototype.parent = function parent(index) {
  if(index == 0) {
    return 0;
  }
  return Math.trunc((index - 1) / 2);
};

BinaryMinHeap.prototype.left = function left(index) {
  return 2 * index + 1;
};

BinaryMinHeap.prototype.right = function right(index) {
  return 2 * index + 2;
};

BinaryMinHeap.prototype.checkHeap = function checkHeap(index) {
  let idx = index;
  let pidx = this.parent(idx);

  while(idx != 0 && this._arr[idx].value < this._arr[pidx].value) {
    this.swap(idx, pidx);
    idx = pidx;
    pidx = this.parent(idx);
  }
};

BinaryMinHeap.prototype.swap = function swap(idx1, idx2) {
  let tmp = this._arr[idx1];
  this._arr[idx1] = this._arr[idx2];
  this._arr[idx2] = tmp;
};

BinaryMinHeap.prototype.getMin = function getMin() {
  if(this._arr.length == 0) {
    return undefined;
  }
  return this._arr[0];
};

BinaryMinHeap.prototype.size = function size() {
  return this._arr.length;
};
