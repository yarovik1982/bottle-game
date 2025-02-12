const btn = document.getElementById('play')
btn.addEventListener('click', function() {
   this.style.display = 'none'
   canvas.style.display = 'block'
})

const container = document.querySelector(".container");
const rect = container.getBoundingClientRect();
const width = rect.width;
const height = rect.height;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const rectWidth = 50;
const rectHeight = 150;
const borderWidth = 2;
const spacing = 20;
const ovalHeight = 10;
const liquidHeight = rectHeight * 0.2;
const maxLiquids = 4;
const colors = ["red", "blue", "yellow", "green"];
let activeBottle = null;

class Bottle {
    constructor(x, y, hasLiquids = true) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.angle = 0;
        this.liquids = hasLiquids ? this.getRandomLiquids() : [];
    }

    getRandomLiquids() {
        return [...colors].sort(() => Math.random() - 0.5).slice(0, maxLiquids);
    }

    draw() {
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

    liftUp() {
        this.y = this.originalY - 75;
    }

    resetPosition() {
        this.x = this.originalX;
        this.y = this.originalY;
        this.angle = 0;
    }

    moveTo(target, callback) {
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
            setTimeout(addLiquids, 300);
        };

        const addLiquids = () => {
            target.liquids.push(...transferLiquids);
            setTimeout(() => this.returnToOriginal(callback), 500);
        };

        setTimeout(removeLiquids, 300);
    }

    returnToOriginal(callback) {
        const animationDuration = 500;
        const startTime = performance.now();
        const startX = this.x;
        const startY = this.y;
        const startAngle = this.angle;

        const animateReturn = (time) => {
            let progress = (time - startTime) / animationDuration;
            if (progress > 1) progress = 1;

            this.x = startX + (this.originalX - startX) * progress;
            this.y = startY + (this.originalY - startY) * progress;
            this.angle = startAngle + (0 - startAngle) * progress;

            if (progress < 1) {
                requestAnimationFrame(animateReturn);
            } else {
                this.resetPosition();
                if (callback) callback();
            }
        };

        requestAnimationFrame(animateReturn);
    }
}

// Создаем бутылки
const bottles = [];
const totalWidth = (rectWidth + spacing) * 5 - spacing;
const startX = (canvas.width - totalWidth) / 2;
const startY = (canvas.height - rectHeight) / 2;

for (let i = 0; i < 5; i++) {
    bottles.push(new Bottle(startX + i * (rectWidth + spacing), startY, i < 4));
}

// Отрисовка сцены
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bottles.forEach((bottle) => bottle.draw());
    requestAnimationFrame(drawScene);
}
drawScene();

// Обработчик клика
canvas.addEventListener("click", (e) => {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    const clickedBottle = bottles.find(
        (bottle) =>
            mouseX > bottle.x &&
            mouseX < bottle.x + rectWidth &&
            mouseY > bottle.y &&
            mouseY < bottle.y + rectHeight
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
