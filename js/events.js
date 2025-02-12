export function setupEventListeners(canvas, bottles) {
    let activeBottle = null;

    canvas.addEventListener("click", (e) => {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;

        const clickedBottle = bottles.find(
            (bottle) =>
                mouseX > bottle.x &&
                mouseX < bottle.x + 50 &&
                mouseY > bottle.y &&
                mouseY < bottle.y + 150
        );

        if (!clickedBottle) return;

        if (!activeBottle) {
            activeBottle = clickedBottle;
            activeBottle.liftUp();
        } else if (activeBottle !== clickedBottle) {
            activeBottle.moveTo(clickedBottle, () => {
                activeBottle = null;
            });
        } else {
            activeBottle.resetPosition();
            activeBottle = null;
        }
    });
}
