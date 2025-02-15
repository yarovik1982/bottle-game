export function drawScene(ctx, bottles) {
    ctx.reset();
    bottles.forEach(bottle => bottle.draw(ctx));
    requestAnimationFrame(() => drawScene(ctx, bottles));
}
