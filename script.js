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
        const idElement = document.getElementById('user-id');
        const avatarImg = document.getElementById('user-avatar-img');

        if (usernameElement) {
            usernameElement.textContent = user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ''}`.trim();
        }
        if (idElement && user.id) {
            idElement.textContent = `ID: ${user.id}`;
        }
        if (avatarImg && user.photo_url) {
            avatarImg.src = user.photo_url;
            avatarImg.classList.add('visible');
        }
    }

    // 3. База данных описаний товаров
    const productDescriptions = {
        // ТГ Аккаунты
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
        "12_years": "Редкий аккаунт с история практически с момента появления платформы. Максимальная выдержка и высокий возраст.",
        "13_years": "Эксклюзивный аккаунт с максимально возможной выдержкой. Наиболее редкая категория среди возрастных аккаунтов.",
        
        // Верификации
        "bybit": "Официальный верифицированный аккаунт криптовалютной биржи Bybit (уровень KYC-1). Готов к работе с P2P, депозитами и торговлей.",
        "cryptobot": "Активированный аккаунт кошелька Crypto Bot с полным доступом к маркету. Без ограничений на торговлю и вывод активов.",
        "fragment": "Проверенный аккаунт для работы с платформой Fragment. Позволяет безопасно покупать анонимные номера и Telegram Usernames.",
        "wallet": "Верифицированный встроенный кошелек Telegram Wallet (KYC). Свободный доступ к покупке крипты с банковской карты и P2P.",
        
        // Сервисы
        "nakrutka": "Премиум накрутка живых подписчиков, просмотров и реакций для Telegram, Instagram и других социальных сетей. Высокая скорость выполнения без отписок.",
        "virtual_numbers": "Аренда чистых виртуальных номеров для моментального приема SMS-активаций во всех популярных сервисах и мессенджерах.",
        "proxy_srv": "Индивидуальные приватные IPv4/IPv6 прокси высокой скорости. Идеальная стабильность и полная анонимность для парсинга и мультиаккаунтинга."
    };

    // Навигационные узлы
    const mainLobby = document.getElementById('main-lobby');
    const accountsLobby = document.getElementById('accounts-lobby');
    const verificationsLobby = document.getElementById('verifications-lobby');
    const servicesLobby = document.getElementById('services-lobby');
    
    const backToLobbyBtn = document.getElementById('back-to-lobby');
    const backFromVerificationsBtn = document.getElementById('back-from-verifications');
    const backFromServicesBtn = document.getElementById('back-from-services');
    
    const btnAccounts = document.querySelector('[data-action="accounts"]');
    const btnVerifications = document.querySelector('[data-action="verifications"]');
    const btnServices = document.querySelector('[data-action="services"]');

    // Узлы модального окна карточки товара
    const productModal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');

    let currentSelectedType = "";
    let currentSelectedName = "";
    let currentSelectedCategory = ""; 

    const showScreen = (targetScreen) => {
        [mainLobby, accountsLobby, verificationsLobby, servicesLobby].forEach(screen => {
            if(screen) screen.classList.remove('active');
        });
        targetScreen.classList.add('active');
    };

    // Входы в подразделы
    if (btnAccounts) btnAccounts.onclick = () => { if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); showScreen(accountsLobby); };
    if (btnVerifications) btnVerifications.onclick = () => { if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); showScreen(verificationsLobby); };
    if (btnServices) btnServices.onclick = () => { if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); showScreen(servicesLobby); };

    // Кнопки возврата «Назад»
    if (backToLobbyBtn) backToLobbyBtn.onclick = () => { if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); showScreen(mainLobby); };
    if (backFromVerificationsBtn) backFromVerificationsBtn.onclick = () => { if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); showScreen(mainLobby); };
    if (backFromServicesBtn) backFromServicesBtn.onclick = () => { if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); showScreen(mainLobby); };

    // Кнопки главного меню (Мануалы, Прокси, Назад)
    const standardButtons = document.querySelectorAll('.ghost-menu .ghost-btn:not([data-action="accounts"]):not([data-action="verifications"]):not([data-action="services"])');
    standardButtons.forEach(button => {
        button.onclick = () => {
            const action = button.getAttribute('data-action');
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

            if (action === 'back') {
                if (tg) tg.close();
            } else if (action) {
                tg?.sendData(JSON.stringify({ action: `open_${action}` }));
            }
        };
    });

    // Клики по товарам (Открытие карточки описания)
    const allProductButtons = document.querySelectorAll('.grid-btn, .list-btn');
    allProductButtons.forEach(btn => {
        btn.onclick = () => {
            const accType = btn.getAttribute('data-acc');
            const verifType = btn.getAttribute('data-verif');
            const serviceType = btn.getAttribute('data-service');
            
            // Считываем только текст названия, отрезая цену для красоты
            const assetName = btn.querySelector('span:first-child')?.textContent || btn.textContent.split('$')[0].trim();
            
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

            if (accType) {
                currentSelectedType = accType;
                currentSelectedCategory = "account";
            } else if (verifType) {
                currentSelectedType = verifType;
                currentSelectedCategory = "verification";
            } else if (serviceType) {
                currentSelectedType = serviceType;
                currentSelectedCategory = "service";
            }
            
            currentSelectedName = assetName;

            if (modalTitle && modalDescription && productModal) {
                modalTitle.textContent = assetName;
                modalDescription.textContent = productDescriptions[currentSelectedType] || "Описание временно отсутствует.";
                productModal.classList.add('open');
            }
        };
    });

    window.onclick = (e) => { if (e.target === productModal) productModal.classList.remove('open'); };
    if (modalCloseBtn) modalCloseBtn.onclick = () => productModal.classList.remove('open');

    // Подтверждение покупки в модальном окне
    if (modalConfirmBtn) {
        modalConfirmBtn.onclick = () => {
            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            productModal.classList.remove('open');
            
            let actionName = "buy_tg_account";
            if (currentSelectedCategory === "verification") actionName = "buy_verification";
            if (currentSelectedCategory === "service") actionName = "buy_service";

            tg?.sendData(JSON.stringify({ 
                action: actionName, 
                type: currentSelectedType,
                name: currentSelectedName 
            }));
        };
    }
});