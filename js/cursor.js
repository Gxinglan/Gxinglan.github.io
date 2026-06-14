
(function() {
  // 1. 发光猫爪跟随物 (贴合头像中的猫咪，可爱又炫酷)
  const cursor = document.createElement('div');
  cursor.id = 'premium-cursor-trail';
  cursor.style.position = 'fixed';
  cursor.style.top = '0';
  cursor.style.left = '0';
  cursor.style.width = '18px';
  cursor.style.height = '18px';
  // 注入一个炫酷发光的猫爪 SVG
  cursor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:100%; height:100%; filter: drop-shadow(0 0 6px rgba(135,206,250,1));"><path fill="#87CEFA" d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5-.3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-1.2-78.5-33.7-14.3-70.1 10.2-84.1 59.7 1.2 78.5 33.7zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-4.2-31.6-11.9l-55.9-49.8c-15.7-14-36-21.8-57.8-21.8s-42.1 7.8-57.8 21.8l-55.9 49.8c-8.7 7.7-20.1 11.9-31.6 11.9C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.7 78.5-33.7 29.1 51.7 10.2 84.1-54 47.7-78.5 33.7zM285.5 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s47.8-69.1 84.4-58.5 46.9 53.9 32.6 96.8-47.8 69.1-84.4 58.5z"/></svg>';
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '999999';
  document.body.appendChild(cursor);

  // 2. 粒子拖尾画布
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999998';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let particles = [];
  let currentScale = 1;
  let targetScale = 1;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // 鼠标移动时产生星尘粒子
    for(let i=0; i<2; i++){
      particles.push(new Particle(mouseX, mouseY));
    }
  });

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 2.5;
      this.speedY = (Math.random() - 0.5) * 2.5;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      const colors = ['#87CEFA', '#E0FFFF', '#FFFACD', '#DDA0DD', '#FFFFFF'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size -= 0.04;
    }
    draw() {
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size > 0 ? this.size : 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 平滑跟随
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    // 平滑缩放
    currentScale += (targetScale - currentScale) * 0.2;
    
    // 应用变换 (平移 + 缩放)
    cursor.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%)) scale(${currentScale})`;

    // 绘制并更新所有粒子
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      if (particles[i].life <= 0 || particles[i].size <= 0) {
        particles.splice(i, 1);
        i--;
      } else {
        particles[i].draw();
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  // 交互反馈
  document.addEventListener('mousedown', () => {
    targetScale = 0.6; // 点击时猫爪缩小
    for(let i=0; i<15; i++) particles.push(new Particle(mouseX, mouseY)); // 星尘爆裂
  });
  
  document.addEventListener('mouseup', () => {
    targetScale = 1; // 恢复
  });

  // 悬停反馈
  const bindHover = () => {
    const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer, #nav *');
    interactiveElements.forEach(el => {
      if(el.dataset.cursorBound) return;
      el.dataset.cursorBound = "true";
      el.addEventListener('mouseenter', () => {
        targetScale = 1.6; // 悬停在链接上时猫爪变大
      });
      el.addEventListener('mouseleave', () => {
        targetScale = 1;
      });
    });
  };
  
  bindHover();
  const observer = new MutationObserver(bindHover);
  observer.observe(document.body, { childList: true, subtree: true });

})();
