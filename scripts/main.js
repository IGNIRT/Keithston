// ===== ДАННЫЕ ДЛЯ КАРТОЧЕК =====

const cards = {
  // Товары для section__2 (Top Products)
  product_1: {
    id: 'product-1',
    type: 'product',
    image: 'images/danish-pastry-with-jam.png',
    name: 'Whole Grain Bread',
    price: 40,
    description: 'Fresh whole grain bread baked daily with premium ingredients'
  },
  product_2: {
    id: 'product-2',
    type: 'product',
    image: 'images/malina.png',
    name: 'Raspberry Crown',
    price: 40,
    description: 'Delicious pastry topped with fresh raspberries'
  },
  product_3: {
    id: 'product-3',
    type: 'product',
    image: 'images/baton_semechki.png',
    name: 'Seeded Baguette',
    price: 40,
    description: 'Crunchy French baguette with mixed seeds'
  },
  product_4: {
    id: 'product-4',
    type: 'product',
    image: 'images/krug_hleb.png',
    name: 'Sourdough Round',
    price: 40,
    description: 'Traditional sourdough bread with tangy flavor'
  },
  product_5: {
    id: 'product-5',
    type: 'product',
    image: 'images/pizza_hleb.png',
    name: 'Focaccia Herb',
    price: 40,
    description: 'Italian focaccia with aromatic herbs and olive oil'
  },
  product_6: {
    id: 'product-6',
    type: 'product',
    image: 'images/white_bread.png',
    name: 'Classic White Bread',
    price: 40,
    description: 'Soft and fluffy white bread perfect for sandwiches'
  },

  // Featured Treats для section__6
  treat_1: {
    id: 'treat-1',
    type: 'treat',
    image: 'images/pasta.png',
    name: 'Puff Pastry',
    price: 8
  },
  treat_2: {
    id: 'treat-2',
    type: 'treat',
    image: 'images/Doughnuts.png',
    name: 'Doughnuts',
    price: 8
  },
  treat_3: {
    id: 'treat-3',
    type: 'treat',
    image: 'images/Brownies.png',
    name: 'Brownies',
    price: 8
  },

  // Посты для страницы Blog
  blog_1: {
    id: 'blog-1',
    type: 'blog',
    title: 'The Art of Bread Baking',
    date: 'June 15, 2024',
    image: 'images/gallery_1.png',
    excerpt: 'Discover the secrets of traditional bread baking passed down through generations...'
  },
  blog_2: {
    id: 'blog-2',
    type: 'blog',
    title: 'Best Croissant Recipes',
    date: 'June 10, 2024',
    image: 'images/gallery_2.png',
    excerpt: 'Step-by-step guide to making perfect French croissants at home...'
  },
  blog_3: {
    id: 'blog-3',
    type: 'blog',
    title: 'Summer Seasonal Desserts',
    date: 'June 5, 2024',
    image: 'images/gallery_3.png',
    excerpt: 'Fresh berry cakes and light desserts for hot summer days...'
  },
  blog_4: {
    id: 'blog-4',
    type: 'blog',
    title: 'Our Bakery Story',
    date: 'June 1, 2024',
    image: 'images/gallery_4.png',
    excerpt: 'How a small family bakery became the city\'s favorite spot...'
  },
  blog_5: {
    id: 'blog-5',
    type: 'blog',
    title: 'Secrets of Perfect Dough',
    date: 'May 25, 2024',
    image: 'images/gallery_5.png',
    excerpt: 'Professional tips for kneading and proofing dough like a pro...'
  },
  blog_6: {
    id: 'blog-6',
    type: 'blog',
    title: 'New This Month',
    date: 'May 20, 2024',
    image: 'images/gallery_6.png',
    excerpt: 'Introducing new flavors and seasonal offerings...'
  },

  // Услуги для страницы Services
  service_1: {
    id: 'service-1',
    type: 'service',
    icon: '🎂',
    title: 'Custom Cakes',
    description: 'Personalized cakes for weddings, birthdays, and corporate events',
    price: 'from $50'
  },
  service_2: {
    id: 'service-2',
    type: 'service',
    icon: '🥐',
    title: 'Fresh Pastries',
    description: 'Daily delivery of fresh croissants, buns, and bread',
    price: 'from $3'
  },
  service_3: {
    id: 'service-3',
    type: 'service',
    icon: '🎉',
    title: 'Catering',
    description: 'Full event service with desserts and baked goods',
    price: 'from $200'
  },
  service_4: {
    id: 'service-4',
    type: 'service',
    icon: '📚',
    title: 'Workshops',
    description: 'Learn the art of baking from our professional bakers',
    price: 'from $40'
  },
  service_5: {
    id: 'service-5',
    type: 'service',
    icon: '🚚',
    title: 'Delivery',
    description: 'Fast delivery of fresh baked goods across the city',
    price: 'from $5'
  },
  service_6: {
    id: 'service-6',
    type: 'service',
    icon: '☕',
    title: 'Cafe',
    description: 'Cozy cafe with coffee and fresh pastries for visitors',
    price: 'from $8'
  }
};

// ===== ФУНКЦИИ ДЛЯ ПОЛУЧЕНИЯ КАРТОЧЕК (ИНТЕРФЕЙС) =====

/**
 * Получение карточки по ID
 * @param {string} cardId - ID карточки
 * @returns {object|null} - Объект карточки или null если не найдена
 */
function getCardById(cardId) {
  return cards[cardId] || null;
}

/**
 * Получение всех карточек определенного типа
 * @param {string} type - Тип карточки (product, treat, blog, service)
 * @returns {array} - Массив карточек указанного типа
 */
function getCardsByType(type) {
  return Object.values(cards).filter(card => card.type === type);
}

/**
 * Получение карточек по условию фильтрации
 * @param {function} filterFn - Функция фильтрации
 * @returns {array} - Массив отфильтрованных карточек
 */
function getCardsByFilter(filterFn) {
  return Object.values(cards).filter(filterFn);
}

// ===== ФУНКЦИИ ДЛЯ СОЗДАНИЯ HTML ШАБЛОНОВ =====

/**
 * Создание HTML шаблона для карточки товара
 * @param {object} card - Данные карточки
 * @returns {string} - HTML строка с заполненными данными
 */
function createProductCardTemplate(card) {
  return `
    <div class="product" data-card-id="${card.id}">
      <img src="${card.image}" alt="${card.name}" class="product-image">
      <div class="product__info-row">
        <p class="product-price">$${card.price}</p>
        <div class="like-counter" data-item-id="${card.id}">
          <span class="like-heart">♡</span>
          <span class="like-count">0</span>
        </div>
      </div>
      <div class="product__info-bottom">
        <p class="product-name">${card.name}</p>
        <button class="add" data-card-id="${card.id}">Add</button>
      </div>
    </div>
  `;
}

/**
 * Создание HTML шаблона для карточки Featured Treat
 * @param {object} card - Данные карточки
 * @returns {string} - HTML строка с заполненными данными
 */
function createTreatCardTemplate(card) {
  return `
    <div class="treat-card" data-card-id="${card.id}">
      <img src="${card.image}" alt="${card.name}" class="image">
      <p class="name">${card.name}</p>
      <p class="price">$${card.price}</p>
    </div>
  `;
}

/**
 * Создание HTML шаблона для карточки блога
 * @param {object} card - Данные карточки
 * @returns {string} - HTML строка с заполненными данными
 */
function createBlogCardTemplate(card) {
  return `
    <article class="blog-card" data-card-id="${card.id}">
      <img src="${card.image}" alt="${card.title}" class="blog-image">
      <div class="blog-content">
        <span class="blog-date">${card.date}</span>
        <h3 class="blog-title">${card.title}</h3>
        <p class="blog-excerpt">${card.excerpt}</p>
        <a href="#" class="blog-read-more" data-card-id="${card.id}">Read More →</a>
      </div>
    </article>
  `;
}

/**
 * Создание HTML шаблона для карточки услуги
 * @param {object} card - Данные карточки
 * @returns {string} - HTML строка с заполненными данными
 */
function createServiceCardTemplate(card) {
  return `
    <div class="service-card" data-card-id="${card.id}">
      <div class="service-icon">${card.icon}</div>
      <h3 class="service-title">${card.title}</h3>
      <p class="service-description">${card.description}</p>
      <div class="service-price">${card.price}</div>
      <button class="service-btn" data-card-id="${card.id}">Order Now</button>
    </div>
  `;
}

// ===== ФУНКЦИИ ДЛЯ ВСТАВКИ КАРТОЧЕК В DOM =====

/**
 * Рендеринг карточек товаров в section__2
 * Использует DOM для поиска контейнера и вставки карточек
 */
function renderProducts() {
  // Поиск контейнера в DOM
  const container = document.querySelector('.products');
  if (!container) {
    console.error('Контейнер .products не найден');
    return;
  }

  // Получение карточек типа product
  const products = getCardsByType('product');
  
  // Создание HTML с использованием шаблонных строк
  const html = products.map(card => createProductCardTemplate(card)).join('');
  
  // Вставка в DOM
  container.innerHTML = html;
  
  // Инициализация обработчиков событий для новых элементов
  initProductEvents();
  
  console.log(`✅ Отрисовано товаров: ${products.length}`);
}

/**
 * Рендеринг карточек Featured Treats в section__6
 */
function renderTreats() {
  const container = document.querySelector('.featured-treats');
  if (!container) {
    console.error('Контейнер .featured-treats не найден');
    return;
  }

  const treats = getCardsByType('treat');
  const html = treats.map(card => createTreatCardTemplate(card)).join('');
  
  container.innerHTML = html;
  
  console.log(`✅ Отрисовано featured treats: ${treats.length}`);
}

/**
 * Рендеринг карточек блога
 * @param {string} containerId - ID контейнера для вставки
 */
function renderBlogPosts(containerId = 'blog-posts') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Контейнер #${containerId} не найден`);
    return;
  }

  const posts = getCardsByType('blog');
  const html = posts.map(card => createBlogCardTemplate(card)).join('');
  
  container.innerHTML = html;
  
  // Инициализация обработчиков для постов блога
  initBlogEvents();
  
  console.log(`✅ Отрисовано постов блога: ${posts.length}`);
}

/**
 * Рендеринг карточек услуг
 * @param {string} containerId - ID контейнера для вставки
 */
function renderServices(containerId = 'services-list') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Контейнер #${containerId} не найден`);
    return;
  }

  const services = getCardsByType('service');
  const html = services.map(card => createServiceCardTemplate(card)).join('');
  
  container.innerHTML = html;
  
  // Инициализация обработчиков для услуг
  initServiceEvents();
  
  console.log(`✅ Отрисовано услуг: ${services.length}`);
}

// ===== ФУНКЦИИ ОБРАБОТКИ СОБЫТИЙ (EVENTS) =====

/**
 * Инициализация обработчиков событий для товаров
 * Использует делегирование событий для эффективности
 */
function initProductEvents() {
  const productsContainer = document.querySelector('.products');
  if (!productsContainer) return;

  // Делегирование событий - один обработчик на весь контейнер
  productsContainer.addEventListener('click', function(event) {
    const target = event.target;
    
    // Обработка клика по кнопке Add
    if (target.classList.contains('add')) {
      const cardId = target.getAttribute('data-card-id');
      const card = getCardById(cardId);
      
      if (card) {
        handleAddToCart(card);
        
        // Анимация кнопки
        target.textContent = 'Added!';
        target.style.background = '#4CAF50';
        
        setTimeout(() => {
          target.textContent = 'Add';
          target.style.background = '';
        }, 1500);
      }
    }
    
    // Обработка клика по счётчику лайков
    if (target.closest('.like-counter')) {
      const likeCounter = target.closest('.like-counter');
      handleLikeClick(likeCounter);
    }
  });
}

/**
 * Инициализация обработчиков событий для постов блога
 */
function initBlogEvents() {
  const blogContainer = document.getElementById('blog-posts');
  if (!blogContainer) return;

  blogContainer.addEventListener('click', function(event) {
    const target = event.target;
    
    if (target.classList.contains('blog-read-more')) {
      event.preventDefault();
      const cardId = target.getAttribute('data-card-id');
      const card = getCardById(cardId);
      
      if (card) {
        handleBlogPostClick(card);
      }
    }
  });
}

/**
 * Инициализация обработчиков событий для услуг
 */
function initServiceEvents() {
  const servicesContainer = document.getElementById('services-list');
  if (!servicesContainer) return;

  servicesContainer.addEventListener('click', function(event) {
    const target = event.target;
    
    if (target.classList.contains('service-btn')) {
      const cardId = target.getAttribute('data-card-id');
      const card = getCardById(cardId);
      
      if (card) {
        handleServiceOrder(card);
      }
    }
  });
}

// ===== ФУНКЦИИ ОБРАБОТКИ ДЕЙСТВИЙ =====

/**
 * Обработка добавления товара в корзину
 * @param {object} card - Данные карточки товара
 */
function handleAddToCart(card) {
  // Получаем корзину из localStorage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Проверяем, есть ли уже этот товар в корзине
  const existingItem = cart.find(item => item.id === card.id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: card.id,
      name: card.name,
      price: card.price,
      quantity: 1
    });
  }
  
  // Сохраняем корзину в localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Показываем уведомление
  showNotification(`${card.name} added to cart!`, 'success');
  
  console.log('Корзина обновлена:', cart);
}

/**
 * Обработка клика по счётчику лайков
 * @param {HTMLElement} likeCounter - Элемент счётчика лайков
 */
function handleLikeClick(likeCounter) {
  const itemId = likeCounter.getAttribute('data-item-id');
  const storageKey = `like_${itemId}`;
  
  // Получаем текущее состояние
  const saved = localStorage.getItem(storageKey);
  let state = saved ? JSON.parse(saved) : { count: 0, isLiked: false };
  
  // Переключаем состояние
  state.isLiked = !state.isLiked;
  state.count += state.isLiked ? 1 : -1;
  
  // Обновляем DOM
  const heartEl = likeCounter.querySelector('.like-heart');
  const countEl = likeCounter.querySelector('.like-count');
  
  heartEl.innerHTML = state.isLiked ? '♥' : '♡';
  countEl.textContent = state.count;
  
  // Добавляем/убираем класс
  if (state.isLiked) {
    likeCounter.classList.add('liked');
    animateLike(likeCounter);
  } else {
    likeCounter.classList.remove('liked');
  }
  
  // Сохраняем в localStorage
  localStorage.setItem(storageKey, JSON.stringify(state));
}

/**
 * Анимация лайка
 * @param {HTMLElement} element - Элемент для анимации
 */
function animateLike(element) {
  element.style.transition = 'transform 0.2s ease';
  element.style.transform = 'scale(1.2)';
  
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 200);
}

/**
 * Обработка клика по посту блога
 * @param {object} card - Данные поста блога
 */
function handleBlogPostClick(card) {
  showNotification(`Opening: ${card.title}`, 'info');
  console.log('Открыт пост блога:', card);
}

/**
 * Обработка заказа услуги
 * @param {object} card - Данные услуги
 */
function handleServiceOrder(card) {
  // Проверяем, авторизован ли пользователь
  const currentUser = localStorage.getItem('currentUser');
  
  if (!currentUser) {
    // Открываем модальное окно входа
    if (typeof openAuthModal === 'function') {
      openAuthModal();
    }
    showNotification(`Please login to order: ${card.title}`, 'info');
  } else {
    showNotification(`Order placed: ${card.title}`, 'success');
    console.log('Заказана услуга:', card);
  }
}

/**
 * Показ уведомления
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления (success, error, info)
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3';
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${bgColor};
    color: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  // Удаляем через 3 секунды
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Scripts.js инициализирован');
  
  // Рендерим карточки на главной странице
  renderProducts();
  renderTreats();
  
  // Добавляем стили для анимаций уведомлений
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});

// ===== ЭКСПОРТ ФУНКЦИЙ В ГЛОБАЛЬНУЮ ОБЛАСТЬ (BOM) =====

window.cards = cards;
window.getCardById = getCardById;
window.getCardsByType = getCardsByType;
window.getCardsByFilter = getCardsByFilter;
window.renderProducts = renderProducts;
window.renderTreats = renderTreats;
window.renderBlogPosts = renderBlogPosts;
window.renderServices = renderServices;
window.createProductCardTemplate = createProductCardTemplate;
window.createTreatCardTemplate = createTreatCardTemplate;
window.createBlogCardTemplate = createBlogCardTemplate;
window.createServiceCardTemplate = createServiceCardTemplate;
window.handleAddToCart = handleAddToCart;
window.handleLikeClick = handleLikeClick;
window.handleBlogPostClick = handleBlogPostClick;
window.handleServiceOrder = handleServiceOrder;
window.showNotification = showNotification;