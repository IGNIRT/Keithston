// ===== СИСТЕМА АУТЕНТИФИКАЦИИ С ВАЛИДАЦИЕЙ И LOCALSTORAGE =====

// База данных пользователей
let usersDB = {
    "admin": {
        name: "Administrator",
        history: [{ password: "Adm!n_Secure_2026", date: "01.01.2026" }]
    }
};

let currentUser = null;
let failedAttempts = 0;
let isLocked = false;
let isOnCooldown = false;

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initAuthSystem();
    loadUserData(); // Загружаем данные при старте
});

function initAuthSystem() {
    // Кнопка открытия модального окна
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.addEventListener('click', openAuthModal);
    }

    // Закрытие модального окна
    const closeBtns = document.querySelectorAll('.auth-modal-close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAuthModal);
    });

    // Закрытие по клику вне окна
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

    // Валидация в реальном времени
    setupRealTimeValidation();
}

// ===== УПРАВЛЕНИЕ POPUP ОКНАМИ =====

function openAuthModal() {
    const overlay = document.getElementById('authModalOverlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateAuthStatus();
        clearAllForms(); // Очищаем формы при открытии
    }
}

function closeAuthModal() {
    const overlay = document.getElementById('authModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        clearAllForms();
        hideAllMessages();
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
    
    hideAllMessages();
    clearAllForms();
}

// ===== ОЧИСТКА ФОРМ =====

function clearAllForms() {
    const inputs = document.querySelectorAll('.auth-form-group input');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('error', 'success');
    });
    
    // Очищаем индикаторы ошибок
    const errorIndicators = document.querySelectorAll('.field-error');
    errorIndicators.forEach(ind => ind.remove());
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('error', 'success');
        });
    }
}

// ===== ВАЛИДАЦИЯ В РЕАЛЬНОМ ВРЕМЕНИ =====

function setupRealTimeValidation() {
    // Валидация логина при регистрации
    const regLogin = document.getElementById('regLogin');
    if (regLogin) {
        regLogin.addEventListener('input', function() {
            validateLoginField(this);
        });
    }

    // Валидация пароля при регистрации
    const regPass = document.getElementById('regPass');
    if (regPass) {
        regPass.addEventListener('input', function() {
            validatePasswordField(this);
        });
    }

    // Валидация подтверждения пароля
    const regPassConfirm = document.getElementById('regPassConfirm');
    if (regPassConfirm) {
        regPassConfirm.addEventListener('input', function() {
            validateConfirmPasswordField(this);
        });
    }

    // Валидация логина при входе
    const loginUser = document.getElementById('loginUser');
    if (loginUser) {
        loginUser.addEventListener('input', function() {
            validateLoginInput(this);
        });
    }
}

function validateLoginField(input) {
    const value = input.value.trim();
    removeFieldError(input);
    
    if (value.length === 0) {
        return true;
    }
    
    if (value.length < 3) {
        showFieldError(input, 'Логин должен содержать минимум 3 символа');
        return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        showFieldError(input, 'Логин может содержать только буквы, цифры и _');
        return false;
    }
    
    if (value.toLowerCase() === 'admin') {
        showFieldError(input, 'Этот логин занят');
        return false;
    }
    
    if (usersDB[value]) {
        showFieldError(input, 'Пользователь с таким логином уже существует');
        return false;
    }
    
    input.classList.add('success');
    return true;
}

function validatePasswordField(input) {
    const value = input.value;
    removeFieldError(input);
    
    if (value.length === 0) {
        return true;
    }
    
    if (value.length < 8) {
        showFieldError(input, 'Пароль должен содержать минимум 8 символов');
        return false;
    }
    
    if (!/[A-Z]/.test(value)) {
        showFieldError(input, 'Пароль должен содержать хотя бы одну заглавную букву');
        return false;
    }
    
    if (!/[0-9]/.test(value)) {
        showFieldError(input, 'Пароль должен содержать хотя бы одну цифру');
        return false;
    }
    
    if (["password", "123456", "admin", "qwerty", "student", "letmein"].includes(value.toLowerCase())) {
        showFieldError(input, 'Этот пароль слишком простой');
        return false;
    }
    
    input.classList.add('success');
    
    // Проверяем подтверждение пароля, если оно заполнено
    const confirmInput = document.getElementById('regPassConfirm');
    if (confirmInput && confirmInput.value.length > 0) {
        validateConfirmPasswordField(confirmInput);
    }
    
    return true;
}

function validateConfirmPasswordField(input) {
    const password = document.getElementById('regPass').value;
    const confirm = input.value;
    removeFieldError(input);
    
    if (confirm.length === 0) {
        return true;
    }
    
    if (confirm !== password) {
        showFieldError(input, 'Пароли не совпадают');
        return false;
    }
    
    input.classList.add('success');
    return true;
}

function validateLoginInput(input) {
    const value = input.value.trim();
    removeFieldError(input);
    
    if (value.length === 0) {
        return true;
    }
    
    if (!usersDB[value]) {
        showFieldError(input, 'Пользователь не найден');
        return false;
    }
    
    input.classList.add('success');
    return true;
}

function showFieldError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');
    
    const existingError = input.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.textContent = message;
        return;
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #c62828;
        font-size: 12px;
        margin-top: 5px;
        padding-left: 5px;
    `;
    
    input.parentElement.appendChild(errorDiv);
}

function removeFieldError(input) {
    input.classList.remove('error', 'success');
    const errorDiv = input.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ===== ВАЛИДАЦИЯ И ОБРАБОТКА ФОРМ =====

function handleRegister() {
    const nameInput = document.getElementById('regName');
    const loginInput = document.getElementById('regLogin');
    const passInput = document.getElementById('regPass');
    const passConfirmInput = document.getElementById('regPassConfirm');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const login = loginInput.value.trim();
    const pass = passInput.value;
    const passConfirm = passConfirmInput.value;

    hideAllMessages();

    // Проверка заполнения всех полей
    if (!name || !login || !pass || !passConfirm) {
        showAuthMessage("Заполните все поля!", 'error');
        return;
    }

    // Валидация имени
    if (name.length < 2) {
        showAuthMessage("Имя должно содержать минимум 2 символа!", 'error');
        return;
    }

    // Валидация логина
    if (!validateLoginField(loginInput)) {
        showAuthMessage("Исправьте ошибки в поле логина!", 'error');
        return;
    }

    // Валидация пароля
    if (!validatePasswordField(passInput)) {
        showAuthMessage("Исправьте ошибки в поле пароля!", 'error');
        return;
    }

    // Проверка совпадения паролей
    if (!validateConfirmPasswordField(passConfirmInput)) {
        showAuthMessage("Пароли не совпадают!", 'error');
        return;
    }

    // Проверка по словарю
    const dictCheck = validatePassword(login, pass, true);
    if (dictCheck.errorFound) {
        showAuthMessage(dictCheck.errorMsg, 'error');
        return;
    }

    // Регистрация пользователя
    const today = new Date().toLocaleDateString('ru-RU');
    usersDB[login] = { 
        name: name,
        history: [{ password: pass, date: today }] 
    };
    
    // Сохраняем в LocalStorage
    saveUserToLocalStorage(login, name);
    
    showAuthMessage(`✅ Пользователь ${login} успешно зарегистрирован!`, 'success');
    
    // Очищаем форму
    clearForm('registerForm');
    
    // Автоматический вход через 1.5 секунды
    setTimeout(() => {
        currentUser = login;
        updateAuthStatus();
        saveCurrentUser(login);
        switchAuthTab('login');
    }, 1500);
}

function handleLogin() {
    const loginInput = document.getElementById('loginUser');
    const passInput = document.getElementById('loginPass');
    const btn = document.getElementById('loginBtn');

    const login = loginInput.value.trim();
    const pass = passInput.value;

    hideAllMessages();

    // Проверка заполнения
    if (!login || !pass) {
        showAuthMessage("Заполните все поля!", 'error');
        return;
    }

    // Проверка блокировки
    if (isLocked) {
        showAuthMessage("🚫 Доступ заблокирован после 3 неудачных попыток.", 'error');
        return;
    }
    
    if (isOnCooldown) {
        showAuthMessage("⏳ Подождите окончания задержки...", 'error');
        return;
    }

    // Проверка существования пользователя
    if (!usersDB[login]) {
        failedAttempts++;
        checkAttempts();
        showAuthMessage("Неверный логин или пароль.", 'error');
        return;
    }

    // Проверка пароля
    const currentPass = usersDB[login].history[usersDB[login].history.length - 1].password;
    
    if (pass !== currentPass) {
        failedAttempts++;
        checkAttempts();
        showAuthMessage(`Неверный пароль. Осталось попыток: ${3 - failedAttempts}`, 'error');
        return;
    }

    // Успешный вход
    failedAttempts = 0;
    currentUser = login;
    updateAuthStatus();
    saveCurrentUser(login);
    
    showAuthMessage(`✅ Добро пожаловать, ${usersDB[login].name}!`, 'success');
    
    // Очищаем поле пароля
    passInput.value = '';
    
    // Закрываем окно через 1.5 секунды
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

// ===== РАБОТА С LOCALSTORAGE =====

function saveUserToLocalStorage(login, name) {
    try {
        const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
        users[login] = {
            name: name,
            registeredAt: new Date().toISOString()
        };
        localStorage.setItem('usersDB', JSON.stringify(users));
        console.log('✅ Пользователь сохранён в LocalStorage');
    } catch (e) {
        console.error('Ошибка сохранения в LocalStorage:', e);
    }
}

function saveCurrentUser(login) {
    try {
        localStorage.setItem('currentUser', login);
        console.log('✅ Текущий пользователь сохранён');
    } catch (e) {
        console.error('Ошибка сохранения текущего пользователя:', e);
    }
}

function loadUserData() {
    try {
        // Загружаем базу пользователей
        const savedUsers = localStorage.getItem('usersDB');
        if (savedUsers) {
            const users = JSON.parse(savedUsers);
            // Добавляем сохранённых пользователей в usersDB
            for (let login in users) {
                if (!usersDB[login]) {
                    usersDB[login] = {
                        name: users[login].name,
                        history: [] // История паролей не сохраняется для безопасности
                    };
                }
            }
            console.log('✅ Загружено пользователей из LocalStorage:', Object.keys(users).length);
        }

        // Загружаем текущего пользователя
        const savedCurrentUser = localStorage.getItem('currentUser');
        if (savedCurrentUser && usersDB[savedCurrentUser]) {
            currentUser = savedCurrentUser;
            updateAuthStatus();
            updateAuthButton();
            console.log('✅ Восстановлена сессия пользователя:', currentUser);
        }
    } catch (e) {
        console.error('Ошибка загрузки из LocalStorage:', e);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthStatus();
    updateAuthButton();
    showAuthMessage('👋 Вы вышли из системы', 'success');
}

function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        if (currentUser) {
            authBtn.textContent = `Выйти (${currentUser})`;
            authBtn.onclick = logout;
        } else {
            authBtn.textContent = 'Войти';
            authBtn.onclick = openAuthModal;
        }
    }
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

function updateAuthStatus() {
    const status = document.getElementById('authUserStatus');
    if (status) {
        if (currentUser) {
            status.textContent = `👤 Вы вошли как: ${usersDB[currentUser].name} (${currentUser})`;
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

function hideAllMessages() {
    const msgBox = document.getElementById('authMessageBox');
    if (msgBox) {
        msgBox.style.display = 'none';
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

    if (password.length < 8) {
        errorFound = true;
        errorMsg = "Пароль должен содержать не менее 8 символов.";
    } else if (["password", "123456", "admin", "qwerty", "student", "letmein"].includes(password.toLowerCase())) {
        errorFound = true;
        errorMsg = "Пароль найден в словаре запрещённых.";
    } else if (isRegistration && usersDB[login] && usersDB[login].history.length > 0) {
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

// ===== ЖУРНАЛ ПАРОЛЕЙ =====

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

        if (usersDB[login].history.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${login}</td><td colspan="2" style="text-align: center; color: #999;">Нет данных</td>`;
            tbody.appendChild(tr);
            continue;
        }

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

// Экспортируем функции
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.openJournal = openJournal;
window.closeJournal = closeJournal;
window.logout = logout;