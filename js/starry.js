
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'starry-canvas';
  document.body.prepend(canvas);
  
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  let stars = [];
  
  window.addEventListener('resize', function() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  class Star {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.r = Math.random() * 1.5;
      this.dx = (Math.random() - 0.5) * 0.5;
      this.dy = (Math.random() - 0.5) * 0.5;
      this.alpha = Math.random();
      this.alphaChange = (Math.random() * 0.02) - 0.01;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x < 0 || this.x > w) this.dx = -this.dx;
      if (this.y < 0 || this.y > h) this.dy = -this.dy;
      this.alpha += this.alphaChange;
      if (this.alpha <= 0.1 || this.alpha >= 1) this.alphaChange = -this.alphaChange;
      this.draw();
    }
  }

  for (let i = 0; i < 150; i++) {
    stars.push(new Star());
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(star => star.update());
    requestAnimationFrame(animate);
  }
  
  animate();
})();
