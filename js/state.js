class State {
  #activeBottleIndex;

  constructor() {
    this.activeBottleIndex = null;
  }

  set activeBottle(index) {
    this.activeBottleIndex = index; 
  }

  get activeBottle() {
    return this.activeBottleIndex
  }
}

export const state = new State();