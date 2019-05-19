class Node {
  x = 0;
  y = 0;
  gCost = 0;
  hCost = 0;
  parent = null;

  getFCost() {
    return this.gCost + this.hCost;
  }
}
