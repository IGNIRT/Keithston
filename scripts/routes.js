// ===== МАРШРУТИЗАТОР =====

// Конфигурация маршрутов
const routesConfig = {
    '#home': {
        pageId: 'page-home',
        title: 'Keithston Bakery'
    },
    '#blog': {
        pageId: 'page-blog',
        title: 'Blog - Keithston Bakery'
    },
    '#contact': {
        pageId: 'page-contact',
        title: 'Contact Us - Keithston Bakery'
    },
    '#services': {
        pageId: 'page-services',
        title: 'Services - Keithston Bakery'
    }
};

// Функция показа страницы
function showPage(hash) {
    console.log('Переход на:', hash);
    
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(function(page) {
        page.style.display = 'none';
    });
    
    // Получить конфигурацию маршрута
    var route = routesConfig[hash] || routesConfig['#home'];
    
    // Показать нужную страницу
    var targetPage = document.getElementById(route.pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
        console.log('✅ Показана страница:', route.pageId);
    } else {
        console.error('❌ Страница не найдена:', route.pageId);
    }
    
    // Обновить активную ссылку в навигации
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });
    
    // Обновить заголовок страницы
    document.title = route.title;
    
    // Вызвать функцию рендеринга если она указана
    if (hash === '#blog' && typeof window.renderBlogPosts === 'function') {
        setTimeout(function() { window.renderBlogPosts(); }, 100);
    }
    if (hash === '#services' && typeof window.renderServices === 'function') {
        setTimeout(function() { window.renderServices(); }, 100);
    }
    if (hash === '#contact' && typeof window.initContactForm === 'function') {
        setTimeout(function() { window.initContactForm(); }, 100);
    }
    
    // Скролл наверх
    window.scrollTo(0, 0);
}

// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Router инициализирован');
    
    // Обработка кликов по ссылкам в навигации
    document.addEventListener('click', function(e) {
        var link = e.target.closest('.nav-links a[href^="#"]');
        if (link) {
            var hash = link.getAttribute('href');
            if (routesConfig[hash]) {
                e.preventDefault();
                console.log('Клик по ссылке:', hash);
                window.location.hash = hash;
            }
        }
    });
    
    // Обработка изменения хэша в URL
    window.addEventListener('hashchange', function() {
        var hash = window.location.hash || '#home';
        showPage(hash);
    });
    
    // Первоначальная загрузка
    var initialHash = window.location.hash || '#home';
    showPage(initialHash);
});

// Экспорт
window.routesConfig = routesConfig;
window.showPage = showPage;