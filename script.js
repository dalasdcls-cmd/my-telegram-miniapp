document.addEventListener('DOMContentLoaded', () => {
    console.log("[GHOST ENGINE] Системный запуск лобби...");

    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#000000');
    }

    // Инициализация профиля
    const user = tg?.initDataUnsafe?.user;
    if (user) {
        const usernameElement = document.getElementById('username');
        const avatarElement = document.getElementById('user-avatar');
        if (usernameElement) {
            usernameElement.textContent = user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ''}`.trim();
        }
        if (avatarElement && user.first_name) {
            avatarElement.textContent = user.first_name.charAt(0).toUpperCase();
        }
    }

    // Поиск узлов навигации
    const mainLobby = document.getElementById('main-lobby');
    const accountsLobby = document.getElementById('accounts-lobby');
    const backToLobbyBtn = document.getElementById('back-to-lobby');
    const btnAccounts = document.querySelector('[data-action="accounts"]');

    // Функция переключения между Лобби и Аккаунтами
    function toggleAccountsMenu() {
        if (!mainLobby || !accountsLobby) return;
        
        if (mainLobby.classList.contains('active')) {
            // Открываем аккаунты
            mainLobby.classList.remove('active');
            accountsLobby.classList.add('active');
            console.log("[GHOST ENGINE] Раздел Тг Аккаунты развернут.");
        } else {
            // Закрываем аккаунты (Повторный клик)
            accountsLobby.classList.remove('active');
            mainLobby.classList.add('active');
            console.log("[GHOST ENGINE] Возврат в основное лобби.");
        }
    }

    // 1. Обработка клика по кнопке ТГ Аккаунты (С поддержкой повторного закрытия)
    if (btnAccounts) {
        btnAccounts.addEventListener('click', (e) => {
            e.preventDefault();
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            toggleAccountsMenu();
        });
    }

    // 2. Кнопка "Назад" внутри подменю аккаунтов
    if (backToLobbyBtn) {
        backToLobbyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            accountsLobby.classList.remove('active');
            mainLobby.classList.add('active');
        });
    }

    // 3. Обработка остальных стандартных кнопок главного лобби
    const standardButtons = document.querySelectorAll('.ghost-btn:not([data-action="accounts"]):not(#back-to-lobby)');
    standardButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

            if (action === 'back') {
                if (tg) tg.close();
            } else if (action) {
                console.log(`[GHOST ENGINE] Сигнал на событие: open_${action}`);
                tg?.sendData(JSON.stringify({ action: `open_${action}` }));
            }
        });
    });

    // 4. Логика покупки аккаунта из сетки активов
    const gridButtons = document.querySelectorAll('.grid-btn');
    gridButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const accType = btn.getAttribute('data-acc');
            const accName = btn.querySelector('.btn-text')?.textContent || "Unknown Asset";
            
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            console.log(`[GHOST ENGINE] Оформление покупки: ${accName}`);

            tg?.sendData(JSON.stringify({ 
                action: 'buy_tg_account', 
                type: accType,
                name: accName 
            }));
        });
    });
});