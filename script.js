document.addEventListener('DOMContentLoaded', () => {
    console.log("[GHOST ENGINE] Системный запуск лобби...");

    // 1. Инициализация Telegram WebApp API
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#000000');
    }

    // 2. Настройка профиля и подгрузка РЕАЛЬНОЙ аватарки
    const user = tg?.initDataUnsafe?.user;
    if (user) {
        const usernameElement = document.getElementById('username');
        const avatarImg = document.getElementById('user-avatar-img');

        if (usernameElement) {
            usernameElement.textContent = user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ''}`.trim();
        }
        
        if (avatarImg && user.photo_url) {
            avatarImg.src = user.photo_url;
            avatarImg.classList.add('visible');
            console.log("[GHOST ENGINE] Аватарка успешно инициализирована.");
        }
    }

    // 3. База данных описаний товаров
    const productDescriptions = {
        "novoregi": "Свежезарегистрированный аккаунт с minimal-историей активности. Отлично подойдет для новых проектов и личного использования.",
        "1_year": "Аккаунт с выдержкой более одного года. Имеет естественный возраст и выглядит значительно надежнее нового аккаунта.",
        "2_years": "Аккаунт с хорошей выдержкой и подтвержденным возрастом. Популярный выбор благодаря оптимальному соотношению цены и возраста.",
        "3_years": "Проверенный временем аккаунт с солидным сроком существования. Вызывает больше доверия за счет длительной истории регистрации.",
        "4_years": "Возрастной аккаунт с многолетней выдержкой. Подходит для пользователей, которым важен естественный возраст аккаунта.",
        "5_years": "Старый аккаунт с длительной историей существования. Отличается хорошей выдержкой и высоким уровнем доверия по возрасту.",
        "6_years": "Аккаунт с внушительным сроком регистрации. Ценится за естественность и длительное присутствие в Telegram.",
        "7_years": "Редкий возрастной аккаунт с многолетней историей. Отличный выбор для ценителей старых регистраций.",
        "8_years": "Аккаунт ранних лет Telegram с серьезной выдержкой. Высоко ценится благодаря своему возрасту.",
        "9_years": "Очень старый аккаунт с длительной историю существования. Выделяется среди большинства современных регистраций.",
        "10_years": "Десятилетний аккаунт с редким возрастом. Подходит тем, кто ищет максимально старую регистрацию.",
        "11_years": "Один из наиболее возрастных аккаунтов Telegram. Отличается редкостью и длительным сроком существования.",
        "12_years": "Редкий аккаунт с историей практически с момента появления платформы. Максимальная выдержка и высокий возраст.",
        "13_years": "Эксклюзивный аккаунт с максимально возможной выдержкой. Наиболее редкая категория среди возрастных аккаунтов."
    };

    // Навигационные узлы
    const mainLobby = document.getElementById('main-lobby');
    const accountsLobby = document.getElementById('accounts-lobby');
    const backToLobbyBtn = document.getElementById('back-to-lobby');
    const btnAccounts = document.querySelector('[data-action="accounts"]');

    // Узлы модального окна карточки товара
    const productModal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');

    let currentSelectedType = "";
    let currentSelectedName = "";

    // Переключение лобби / подменю
    function toggleAccountsMenu() {
        if (!mainLobby || !accountsLobby) return;
        if (mainLobby.classList.contains('active')) {
            mainLobby.classList.remove('active');
            accountsLobby.classList.add('active');
        } else {
            accountsLobby.classList.remove('active');
            mainLobby.classList.add('active');
        }
    }

    if (btnAccounts) {
        btnAccounts.addEventListener('click', (e) => {
            e.preventDefault();
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            toggleAccountsMenu();
        });
    }

    if (backToLobbyBtn) {
        backToLobbyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            accountsLobby.classList.remove('active');
            mainLobby.classList.add('active');
        });
    }

    // Обработка кликов остальных кнопок главного меню
    const standardButtons = document.querySelectorAll('.ghost-btn:not([data-action="accounts"]):not(#back-to-lobby):not(#modal-confirm-btn)');
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

    // Открытие карточки описания товара из сетки
    const gridButtons = document.querySelectorAll('.grid-btn');
    gridButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const accType = btn.getAttribute('data-acc');
            const accName = btn.querySelector('.btn-text')?.textContent || "Unknown Asset";
            
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

            currentSelectedType = accType;
            currentSelectedName = accName;

            if (modalTitle && modalDescription && productModal) {
                modalTitle.textContent = accName;
                modalDescription.textContent = productDescriptions[accType] || "Описание временно отсутствует.";
                productModal.classList.add('open');
            }
        });
    });

    // Закрытие модального окна
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => productModal.classList.remove('open'));
    }
    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) productModal.classList.remove('open');
        });
    }

    // Подтверждение покупки внутри карточки описания
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            productModal.classList.remove('open');

            // Возвращаем JSON в твой python-скрипт бота
            tg?.sendData(JSON.stringify({ 
                action: 'buy_tg_account', 
                type: currentSelectedType,
                name: currentSelectedName 
            }));
        });
    }
});