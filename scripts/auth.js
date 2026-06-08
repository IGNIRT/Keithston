// ===== СИСТЕМА АУТЕНТИФИКАЦИИ С EMAIL И ПРАВАМИ АДМИНА =====
// База данных пользователей
let usersDB = {
    "admin": {
        name: "Administrator",
        email: "admin@keithston.com",
        role: "admin",
        permissions: ["view_users", "edit_users", "delete_users", "view_stats", "manage_content"],
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
    loadUserData();
    createTopRightLoginButton();
});

function initAuthSystem() {
    const closeBtns = document.querySelectorAll('.auth-modal-close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAuthModal);
    });

    const overlay = document.getElementById('authModalOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeAuthModal();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAuthModal();
            closeJournal();
        }
    });

    setupRealTimeValidation();
}

// ===== КНОПКА LOGIN В ПРАВОМ ВЕРХНЕМ УГЛУ =====
function createTopRightLoginButton() {
    const existingBtn = document.querySelector('.auth-btn-top-right');
    if (existingBtn) existingBtn.remove();

    const btn = document.createElement('button');
    btn.className = 'auth-btn-top-right';
    btn.id = 'topRightAuthBtn';

    if (currentUser) {
        btn.textContent = `Выйти (${currentUser})`;
        btn.classList.add('logged-in');
        btn.onclick = logout;
    } else {
        btn.textContent = 'Login';
        btn.onclick = openAuthModal;
    }

    document.body.appendChild(btn);
}

// ===== УПРАВЛЕНИЕ POPUP ОКНАМИ =====
function openAuthModal() {
    const overlay = document.getElementById('authModalOverlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateAuthStatus();
        clearAllForms();
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
    const regLogin = document.getElementById('regLogin');
    if (regLogin) {
        regLogin.addEventListener('input', function() {
            validateLoginField(this);
        });
    }

    const regEmail = document.getElementById('regEmail');
    if (regEmail) {
        regEmail.addEventListener('input', function() {
            validateEmailField(this);
        });
    }

    const regPass = document.getElementById('regPass');
    if (regPass) {
        regPass.addEventListener('input', function() {
            validatePasswordField(this);
        });
    }

    const regPassConfirm = document.getElementById('regPassConfirm');
    if (regPassConfirm) {
        regPassConfirm.addEventListener('input', function() {
            validateConfirmPasswordField(this);
        });
    }

    const loginUser = document.getElementById('loginUser');
    if (loginUser) {
        loginUser.addEventListener('input', function() {
            validateLoginInput(this);
        });
    }

    const loginEmail = document.getElementById('loginEmail');
    if (loginEmail) {
        loginEmail.addEventListener('input', function() {
            validateLoginEmailInput(this);
        });
    }
}

function validateEmailField(input) {
    const value = input.value.trim();
    removeFieldError(input);
    
    if (value.length === 0) {
        return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showFieldError(input, 'Введите корректный email адрес');
        return false;
    }

    const emailExists = Object.values(usersDB).some(user => user.email === value);
    if (emailExists) {
        showFieldError(input, 'Этот email уже зарегистрирован');
        return false;
    }

    input.classList.add('success');
    return true;
}

function validateLoginEmailInput(input) {
    const value = input.value.trim();
    removeFieldError(input);
    
    if (value.length === 0) {
        return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showFieldError(input, 'Введите корректный email');
        return false;
    }

    const userExists = Object.values(usersDB).some(user => user.email === value);
    if (!userExists) {
        showFieldError(input, 'Пользователь с таким email не найден');
        return false;
    }

    input.classList.add('success');
    return true;
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
    const emailInput = document.getElementById('regEmail');
    const passInput = document.getElementById('regPass');
    const passConfirmInput = document.getElementById('regPassConfirm');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const login = loginInput.value.trim();
    const email = emailInput ? emailInput.value.trim() : '';
    const pass = passInput.value;
    const passConfirm = passConfirmInput.value;

    hideAllMessages();

    if (!name || !login || !email || !pass || !passConfirm) {
        showAuthMessage("Заполните все поля!", 'error');
        return;
    }

    if (name.length < 2) {
        showAuthMessage("Имя должно содержать минимум 2 символа!", 'error');
        return;
    }

    if (!validateEmailField(emailInput)) {
        showAuthMessage("Исправьте ошибки в поле email!", 'error');
        return;
    }

    if (!validateLoginField(loginInput)) {
        showAuthMessage("Исправьте ошибки в поле логина!", 'error');
        return;
    }

    if (!validatePasswordField(passInput)) {
        showAuthMessage("Исправьте ошибки в поле пароля!", 'error');
        return;
    }

    if (!validateConfirmPasswordField(passConfirmInput)) {
        showAuthMessage("Пароли не совпадают!", 'error');
        return;
    }

    const dictCheck = validatePassword(login, pass, true);
    if (dictCheck.errorFound) {
        showAuthMessage(dictCheck.errorMsg, 'error');
        return;
    }

    const today = new Date().toLocaleDateString('ru-RU');
    usersDB[login] = { 
        name: name,
        email: email,
        role: "user",
        permissions: ["view_content"],
        history: [{ password: pass, date: today }] 
    };

    saveUserToLocalStorage(login, name, email);

    showAuthMessage(`✅ Пользователь ${login} успешно зарегистрирован!`, 'success'); 

    clearForm('registerForm');

    setTimeout(() => {
        currentUser = login;
        updateAuthStatus();
        saveCurrentUser(login);
        switchAuthTab('login');
        createTopRightLoginButton();
        showAdminPanelIfAdmin();
    }, 1500);
}

function handleLogin() {
    const loginType = document.querySelector('.login-type-selector input:checked');
    const loginMethod = loginType ? loginType.value : 'username';
    let login = '';
    let pass = '';

    if (loginMethod === 'username') {
        const loginInput = document.getElementById('loginUser');
        const passInput = document.getElementById('loginPass');
        login = loginInput.value.trim();
        pass = passInput.value;
    } else {
        const emailInput = document.getElementById('loginEmail');
        const passInput = document.getElementById('loginPass');
        const email = emailInput.value.trim();
        pass = passInput.value;
        
        const user = Object.values(usersDB).find(u => u.email === email);
        login = user ? Object.keys(usersDB).find(key => usersDB[key] === user) : '';
    }

    hideAllMessages();

    if (!login || !pass) {
        showAuthMessage("Заполните все поля!", 'error');
        return;
    }

    if (isLocked) {
        showAuthMessage("🚫 Доступ заблокирован после 3 неудачных попыток.", 'error');
        return;
    }

    if (isOnCooldown) {
        showAuthMessage("⏳ Подождите окончания задержки...", 'error');
        return;
    }

    if (!usersDB[login]) {
        failedAttempts++;
        checkAttempts();
        showAuthMessage("Неверный логин/email или пароль.", 'error');
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
    saveCurrentUser(login);

    showAuthMessage(`✅ Добро пожаловать, ${usersDB[login].name}!`, 'success');

    const passInput = document.getElementById('loginPass');
    if(passInput) passInput.value = '';

    setTimeout(() => {
        closeAuthModal();
        createTopRightLoginButton();
        showAdminPanelIfAdmin();
    }, 1500);
}

function checkAttempts() {
    const btn = document.getElementById('loginBtn');
    if (!btn) return;

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
function saveUserToLocalStorage(login, name, email) {
    try {
        const users = JSON.parse(localStorage.getItem('usersDB') || '{}');
        users[login] = {
            name: name,
            email: email,
            role: usersDB[login].role,
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
        const savedUsers = localStorage.getItem('usersDB');
        if (savedUsers) {
            const users = JSON.parse(savedUsers);
            for (let login in users) {
                if (!usersDB[login]) {
                    usersDB[login] = {
                        name: users[login].name,
                        email: users[login].email,
                        role: users[login].role || "user",
                        permissions: users[login].permissions || ["view_content"],
                        history: [] 
                    };
                }
            }
            console.log('✅ Загружено пользователей из LocalStorage:', Object.keys(users).length);
        }
        
        const savedCurrentUser = localStorage.getItem('currentUser');
        if (savedCurrentUser && usersDB[savedCurrentUser]) {
            currentUser = savedCurrentUser;
            updateAuthStatus();
            createTopRightLoginButton();
            showAdminPanelIfAdmin();
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
    createTopRightLoginButton();
    removeAdminPanel();
    showNotification('👋 Вы вышли из системы', 'info');
}

// ===== ПАНЕЛЬ АДМИНИСТРАТОРА =====
function showAdminPanelIfAdmin() {
    if (!currentUser || !usersDB[currentUser] || usersDB[currentUser].role !== 'admin') return;
    
    removeAdminPanel();

    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    panel.id = 'adminPanel';
    panel.innerHTML = `
        <h3>🔐 Панель администратора</h3>
        <div class="stats-container">
            <div class="stat-card">
                <p class="stat-value">${Object.keys(usersDB).length}</p>
                <p class="stat-label">Всего пользователей</p>
            </div>
            <div class="stat-card">
                <p class="stat-value">${usersDB[currentUser].permissions.length}</p>
                <p class="stat-label">Ваши права</p>
            </div>
        </div>
        <div class="admin-actions">
            <button class="admin-btn" onclick="viewAllUsers()">👥 Просмотр пользователей</button>
            <button class="admin-btn" onclick="viewStatistics()">📊 Статистика</button>
            <button class="admin-btn" onclick="manageContent()">📝 Управление контентом</button>
            <button class="admin-btn danger" onclick="clearAllData()">🗑️ Очистить данные</button>
        </div>
    `;

    document.body.insertBefore(panel, document.body.firstChild);
}

function removeAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) panel.remove();
}

function viewAllUsers() {
    if (!hasPermission('view_users')) {
        showNotification('❌ У вас нет прав для просмотра пользователей', 'error');
        return;
    }
    const userList = Object.keys(usersDB).map(login => {
        const user = usersDB[login];
        return `${login} (${user.email}) - ${user.role}`;
    }).join('\n');

    alert('📋 Список пользователей:\n\n' + userList);
}

function viewStatistics() {
    if (!hasPermission('view_stats')) {
        showNotification('❌ У вас нет прав для просмотра статистики', 'error');
        return;
    }
    const totalUsers = Object.keys(usersDB).length;
    const adminCount = Object.values(usersDB).filter(u => u.role === 'admin').length;
    const regularUsers = totalUsers - adminCount;

    alert(`📊 Статистика:\n\nВсего пользователей: ${totalUsers}\nАдминистраторов: ${adminCount}\nОбычных пользователей: ${regularUsers}`);
}

function manageContent() {
    if (!hasPermission('manage_content')) {
        showNotification('❌ У вас нет прав для управления контентом', 'error');
        return;
    }
    showNotification('📝 Режим управления контентом активирован', 'success');
}

function clearAllData() {
    if (!confirm('⚠️ Вы уверены? Все данные будут удалены!')) return;
    localStorage.clear();
    showNotification('🗑️ Все данные очищены', 'success');
    setTimeout(() => location.reload(), 1500);
}

function hasPermission(permission) {
    if (!currentUser || !usersDB[currentUser]) return false;
    return usersDB[currentUser].permissions.includes(permission);
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function updateAuthStatus() {
    const status = document.getElementById('authUserStatus');
    if (status) {
        if (currentUser && usersDB[currentUser]) {
            const user = usersDB[currentUser];
            status.textContent = `👤 Вы вошли как: ${user.name} (${currentUser}) | Роль: ${user.role}`;
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

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3';

    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 30px;
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

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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
    if(!tbody) return;
    
    tbody.innerHTML = '';

    const usersToShow = hasPermission('view_users') ? Object.keys(usersDB) : [currentUser];

    for (let login of usersToShow) {
        if (!hasPermission('view_users') && login !== currentUser) continue;

        if (!usersDB[login] || usersDB[login].history.length === 0) {
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

function toggleLoginMethod() {
    const loginType = document.querySelector('.login-type-selector input:checked');
    if(!loginType) return;
    
    const byUsername = document.getElementById('loginByUsername');
    const byEmail = document.getElementById('loginByEmail');
    
    if (loginType.value === 'username') {
        if(byUsername) byUsername.style.display = 'block';
        if(byEmail) byEmail.style.display = 'none';
    } else {
        if(byUsername) byUsername.style.display = 'none';
        if(byEmail) byEmail.style.display = 'block';
    }
}

// ===== ЭКСПОРТ ФУНКЦИЙ В ГЛОБАЛЬНУЮ ОБЛАСТЬ =====
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.openJournal = openJournal;
window.closeJournal = closeJournal;
window.logout = logout;
window.viewAllUsers = viewAllUsers;
window.viewStatistics = viewStatistics;
window.manageContent = manageContent;
window.clearAllData = clearAllData;
window.toggleLoginMethod = toggleLoginMethod;
window.createTopRightLoginButton = createTopRightLoginButton;
window.showAdminPanelIfAdmin = showAdminPanelIfAdmin;