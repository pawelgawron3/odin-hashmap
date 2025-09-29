class HashMap {
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
}
