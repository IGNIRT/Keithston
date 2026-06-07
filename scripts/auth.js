let usersDB = {
    "admin": {
        history: [{ password: "Adm!n2026", date: "01.01.2026" }]
    }
};

let currentUser = null;
let failedAttempts = 0;
let isLocked = false;
let isOnCooldown = false;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initAuthSystem();
});

function initAuthSystem() {
    // Кнопка открытия модального окна входа
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.addEventListener('click', openAuthModal);
    }

    // Закрытие модального окна
    const closeBtn = document.querySelector('.auth-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAuthModal);
    }

    // Закрытие по клику вне модального окна
    const overlay = document.getElementById('authModalOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeAuthModal();
        });
    }

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAuthModal();
            closeJournal();
        }
    });
}

function openAuthModal() {
    const overlay = document.getElementById('authModalOverlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateAuthStatus();
    }
}

function closeAuthModal() {
    const overlay = document.getElementById('authModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
        document.getElementById('loginForm').classList.remove('auth-hidden');
        document.getElementById('registerForm').classList.add('auth-hidden');
    } else {
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
        document.getElementById('loginForm').classList.add('auth-hidden');
        document.getElementById('registerForm').classList.remove('auth-hidden');
    }
    
    const msgBox = document.getElementById('authMessageBox');
    if (msgBox) msgBox.style.display = 'none';
}

function updateAuthStatus() {
    const status = document.getElementById('authUserStatus');
    if (status) {
        if (currentUser) {
            status.textContent = `👤 Вы вошли как: ${currentUser}`;
            status.style.display = 'block';
        } else {
            status.style.display = 'none';
        }
    }
}

function showAuthMessage(text, type) {
    const box = document.getElementById('authMessageBox');
    if (box) {
        box.textContent = text;
        box.className = `auth-message ${type}`;
        box.style.display = 'block';
    }
}

function levenshteinDistance(a, b) {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const indicator = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + indicator
            );
        }
    }
    return matrix[b.length][a.length];
}

function validatePassword(login, password, isRegistration) {
    let errorFound = false;
    let errorMsg = "";

    // 1. Минимальная длина >= 8
    if (password.length < 8) {
        errorFound = true;
        errorMsg = "Пароль должен содержать не менее 8 символов.";
    }
    // 3. Проверка по словарю
    else if (["password", "123456", "admin", "qwerty", "student", "letmein"].includes(password.toLowerCase())) {
        errorFound = true;
        errorMsg = "Пароль найден в словаре запрещённых.";
    }
    // 6 & 7. Журнал истории и эвристика
    else if (isRegistration && usersDB[login]) {
        if (usersDB[login].history.some(h => h.password === password)) {
            errorFound = true;
            errorMsg = "Этот пароль уже использовался (журнал истории).";
        } else {
            for (let hist of usersDB[login].history) {
                let old = hist.password.toLowerCase();
                let newP = password.toLowerCase();
                if (newP.includes(old) || old.includes(newP) || levenshteinDistance(newP, old) <= 2) {
                    errorFound = true;
                    errorMsg = `Пароль слишком похож на предыдущий: "${hist.password}"`;
                    break;
                }
            }
        }
    }
    
    return { errorFound, errorMsg };
}

function handleRegister() {
    const login = document.getElementById('regLogin').value.trim();
    const pass = document.getElementById('regPass').value;
    const passConfirm = document.getElementById('regPassConfirm').value;

    const msgBox = document.getElementById('authMessageBox');
    if (msgBox) msgBox.style.display = 'none';

    if (!login || !pass || !passConfirm) {
        showAuthMessage("Заполните все поля!", 'error');
        return;
    }
    if (pass !== passConfirm) {
        showAuthMessage("Пароли не совпадают!", 'error');
        return;
    }
    if (login.toLowerCase() === "admin") {
        showAuthMessage("Регистрация под логином 'admin' запрещена!", 'error');
        return;
    }

    const validation = validatePassword(login, pass, true);
    if (validation.errorFound) {
        showAuthMessage(validation.errorMsg, 'error');
        return;
    }

    if (!usersDB[login]) usersDB[login] = { history: [] };

    const today = new Date().toLocaleDateString('ru-RU');
    usersDB[login].history.push({ password: pass, date: today });
    
    showAuthMessage(`Пользователь ${login} успешно зарегистрирован!`, 'success');
    
    document.getElementById('regLogin').value = '';
    document.getElementById('regPass').value = '';
    document.getElementById('regPassConfirm').value = '';
    
    setTimeout(() => {
        currentUser = login;
        updateAuthStatus();
        switchAuthTab('login');
    }, 1500);
}

function handleLogin() {
    const login = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const btn = document.getElementById('loginBtn');

    const msgBox = document.getElementById('authMessageBox');
    if (msgBox) msgBox.style.display = 'none';

    if (isLocked) {
        showAuthMessage("Доступ заблокирован после 3 неудачных попыток.", 'error');
        return;
    }
    if (isOnCooldown) {
        showAuthMessage("Подождите окончания задержки...", 'error');
        return;
    }
    if (!usersDB[login] || !usersDB[login].history.length) {
        failedAttempts++;
        checkAttempts();
        showAuthMessage("Неверный логин или пароль.", 'error');
        return;
    }

    const currentPass = usersDB[login].history[usersDB[login].history.length - 1].password;
    
    if (pass !== currentPass) {
        failedAttempts++;
        checkAttempts();
        showAuthMessage(`Неверный пароль. Осталось попыток: ${3 - failedAttempts}`, 'error');
        return;
    }

    failedAttempts = 0;
    currentUser = login;
    updateAuthStatus();
    showAuthMessage(`Добро пожаловать, ${login}!`, 'success');
    document.getElementById('loginPass').value = '';
    
    setTimeout(() => {
        closeAuthModal();
    }, 1500);
}

function checkAttempts() {
    const btn = document.getElementById('loginBtn');
    if (failedAttempts >= 3) {
        isLocked = true;
        btn.disabled = true;
        btn.textContent = "Доступ заблокирован";
    } else if (failedAttempts >= 1) {
        isOnCooldown = true;
        btn.disabled = true;
        let sec = 3;
        btn.textContent = `Повторите через ${sec} сек...`;
        const timer = setInterval(() => {
            sec--;
            if (sec > 0) {
                btn.textContent = `Повторите через ${sec} сек...`;
            } else {
                clearInterval(timer);
                btn.disabled = false;
                btn.textContent = "Войти";
                isOnCooldown = false;
            }
        }, 1000);
    }
}

function openJournal() {
    if (!currentUser) {
        showAuthMessage("Сначала войдите в систему для просмотра журнала!", 'error');
        return;
    }

    const tbody = document.getElementById('journalBody');
    tbody.innerHTML = '';

    const usersToShow = currentUser === "admin" ? Object.keys(usersDB) : [currentUser];

    for (let login of usersToShow) {
        if (currentUser !== "admin" && login === "admin") continue;

        usersDB[login].history.forEach((item, index) => {
            const tr = document.createElement('tr');
            if (index === usersDB[login].history.length - 1) tr.classList.add('new-entry');
            if (login === "admin") tr.classList.add('admin-row');
            
            tr.innerHTML = `<td>${login}</td><td>${item.password}</td><td>${item.date}</td>`;
            tbody.appendChild(tr);
        });
    }
    
    const journalModal = document.getElementById('journalModalOverlay');
    if (journalModal) {
        journalModal.classList.add('active');
    }
}

function closeJournal() {
    const journalModal = document.getElementById('journalModalOverlay');
    if (journalModal) {
        journalModal.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const journalOverlay = document.getElementById('journalModalOverlay');
    if (journalOverlay) {
        journalOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeJournal();
        });
    }
});