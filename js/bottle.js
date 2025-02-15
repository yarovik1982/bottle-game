import { state } from "./state.js";

export const rectWidth = 50;
export const rectHeight = 150;
const borderWidth = 2;
const ovalHeight = 10;
const liquidHeight = rectHeight * 0.2;
const maxLiquids = 4;
const colors = ["red", "blue", "yellow", "green"];

export class Bottle {
    constructor(x, y, hasLiquids = true) {
        this.x = x;
        this.y = y;
        this.width = rectWidth;
        this.height = rectHeight;
        this.originalX = x;
        this.originalY = y;
        this.angle = 0;
        this.liquids = hasLiquids ? this.getRandomLiquids() : [];
    }

    getRandomLiquids() {
        return [...colors].sort(() => Math.random() - 0.5).slice(0, maxLiquids);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + rectWidth / 2, this.y + rectHeight / 2);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.translate(-rectWidth / 2, -rectHeight / 2);

        // Овал сверху
        ctx.beginPath();
        ctx.ellipse(
            rectWidth / 2,
            borderWidth,
            rectWidth / 2,
            ovalHeight / 2,
            0,
            0,
            Math.PI * 2
        );
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = borderWidth;
        ctx.stroke();

        // Прямоугольник бутылки
        ctx.beginPath();
        ctx.moveTo(0, borderWidth + ovalHeight / 2 - 5);
        ctx.lineTo(0, rectHeight);
        ctx.lineTo(rectWidth, rectHeight);
        ctx.lineTo(rectWidth, borderWidth + ovalHeight / 2 - 5);
        ctx.stroke();

        // Жидкости внутри
        this.liquids.forEach((color, index) => {
            ctx.fillStyle = color;
            ctx.fillRect(
                0,
                rectHeight - (index + 1) * liquidHeight,
                rectWidth,
                liquidHeight
            );
        });

        ctx.restore();
    }

    select() {
        state.activeBottle = this;
        this.liftUp()
    }

    unselect() {
        state.activeBottle = null;
        this.resetPosition()
    }

    liftUp() {
        this.y = this.originalY - 75;
    }

    resetPosition() {
        this.x = this.originalX;
        this.y = this.originalY;
        this.angle = 0;
    }

    moveTo(target) {
        // Just for showing example, replace callback to "state" workaround
        function callback() {
            state.activeBottle = null;
        }

        if (this.liquids.length === 0 || target.liquids.length >= maxLiquids) {
            this.returnToOriginal(callback);
            return;
        }

        const transferLiquids = this.getTransferableLiquids(target);
        if (!transferLiquids.length) {
            this.returnToOriginal(callback);
            return;
        }

        const animationDuration = 500;
        const startTime = performance.now();
        const startX = this.x;
        const startY = this.y;

        const movingRight = this.x < target.x;
        const targetX = movingRight
            ? target.x - rectWidth - 20
            : target.x + rectWidth + 20;
        const targetY = this.originalY - 30;
        const targetAngle = movingRight ? 60 : -60;

        const animateMove = (time) => {
            let progress = (time - startTime) / animationDuration;
            if (progress > 1) progress = 1;

            this.x = startX + (targetX - startX) * progress;
            this.y = startY + (targetY - startY) * progress;

            if (progress < 1) {
                requestAnimationFrame(animateMove);
            } else {
                this.angle = targetAngle;
                setTimeout(
                    () => this.animatePour(target, transferLiquids, callback),
                    500
                );
            }
        };

        requestAnimationFrame(animateMove);
    }

    getTransferableLiquids(target) {
        if (this.liquids.length === 0 || target.liquids.length >= maxLiquids) {
            return [];
        }

        const topLiquid = this.liquids[this.liquids.length - 1];
        let count = 1;

        for (let i = this.liquids.length - 2; i >= 0; i--) {
            if (this.liquids[i] === topLiquid) {
                count++;
            } else {
                break;
            }
        }

        const availableSpace = maxLiquids - target.liquids.length;
        return this.liquids.slice(-Math.min(count, availableSpace));
    }

    animatePour(target, transferLiquids, callback) {
        const removeLiquids = () => {
            this.liquids.splice(-transferLiquids.length);
            setTimeout(() => target.liquids.push(...transferLiquids), 300);
            setTimeout(() => this.returnToOriginal(callback), 500);
        };

        setTimeout(removeLiquids, 300);
    }

    returnToOriginal(callback) {
        this.resetPosition();
        if (callback) callback();
    }
}
