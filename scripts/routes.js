// ===== МАРШРУТИЗАТОР =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Router инициализирован');
    
    // Конфигурация маршрутов
    const routes = {
        '#home': {
            pageId: 'page-home',
            title: 'Keithston Bakery',
            render: null
        },
        '#blog': {
            pageId: 'page-blog',
            title: 'Blog - Keithston Bakery',
            render: 'renderBlogPosts'
        },
        '#contact': {
            pageId: 'page-contact',
            title: 'Contact Us - Keithston Bakery',
            render: 'initContactForm'
        },
        '#services': {
            pageId: 'page-services',
            title: 'Services - Keithston Bakery',
            render: 'renderServices'
        }
    };
    
    // Функция показа страницы
    function showPage(hash) {
        console.log('Переход на:', hash);
        
        // Скрыть все страницы
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });
        
        // Получить конфигурацию маршрута
        const route = routes[hash] || routes['#home'];
        
        // Показать нужную страницу
        const targetPage = document.getElementById(route.pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
            console.log('✅ Показана страница:', route.pageId);
        } else {
            console.error('❌ Страница не найдена:', route.pageId);
        }
        
        // Обновить активную ссылку в навигации
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });
        
        // Обновить заголовок страницы
        document.title = route.title;
        
        // Вызвать функцию рендеринга если она указана
        if (route.render && typeof window[route.render] === 'function') {
            setTimeout(() => {
                window[route.render]();
            }, 100);
        }
        
        // Скролл наверх
        window.scrollTo(0, 0);
    }
    
    // Обработка кликов по ссылкам в навигации
    document.addEventListener('click', function(e) {
        const link = e.target.closest('.nav-links a[href^="#"]');
        if (link) {
            const hash = link.getAttribute('href');
            if (routes[hash]) {
                e.preventDefault();
                console.log('Клик по ссылке:', hash);
                window.location.hash = hash;
            }
        }
    });
    
    // Обработка изменения хэша в URL
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash || '#home';
        showPage(hash);
    });
    
    // Первоначальная загрузка - показать страницу по умолчанию
    const initialHash = window.location.hash || '#home';
    showPage(initialHash);
    
    // Экспорт для глобального доступа
    window.routes = routes;
    window.showPage = showPage;
});