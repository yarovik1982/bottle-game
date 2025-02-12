export  class Bottle {
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
      ctx.rotate(this.angle * Math.PI / 180);
      ctx.translate(-rectWidth / 2, -rectHeight / 2);

      // Овал сверху
      ctx.beginPath();
      ctx.ellipse(rectWidth / 2, borderWidth, rectWidth / 2, ovalHeight / 2, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = borderWidth;
      ctx.stroke();

      // Прямоугольник бутылки
      ctx.beginPath();
      ctx.moveTo(0, borderWidth + (ovalHeight / 2) - 5);
      ctx.lineTo(0, rectHeight);
      ctx.lineTo(rectWidth, rectHeight);
      ctx.lineTo(rectWidth, borderWidth + (ovalHeight / 2) - 5);
      ctx.stroke();

      // Жидкости внутри
      this.liquids.forEach((color, index) => {
         ctx.fillStyle = color;
         ctx.fillRect(0, rectHeight - (index + 1) * liquidHeight, rectWidth, liquidHeight);
      });

      ctx.restore();
   }
}