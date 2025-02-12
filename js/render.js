export function drawScene(ctx, canvas, bottles) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bottles.forEach((bottle) => bottle.draw(ctx));
    requestAnimationFrame(() => drawScene(ctx, canvas, bottles));
}
