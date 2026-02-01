// =========== ОЖИДАНИЕ ЗАГРУЗКИ DOM ===========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация скриптов...');
    
    // Инициализация всех функций
    initMobileMenu();
    initPromoCodeButtons();
    initSmoothScroll();
    initAnimations();
    initFixedHeader();
    initVideoPlayers();
    initInteractiveElements();
    
    console.log('Все скрипты успешно инициализированы');
});

// =========== 1. МОБИЛЬНОЕ МЕНЮ ===========
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    // Клик по гамбургеру
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Блокировка скролла при открытом меню
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu-btn') &&
            navLinks.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// =========== 2. КОПИРОВАНИЕ ПРОМОКОДА ===========
function initPromoCodeButtons() {
    const copyButtons = document.querySelectorAll('.copy-button, [data-copy-promo]');
    
    if (copyButtons.length === 0) return;
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Поиск промокода
            let promoCode = '';
            const promoElement = document.querySelector('.promo-code-display, #promoCode');
            
            if (promoElement) {
                promoCode = promoElement.textContent.trim();
            } else {
                // Резервный промокод
                promoCode = 'ICE2024WIN';
            }
            
            // Копирование в буфер обмена
            copyToClipboard(promoCode, this);
        });
    });
}

// Функция копирования в буфер обмена
function copyToClipboard(text, buttonElement = null) {
    // Используем современный Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showCopySuccess(buttonElement);
                showNotification('Промокод скопирован: ' + text, 'success');
            })
            .catch(err => {
                console.error('Ошибка при копировании: ', err);
                fallbackCopy(text, buttonElement);
            });
    } else {
        // Фолбэк для старых браузеров
        fallbackCopy(text, buttonElement);
    }
}

// Фолбэк метод
function fallbackCopy(text, buttonElement) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            showCopySuccess(buttonElement);
            showNotification('Промокод скопирован: ' + text, 'success');
        } else {
            throw new Error('Copy command failed');
        }
    } catch (err) {
        console.error('Ошибка при копировании: ', err);
        showNotification('Не удалось скопировать. Скопируйте код вручную: ' + text, 'error');
    }
}

// Показать успешное копирование
function showCopySuccess(buttonElement) {
    if (!buttonElement) return;
    
    const originalText = buttonElement.innerHTML;
    const originalBg = buttonElement.style.background;
    const originalShadow = buttonElement.style.boxShadow;
    
    buttonElement.innerHTML = '✓ Скопировано!';
    buttonElement.style.background = 'linear-gradient(90deg, #00ff00, #00cc00)';
    buttonElement.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
    
    setTimeout(() => {
        buttonElement.innerHTML = originalText;
        buttonElement.style.background = originalBg;
        buttonElement.style.boxShadow = originalShadow;
    }, 2000);
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Удаляем старое уведомление
    const oldNotification = document.querySelector('.custom-notification');
    if (oldNotification) oldNotification.remove();
    
    // Создаем новое
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    
    // Цвета в зависимости от типа
    let bgColor, textColor;
    if (type === 'success') {
        bgColor = 'linear-gradient(90deg, #00cc00, #009900)';
        textColor = '#ffffff';
    } else if (type === 'error') {
        bgColor = 'linear-gradient(90deg, #ff3333, #cc0000)';
        textColor = '#ffffff';
    } else {
        bgColor = 'linear-gradient(90deg, #00f3ff, #0088ff)';
        textColor = '#0c1a2d';
    }
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: ${textColor};
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.3);
            z-index: 99999;
            font-weight: 600;
            max-width: 400px;
            word-break: break-word;
            animation: notificationSlideIn 0.3s ease;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Автоскрытие через 4 секунды
    setTimeout(() => {
        notification.querySelector('div').style.animation = 'notificationSlideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Добавляем стили для анимаций
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes notificationSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes notificationSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// =========== 3. ПЛАВНАЯ ПРОКРУТКА ===========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header')?.offsetHeight || 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =========== 4. АНИМАЦИИ ===========
function initAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.content-block, .step, .faq-item, .tutorial-item');
        const windowHeight = window.innerHeight;
        
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.visibility = 'visible';
            }
        });
    };
    
    // Установка начального состояния
    const animatedElements = document.querySelectorAll('.content-block, .step, .faq-item, .tutorial-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.visibility = 'hidden';
    });
    
    // Запускаем анимацию
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
}

// =========== 5. ФИКСИРОВАННЫЙ ХЕДЕР ===========
function initFixedHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// =========== 6. ВИДЕО ПЛЕЙЕРЫ ===========
function initVideoPlayers() {
    // Запуск видео по клику на плейсхолдер
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const videoIframe = document.querySelector('.video-wrapper iframe');
    
    if (videoPlaceholder && videoIframe) {
        videoPlaceholder.addEventListener('click', function() {
            // Заменяем src для запуска видео
            let src = videoIframe.getAttribute('src');
            if (src && !src.includes('autoplay=1')) {
                src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
                videoIframe.setAttribute('src', src);
            }
            
            // Скрываем плейсхолдер
            this.style.display = 'none';
        });
    }
    
    // Обработка миниатюр видео
    document.querySelectorAll('.tutorial-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.play-overlay')) return;
            
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            
            showNotification('Видео "' + title + '" скоро будет доступно!', 'info');
        });
    });
}

// =========== 7. ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ ===========
function initInteractiveElements() {
    // Анимация кнопок при наведении
    document.querySelectorAll('.neon-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Анимация карточек
    document.querySelectorAll('.step, .tutorial-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 243, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Плавное появление элементов при загрузке
    setTimeout(() => {
        document.querySelectorAll('.content-block, .step').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
}

// =========== 8. УТИЛИТЫ ===========
// Глобальные функции для использования в консоли
window.CasinoUtils = {
    copyPromoCode: function() {
        const promoElement = document.querySelector('.promo-code-display, #promoCode');
        const promoCode = promoElement ? promoElement.textContent.trim() : 'ICE2024WIN';
        copyToClipboard(promoCode);
    },
    showNotification: showNotification
};
