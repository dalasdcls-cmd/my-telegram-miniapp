document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация Telegram WebApp
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
        tg.ready();
        tg.expand(); 
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#000000');
    }

    // 2. Настройка профиля пользователя Telegram
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

    // 3. Узлы навигации (Главное лобби и Меню аккаунтов)
    const mainLobby = document.getElementById('main-lobby');
    const accountsLobby = document.getElementById('accounts-lobby');
    const backToLobbyBtn = document.getElementById('back-to-lobby');

    // 4. Логика кнопки "Тг аккаунты" (Переключение экранов)
    const btnAccounts = document.querySelector('[data-action="accounts"]');
    if (btnAccounts) {
        btnAccounts.addEventListener('click', (e) => {
            e.preventDefault();
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            
            if (mainLobby && accountsLobby) {
                mainLobby.classList.add('hidden');
                accountsLobby.classList.remove('hidden');
            }
        });
    }

    // 5. Логика кнопки "Назад" внутри меню аккаунтов (Возврат)
    if (backToLobbyBtn) {
        backToLobbyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            
            if (mainLobby && accountsLobby) {
                accountsLobby.classList.add('hidden');
                mainLobby.classList.remove('hidden');
            }
        });
    }

    // 6. Логика остальных стандартных кнопок главного лобби (Мануалы, Прокси, Верификации)
    const standardButtons = document.querySelectorAll('.ghost-btn:not([data-action="accounts"]):not(#back-to-lobby)');
    standardButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

            if (action === 'back') {
                if (tg) tg.close();
            } else if (action) {
                tg?.sendData(JSON.stringify({ action: `open_${action}` }));
            }
        });
    });

    // 7. Логика клика по конкретному аккаунту из сетки (От 1 до 13 лет отлеги)
    const gridButtons = document.querySelectorAll('.grid-btn');
    gridButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const accType = btn.getAttribute('data-acc');
            const accName = btn.querySelector('.btn-text')?.textContent || "Неизвестный тип";
            
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            
            // Отправляем JSON-строку в твой bot.py и закрываем Mini App
            tg?.sendData(JSON.stringify({ 
                action: 'buy_tg_account', 
                type: accType,
                name: accName 
            }));
        });
    });
});