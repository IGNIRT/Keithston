class LikeCounter {
  constructor(element) {
    this.element = element;
    this.count = 0;
    this.isLiked = false;
    this.storageKey = null;
    this.init();
  }

  init() {
    const itemId = this.element.dataset.itemId || 'default';
    this.storageKey = `like_${itemId}`;
    
    this.loadState();
    
    this.updateDisplay();
    
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleLike();
    });
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        this.count = data.count || 0;
        this.isLiked = data.isLiked || false;
      }
    } catch (e) {
      console.warn('Не удалось загрузить состояние лайка:', e);
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        count: this.count,
        isLiked: this.isLiked
      }));
    } catch (e) {
      console.warn('Не удалось сохранить состояние лайка:', e);
    }
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    
    if (this.isLiked) {
      this.count++;
      this.element.classList.add('liked');
      this.animateLike();
      this.createParticles();
    } else {
      this.count--;
      this.element.classList.remove('liked');
    }
    
    this.updateDisplay();
    this.saveState();
  }

  animateLike() {
    this.element.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    this.element.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
      this.element.style.transform = 'scale(1)';
    }, 200);
  }

  createParticles() {
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
      this.createParticle(centerX, centerY, i);
    }
  }

  createParticle(x, y, index) {
    const particle = document.createElement('div');
    particle.className = 'like-particle';
    particle.innerHTML = '♥';
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      color: #ff4757;
      font-size: 16px;
      pointer-events: none;
      z-index: 9999;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      opacity: 1;
    `;
    
    document.body.appendChild(particle);
    
    const angle = (index / 6) * Math.PI * 2;
    const distance = 40 + Math.random() * 30;
    const targetX = x + Math.cos(angle) * distance;
    const targetY = y + Math.sin(angle) * distance - 30;
    
    requestAnimationFrame(() => {
      particle.style.left = `${targetX}px`;
      particle.style.top = `${targetY}px`;
      particle.style.opacity = '0';
      particle.style.transform = 'scale(0.5) rotate(360deg)';
    });
    
    setTimeout(() => particle.remove(), 800);
  }

  updateDisplay() {
    const countEl = this.element.querySelector('.like-count');
    if (countEl) {
      countEl.textContent = this.count;
    }
    const heartEl = this.element.querySelector('.like-heart');
    if (heartEl) {
      heartEl.innerHTML = this.isLiked ? '♥' : '♡';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const likeCounters = document.querySelectorAll('.like-counter');
  
  likeCounters.forEach(counter => {
    new LikeCounter(counter);
  });
  
  console.log(`Инициализировано счётчиков лайков: ${likeCounters.length}`);
});

function addLike(itemId) {
  const element = document.querySelector(`[data-item-id="${itemId}"]`);
  if (element) {
    const counter = new LikeCounter(element);
    if (!counter.isLiked) {
      counter.toggleLike();
    }
  }
}

function getTotalLikes() {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('like_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        total += data.count || 0;
      } catch (e) {}
    }
  }
  return total;
}

window.LikeCounter = LikeCounter;
window.addLike = addLike;
window.getTotalLikes = getTotalLikes;