import { state } from "./state.js";
import { coinFlip, clamp } from "./library.js";

export class Bottle {
    static border = 2;
    static width = 50;
    static height = 150;
    static capacity = 4;
    static gap = 20;

    constructor(x, y, filled = true) {
        this.x = x;
        this.y = y;
        this.xOrigin = x;
        this.yOrigin = y;
        this.width = this.constructor.width;
        this.height = this.constructor.height;
        this.angle = 0;
        this.liquids = filled ? this.addLiquids() : [];
    }

    addLiquids() {
        const size = {
            height: this.constructor.height / (this.constructor.capacity + 1),
            width: this.constructor.width - this.constructor.border / 2
        }

        return [
            { type: "milk", color: "white", ...size },
            { type: "lava", color: "red", ...size },
            { type: "water", color: "blue", ...size },
            { type: "juice", color: "yellow", ...size },
            { type: "glue", color: "green", ...size },
        ].slice(-this.constructor.capacity).sort(coinFlip);
    }

    getLiquids(max) {
        const liquid = this.liquids.at(-1);
        const amount = this.liquids.length - (this.liquids.findLastIndex(currentLiquid => currentLiquid.type !== liquid.type) + 1);

        return this.liquids.slice(-Math.min(amount, max))
    }

    // Bottle Control

    select() {
        if (!this.liquids.length) {
            this.shake()

            return
        }

        state.activeBottle = this;
        this.lift()
    }

    unselect() {
        state.activeBottle = null;
        this.restore()
    }

    pour(target) {
        if (target.liquids.length >= this.constructor.capacity) {
            target.shake()

            return
        }

        this.moveTo(target)
    }

    // Bottle Render

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.translate(-this.width / 2, -this.height / 2);

        // Колба
        ctx.strokeStyle = "#CCC";
        ctx.beginPath();
        ctx.roundRect(0, 0, this.width, this.height, [0, 0, this.width, this.width])
        ctx.rect(-this.width * 0.1, 0, this.width * 1.2, -this.height * 0.1);
        ctx.stroke();

        // Жидкости
        this.liquids.forEach((liquid, index) => {
            const position = index + 1
            const x = 0
            const y = this.height - liquid.height * position

            ctx.fillStyle = liquid.color;
            ctx.beginPath();

            index
                ? ctx.rect(x, y, liquid.width, liquid.height)
                : ctx.roundRect(x, y, liquid.width, liquid.height - this.constructor.border / 2, [0, 0, this.width, this.width]);

            ctx.fill();
        });

        ctx.restore();
    }

    // Bottle Animations

    lift() { // Still Without Animation
        this.y = this.yOrigin - 75;
    }

    restore() { // Still Without Animation
        this.x = this.xOrigin;
        this.y = this.yOrigin;
        this.angle = 0;
    }

    shake() { // Bad Animation
        this.x = this.xOrigin + 5;
        
        setTimeout(() => {
            this.x = this.xOrigin - 5;

            setTimeout(() => {
                this.x = this.xOrigin + 5;

                setTimeout(() => {
                    this.x = this.xOrigin;
                }, 100)
            }, 100)
        }, 100)
    }

    moveTo(target) { // Good Animation
        const maxLiquidsToTransfer = target.constructor.capacity - target.liquids.length;
        const liquidsToTransfer = this.getLiquids(maxLiquidsToTransfer);

        const speed = 1.2;
        const startTime = document.timeline.currentTime;
        const offset = this.constructor.width + this.constructor.gap;

        const direction = target.x > this.x ? 1 : -1;
        const distance = target.x - this.x - offset * direction
        const duration = Math.abs(distance / speed);
        const finalAngle = 45 * direction

        const animateMove = (currentTime) => {
            const progress = clamp(0, (currentTime - startTime) / duration, 1)

            this.x = this.xOrigin + distance * progress;
            this.angle = finalAngle * progress;

            if (progress < 1) {
                requestAnimationFrame(animateMove)
            } else {
                this.pourIn(target, liquidsToTransfer)
            }
        };

        requestAnimationFrame(animateMove);
    }

    pourIn(target, transferLiquids) { // Bad Animation

        setTimeout(() => {
            this.liquids.splice(-transferLiquids.length);

            setTimeout(() => {
                target.liquids.push(...transferLiquids)

                setTimeout(() => {
                    this.unselect()
                }, 300);
            }, 300);
        }, 300);
    }
}
