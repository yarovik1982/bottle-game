import { Bottle, rectWidth, rectHeight } from "./bottle.js";
import { drawScene } from "./render.js";
import { setupEventListeners } from "./events.js";

const container = document.querySelector(".container");
const rect = container.getBoundingClientRect();
const width = rect.width;
const height = rect.height;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const bottles = [];
const totalWidth = (rectWidth + 20) * 5 - 20;
const startX = (canvas.width - totalWidth) / 2;
const startY = (canvas.height - rectHeight) / 2;

for (let i = 0; i < 5; i++) {
    bottles.push(new Bottle(startX + i * (rectWidth + 20), startY, i < 4));
}

drawScene(ctx, canvas, bottles);
setupEventListeners(canvas, bottles);

document.getElementById("play").addEventListener("click", function () {
    this.style.display = "none";
    canvas.style.display = "block";
});
