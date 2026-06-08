document.addEventListener('DOMContentLoaded', () => {
    // Подтягиваем Telegram WebApp API
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
        tg.ready();
        tg.expand(); 
        tg.enableClosingConfirmation();

        // Устанавливаем тотальный монохромный бэкграунд для верхней панели системы
        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#000000');

        // Парсим информацию об операторе из Telegram
        const user = tg.initDataUnsafe?.user;
        if (user) {
            const usernameElement = document.getElementById('username');
            const avatarElement = document.getElementById('user-avatar');

            if (user.username) {
                usernameElement.textContent = `@${user.username}`;
            } else {
                usernameElement.textContent = `${user.first_name} ${user.last_name || ''}`.trim();
            }

            if (user.first_name) {
                avatarElement.textContent = user.first_name.charAt(0).toUpperCase();
            }
        }
    }

    // Обрабатываем премиальное лобби-меню
    const menuButtons = document.querySelectorAll('.ghost-btn');
    
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            
            // Включаем тактильный отклик смартфона при нажатии (Haptic Feedback)
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }

            console.log(`[GHOST ENGINE] Инициализирован экшен: ${action}`);

            // Роутинг событий в зависимости от кнопки
            switch (action) {
                case 'back':
                    if (tg) tg.close();
                    break;
                case 'verifications':
                    tg?.sendData(JSON.stringify({ action: 'open_verifications' }));
                    break;
                case 'manuals':
                    tg?.sendData(JSON.stringify({ action: 'open_manuals' }));
                    break;
                case 'accounts':
                    tg?.sendData(JSON.stringify({ action: 'open_accounts' }));
                    break;
                case 'proxy':
                    tg?.sendData(JSON.stringify({ action: 'open_proxy' }));
                    break;
                default:
                    break;
            }
        });
    });
});