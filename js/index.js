import { Game } from "./Game.js";
import { Bottle } from "./bottle.js";
import { state } from "./state.js";
import { drawScene } from "./render.js";
import { isPointInRect } from "./library.js";

const game = new Game();

// Setup game, creating bottles
const bottles = [];
const bottlesAmount = 6;
const filledBottlesAmount = 4;

const bottlesWidth = (Bottle.width * bottlesAmount) + (Bottle.gap * bottlesAmount) - Bottle.gap;
const startX = (game.canvas.width - bottlesWidth) / 2;
const y = (game.canvas.height - Bottle.height) / 2;

for (let i = 0; i < bottlesAmount; i++) {
    const fillBottle = i < filledBottlesAmount;
    const x = startX + i * (Bottle.width + Bottle.gap);
    const bottle = new Bottle(x, y, fillBottle);

    bottles.push(bottle);
}

// Setup actions with bottles
game.canvas.addEventListener("click", event => {
    const mouse = {
        x: event.clientX - game.boundingBox.left,
        y: event.clientY - game.boundingBox.top
    }

    const clickedBottle = bottles.find((bottle) => isPointInRect(mouse, bottle)) || null;

    // Variants:
    // 1: clickedBottle && state.activeBottle && clickedBottle === state.activeBottle // Click by bottle itself, DO NOTHING
    // 2: clickedBottle && state.activeBottle && clickedBottle !== state.activeBottle // Click by another bottle, POUR ANOTHER BOTTLE
    // 3: clickedBottle && !state.activeBottle                                        // Click by unselected bottle, SELECT BOTTLE
    // 4: !clickedBottle && state.activeBottle                                        // Click by empty space, UNSELECT BOTTLE
    // 5: !clickedBottle && !state.activeBottle                                       // Click by empty space, DO NOTHING

    if (clickedBottle === state.activeBottle) {
        return                                      // Do 1 && 5
    }

    if (!state.activeBottle) {
        clickedBottle.select();                     // Do 3
    } else if (!clickedBottle) {
        state.activeBottle.unselect();              // Do 4
    } else {
        state.activeBottle.pour(clickedBottle);   // Do 2
    }
});

// Run game
drawScene(game.context, bottles);
