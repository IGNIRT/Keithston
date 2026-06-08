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

function showPage(hash) {
    console.log('Переход на:', hash);
    
    document.querySelectorAll('.page').forEach(function(page) {
        page.style.display = 'none';
    });
    
    var route = routesConfig[hash] || routesConfig['#home'];
    
    var targetPage = document.getElementById(route.pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
        console.log('Показана страница:', route.pageId);
    } else {
        console.error('Страница не найдена:', route.pageId);
    }
    
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });
    
    document.title = route.title;
    
    if (hash === '#blog' && typeof window.renderBlogPosts === 'function') {
        setTimeout(function() { window.renderBlogPosts(); }, 100);
    }
    if (hash === '#services' && typeof window.renderServices === 'function') {
        setTimeout(function() { window.renderServices(); }, 100);
    }
    if (hash === '#contact' && typeof window.initContactForm === 'function') {
        setTimeout(function() { window.initContactForm(); }, 100);
    }
    
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Router инициализирован');
    
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
    
    window.addEventListener('hashchange', function() {
        var hash = window.location.hash || '#home';
        showPage(hash);
    });
    
    var initialHash = window.location.hash || '#home';
    showPage(initialHash);
});

window.routesConfig = routesConfig;
window.showPage = showPage;