export class Game {
  container;
  canvas;
  context;
  playButton;
  boundingBox;

  constructor() {
      this.initContainer();
      this.initCanvas();
      this.initPlayButton();
  }

  initContainer () {
      const root = document.querySelector(".game");

      if (!root) {
          throw Error("There is no Game container");
      }

      this.container = root;
      this.boundingBox = root.getBoundingClientRect();
  }

  initCanvas () {
      const canvas = this.container.querySelector(".game__canvas");

      if (!canvas) {
          throw Error("There is no Canvas to draw");
      }

      canvas.width = this.boundingBox.width;
      canvas.height = this.boundingBox.height;

      this.canvas = canvas;
      this.context = canvas.getContext("2d");
  }

  initPlayButton() {
      const playButton = this.container.querySelector(".game__play-button");

      if (!playButton) {
          throw Error("There is no \"Play\" button");
      }

      playButton.addEventListener("click", () => this.start());
  }

  start() {
      this.container.classList.add("game--running");
  }

  finish() {
      this.container.classList.remove("game--running");
  }
}
