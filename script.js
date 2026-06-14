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

    const SERVER_URL = "http://localhost:8000"; 
    const user = tg?.initDataUnsafe?.user;

    // Функция обновления баланса на экране
    function refreshBalance() {
        if (user && user.id) {
            const balanceElement = document.getElementById('user-balance');
            fetch(`${SERVER_URL}/api/get_balance?user_id=${user.id}`)
                .then(response => response.json())
                .then(data => {
                    if (balanceElement && data.balance !== undefined) {
                        balanceElement.textContent = parseFloat(data.balance).toFixed(2);
                    }
                })
                .catch(err => console.error("[GHOST API] Бот отключен или шлюз не запущен. Ждем коннекта..."));
        }
    }

    // 2. Настройка профиля и аватарки
    if (user) {
        const usernameElement = document.getElementById('username');
        const avatarImg = document.getElementById('user-avatar-img');

        if (usernameElement) {
            usernameElement.textContent = user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ''}`.trim();
        }
        if (avatarImg && user.photo_url) {
            avatarImg.src = user.photo_url;
            avatarImg.classList.add('visible');
        }
        
        // Запрос баланса
        refreshBalance();
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
        "12_years": "Редкий аккаунт с история практически с момента появления платформы. Максимальная выдержка и высокий возраст.",
        "13_years": "Эксклюзивный аккаунт с максимально возможной выдержкой. Наиболее редкая категория среди возрастных аккаунтов.",
        "bybit": "Официальный верифицированный аккаунт криптовалютной биржи Bybit (уровень KYC-1). Готов к работе с P2P, депозитами и торговлей.",
        "cryptobot": "Активированный аккаунт кошелька Crypto Bot с полным доступом к маркету. Без ограничений на торговлю и вывод активов.",
        "fragment": "Проверенный аккаунт для работы с платформой Fragment. Позволяет безопасно покупать анонимные номера и Telegram Usernames.",
        "wallet": "Верифицированный встроенный кошелек Telegram Wallet (KYC). Свободный доступ к покупке крипты с банковской карты и P2P.",
        "nakrutka": "Премиум накрутка живых подписчиков, просмотров и реакций для Telegram, Instagram и других социальных сетей. Высокая скорость выполнения без отписок.",
        "virtual_numbers": "Аренда чистых виртуальных номеров для моментального приема SMS-активаций во всех популярных сервисах и мессенджерах.",
        "proxy_srv": "Индивидуальные приватные IPv4/IPv6 прокси высокой скорости. Идеальная стабильность и полная анонимность для парсинга и мультиаккаунтинга.",
        "progrev_tg": "Пошаговое приватное руководство по профессиональному прогреву Telegram-аккаунтов. Защита от спамблока, прогрев сессий, лимиты инвайтинга и подготовка под рассылки.",
        "p2p_no_cards": "Актуальная авторская методика проведения P2P-сделок без использования личных или дроп-карт. Обход классических банковских ограничений, работа с альтернативными шлюзами платежей и личная безопасность.",
        "cheap_tg_accs": "Мануал по поиску и закупке аккаунтов Telegram по самым низким ценам на рынке. Обзор закрытых оптовых бирж, методы проверки сессий на валидность и защита от восстановления.",
        "arbitrazh": "Платный AI-инструмент для Telegram, который автоматизирует работу с аккаунтами: парсинг аудитории, переписки, комментарии и аналитику. Используется в арбитраже трафика и продвижении в Telegram."
    };

    const articleLinks = {
        "progrev_tg": "https://telegra.ph/Manual-po-progrevu-akkaunta-telegramm-06-10-2",
        "p2p_no_cards": "https://telegra.ph/p2p-bez-kart-v-CryptoBot-06-10",
        "cheap_tg_accs": "https://telegra.ph/Manual-po-pokupke-deshevyh-akkauntov-s-otlegoj-06-10"
    };

    // Навигационные узлы
    const mainLobby = document.getElementById('main-lobby');
    const accountsLobby = document.getElementById('accounts-lobby');
    const verificationsLobby = document.getElementById('verifications-lobby');
    const servicesLobby = document.getElementById('services-lobby');
    const manualsLobby = document.getElementById('manuals-lobby');
    const toolsLobby = document.getElementById('tools-lobby');
    
    const backToLobbyBtn = document.getElementById('back-to-lobby');
    const backFromVerificationsBtn = document.getElementById('back-from-verifications');
    const backFromServicesBtn = document.getElementById('back-from-services');
    const backFromManualsBtn = document.getElementById('back-from-manuals');
    const backFromToolsBtn = document.getElementById('back-from-tools');
    
    const btnAccounts = document.querySelector('[data-action="accounts"]');
    const btnVerifications = document.querySelector('[data-action="verifications"]');
    const btnServices = document.querySelector('[data-action="services"]');
    const btnManuals = document.querySelector('[data-action="manuals"]');
    const btnTools = document.querySelector('[data-action="tools"]');

    const productModal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalArticleContainer = document.getElementById('modal-article-container');
    const modalArticleLink = document.getElementById('modal-article-link');

    let currentSelectedType = "";
    let currentSelectedName = "";
    let currentSelectedPrice = 0.0;

    const showScreen = (targetScreen) => {
        [mainLobby, accountsLobby, verificationsLobby, servicesLobby, manualsLobby, toolsLobby].forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        if (targetScreen) targetScreen.classList.add('active');
    };

    if (btnAccounts) btnAccounts.onclick = () => { tg?.HapticFeedback?.impactOccurred('light'); showScreen(accountsLobby); };
    if (btnVerifications) btnVerifications.onclick = () => { tg?.HapticFeedback?.impactOccurred('light'); showScreen(verificationsLobby); };
    if (btnServices) btnServices.onclick = () => { tg?.HapticFeedback?.impactOccurred('light'); showScreen(servicesLobby); };
    if (btnManuals) btnManuals.onclick = () => { tg?.HapticFeedback?.impactOccurred('light'); showScreen(manualsLobby); };
    if (btnTools) btnTools.onclick = () => { tg?.HapticFeedback?.impactOccurred('light'); showScreen(toolsLobby); };

    if (backToLobbyBtn) backToLobbyBtn.onclick = () => { tg?.HapticFeedback?.impactOccurred('light'); showScreen(mainLobby); };
    if (backFromVerificationsBtn) backFromVerificationsBtn.onclick = () => { tg?.HapticFeedback?.impactOccurred('light'); showScreen(mainLobby); };
    if (backFromServicesBtn) backFromServicesBtn.onclick = () => { tg?.HapticFeedback?.impactOccurred('light'); showScreen(mainLobby); };
    if (backFromManualsBtn) backFromManualsBtn.onclick = () => { tg?.HapticFeedback?.impactOccurred('light'); showScreen(mainLobby); };
    if (backFromToolsBtn) backFromToolsBtn.onclick = () => { tg?.HapticFeedback?.impactOccurred('light'); showScreen(mainLobby); };

    const allProductButtons = document.querySelectorAll('.grid-btn, .list-btn');
    allProductButtons.forEach(btn => {
        btn.onclick = () => {
            const accType = btn.getAttribute('data-acc');
            const verifType = btn.getAttribute('data-verif');
            const serviceType = btn.getAttribute('data-service');
            const manualType = btn.getAttribute('data-manual');
            const toolType = btn.getAttribute('data-tool');
            
            const assetName = btn.querySelector('span:first-child')?.textContent || btn.textContent.split('$')[0].trim();
            const priceText = btn.querySelector('.price')?.textContent || "0$";
            const parsedPrice = parseFloat(priceText.replace('$', '')) || 0.0;

            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

            if (accType) currentSelectedType = accType;
            else if (verifType) currentSelectedType = verifType;
            else if (serviceType) currentSelectedType = serviceType;
            else if (manualType) currentSelectedType = manualType;
            else if (toolType) currentSelectedType = toolType;
            
            currentSelectedName = assetName;
            currentSelectedPrice = parsedPrice;

            if (modalTitle && modalDescription && productModal) {
                modalTitle.textContent = assetName;
                modalDescription.textContent = productDescriptions[currentSelectedType] || "Описание временно отсутствует.";
                
                if (articleLinks[currentSelectedType]) {
                    modalArticleLink.href = articleLinks[currentSelectedType];
                    modalArticleContainer.style.display = "block";
                } else {
                    modalArticleContainer.style.display = "none";
                }

                productModal.classList.add('open');
            }
        };
    });

    if (modalCloseBtn) modalCloseBtn.onclick = () => productModal.classList.remove('open');
    window.onclick = (e) => { if (e.target === productModal) productModal.classList.remove('open'); };

    if (modalConfirmBtn) {
        modalConfirmBtn.onclick = () => {
            if (!user || !user.id) {
                tg?.showAlert("Ошибка авторизации сессии Telegram.");
                return;
            }

            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            productModal.classList.remove('open');

            fetch(`${SERVER_URL}/api/buy_item`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    price: currentSelectedPrice,
                    item_name: currentSelectedName
                })
            })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    const balanceElement = document.getElementById('user-balance');
                    if (balanceElement) balanceElement.textContent = parseFloat(resData.new_balance).toFixed(2);
                    
                    tg?.showPopup({
                        title: "Успешная покупка!",
                        message: `Вы успешно приобрели "${currentSelectedName}" за ${currentSelectedPrice} USDT. Чек отправлен в чат бота.`,
                        buttons: [{ type: "ok" }]
                    });
                } else {
                    tg?.showAlert(resData.message || "Ошибка проведения платежа.");
                }
            })
            .catch(err => {
                console.error(err);
                tg?.showAlert("Не удалось связаться с сервером для списания средств.");
            });
        };
    }
});