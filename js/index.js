import { Bottle, rectWidth, rectHeight } from "./bottle.js";
import { drawScene } from "./render.js";
import { setupEventListeners } from "./events.js";

class Game {
    container;
    rect;

    constructor() {
        this.initContainer();
    }

    initContainer () {
        const root = document.querySelector(".game");

        if (!root) {
            throw Error('There is no Game container');
        }

        this.container = root;
        this.rect = root.getBoundingClientRect();        
    }

    start() {
        this.container.classList.add('game--running');
    }

    finish() {
        this.container.classList.remove('game--running');
    }
}

const game = new Game();
const canvas = game.container.querySelector(".game__canvas");
const playButton = game.container.querySelector(".game__play-button");

const ctx = canvas.getContext("2d");
canvas.width = game.rect.width;
canvas.height = game.rect.height;

const bottles = [];
const totalWidth = (rectWidth + 20) * 5 - 20;
const startX = (canvas.width - totalWidth) / 2;
const startY = (canvas.height - rectHeight) / 2;

for (let i = 0; i < 5; i++) {
    bottles.push(new Bottle(startX + i * (rectWidth + 20), startY, i < 4));
}

drawScene(ctx, canvas, bottles);
setupEventListeners(canvas, bottles);

playButton.addEventListener("click", () => game.start());
