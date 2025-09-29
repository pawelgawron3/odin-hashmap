import { Node } from "./nodeClass.js";

class HashMap {
  constructor() {
    this._array = new Array(this.capacity);
  }

  loadFactor = 0.75;
  capacity = 16;

  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;

    for (let i = 0; i < key.length; i++) {
      hashCode = (hashCode * primeNumber + key.charCodeAt(i)) % this.capacity;
    }

    return hashCode;
  }

  set(key, value) {
    const hashCode = this.hash(key);
    let bucket = this._array[hashCode];

    let numOfElements = this._array.reduce((acc, bucket) => {
      return acc + (bucket ? 1 : 0);
    }, 0);
    if (numOfElements > this.capacity * this.loadFactor) {
      this.capacity *= 2;
      const oldArray = this._array;
      this._array = new Array(this.capacity);

      for (let i = 0; i < oldArray.length; i++) {
        let currentNode = oldArray[i];
        while (currentNode) {
          const newHashCode = this.hash(currentNode.key);
          this._array[newHashCode] = new Node(
            currentNode.key,
            currentNode.value,
            this._array[newHashCode]
          );

          currentNode = currentNode.nextNode;
        }
      }
    }

    if (bucket) {
      let currentNode = bucket;
      while (currentNode) {
        if (currentNode.key === key) {
          currentNode.value = value;
          return;
        } else {
          currentNode = currentNode.nextNode;
        }
      }
      let prevHeadNode = bucket;
      this._array[hashCode] = new Node(key, value, prevHeadNode);
      return;
    }
    this._array[hashCode] = new Node(key, value);
  }

  get(key) {
    const hashCode = this.hash(key);
    let bucket = this._array[hashCode];

    let currentNode = bucket;

    while (currentNode) {
      if (currentNode.key === key) {
        return currentNode.value;
      }
      currentNode = currentNode.nextNode;
    }
    return null;
  }

  has(key) {
    const hashCode = this.hash(key);
    let bucket = this._array[hashCode];

    let currentNode = bucket;

    while (currentNode) {
      if (currentNode.key === key) {
        return true;
      }
      currentNode = currentNode.nextNode;
    }
    return false;
  }

  remove(key) {
    const hashCode = this.hash(key);
    let bucket = this._array[hashCode];

    if (!bucket) {
      return false;
    }

    let currentNode = bucket;

    if (currentNode.key === key) {
      this._array[hashCode] = currentNode.nextNode;
      return true;
    }

    while (currentNode.nextNode) {
      if (currentNode.nextNode.key === key) {
        currentNode.nextNode = currentNode.nextNode.nextNode;
        return true;
      }
      currentNode = currentNode.nextNode;
    }
    return false;
  }

  length() {
    let numOfNodes = 0;
    let array = this._array;

    array.forEach((bucket) => {
      let currentNode = bucket;
      while (currentNode) {
        numOfNodes++;
        currentNode = currentNode.nextNode;
      }
    });

    return numOfNodes;
  }

  clear() {
    this._array = new Array(16);
  }

  keys() {
    return this._collect((node) => {
      return node.key;
    });
  }

  values() {
    return this._collect((node) => {
      return node.value;
    });
  }

  entries() {
    return this._collect((node) => {
      return [node.key, node.value];
    });
  }

  _collect(cb) {
    let result = [];

    for (let i = 0; i < this._array.length; i++) {
      let currentNode = this._array[i];
      while (currentNode) {
        result.push(cb(currentNode));
        currentNode = currentNode.nextNode;
      }
    }

    return result;
  }
}
