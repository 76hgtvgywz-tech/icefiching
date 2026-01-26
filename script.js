// =========== УНИВЕРСАЛЬНЫЙ КОД БЕЗ ВСТРОЕННЫХ СКРИПТОВ ===========

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем скрипты...');
    
    // 1. Инициализация мобильного меню
    initMobileMenu();
    
    // 2. Инициализация кнопок копирования промокода
    initPromoCodeButtons();
    
    // 3. Инициализация плавной прокрутки
    initSmoothScroll();
    
    // 4. Инициализация анимаций
    initAnimations();
    
    // 5. Инициализация фиксированного хедера
    initFixedHeader();
    
    console.log('Все скрипты инициализированы');
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
            document.body.style.height = '100vh';
        } else {
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.height = '';
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
            document.body.style.height = '';
        }
    });
    
    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
    });
}

// =========== 2. КОПИРОВАНИЕ ПРОМОКОДА ===========
function initPromoCodeButtons() {
    // Находим все кнопки копирования
    const copyButtons = document.querySelectorAll('.copy-button, .copy-promo-btn, [data-copy-promo]');
    
    if (copyButtons.length === 0) {
        console.warn('Кнопки копирования не найдены');
        return;
    }
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Ищем промокод в ближайшем контейнере
            const promoContainer = this.closest('.promo-container, .content-block, [data-promo-container]');
            let promoCode = '';
            
            // Вариант 1: Промокод в data-атрибуте кнопки
            if (this.dataset.promoCode) {
                promoCode = this.dataset.promoCode;
            }
            // Вариант 2: Промокод в ближайшем элементе .promo-code-display
            else if (promoContainer) {
                const promoElement = promoContainer.querySelector('.promo-code-display, [data-promo-code]');
                if (promoElement) {
                    promoCode = promoElement.textContent.trim();
                }
            }
            // Вариант 3: Промокод в глобальном элементе
            else {
                const globalPromoElement = document.querySelector('.promo-code-display, [data-promo-code], #promoCode');
                if (globalPromoElement) {
                    promoCode = globalPromoElement.textContent.trim();
                }
            }
            
            // Если промокод найден - копируем
            if (promoCode) {
                copyTextToClipboard(promoCode, this);
            } else {
                console.error('Промокод не найден');
                showNotification('Ошибка: промокод не найден', 'error');
            }
        });
    });
}

// Современный метод копирования в буфер обмена
function copyTextToClipboard(text, buttonElement = null) {
    // Используем современный Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Успешное копирование
                if (buttonElement) {
                    updateButtonState(buttonElement, true);
                }
                showNotification('Промокод скопирован: ' + text, 'success');
            })
            .catch(err => {
                console.error('Ошибка при копировании: ', err);
                fallbackCopyTextToClipboard(text, buttonElement);
            });
    } else {
        // Фолбэк для старых браузеров
        fallbackCopyTextToClipboard(text, buttonElement);
    }
}

// Фолбэк метод для старых браузеров
function fallbackCopyTextToClipboard(text, buttonElement = null) {
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
            if (buttonElement) {
                updateButtonState(buttonElement, true);
            }
            showNotification('Промокод скопирован: ' + text, 'success');
        } else {
            throw new Error('Copy command failed');
        }
    } catch (err) {
        console.error('Ошибка при копировании: ', err);
        showNotification('Не удалось скопировать. Скопируйте код вручную: ' + text, 'error');
        
        if (buttonElement) {
            updateButtonState(buttonElement, false);
        }
    }
}

// Обновление состояния кнопки
function updateButtonState(button, success) {
    const originalText = button.innerHTML;
    const originalBg = button.style.background;
    const originalShadow = button.style.boxShadow;
    
    if (success) {
        button.innerHTML = '✓ Скопировано!';
        button.style.background = 'linear-gradient(90deg, #00ff00, #00cc00)';
        button.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
        
        // Возвращаем исходное состояние через 2 секунды
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = originalBg;
            button.style.boxShadow = originalShadow;
        }, 2000);
    } else {
        button.innerHTML = 'Ошибка копирования';
        button.style.background = 'linear-gradient(90deg, #ff0000, #cc0000)';
        button.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.5)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = originalBg;
            button.style.boxShadow = originalShadow;
        }, 3000);
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Удаляем старое уведомление если есть
    const oldNotification = document.querySelector('.custom-notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    
    // Цвета в зависимости от типа
    let bgColor, textColor;
    switch(type) {
        case 'success':
            bgColor = 'linear-gradient(90deg, #00cc00, #009900)';
            textColor = '#ffffff';
            break;
        case 'error':
            bgColor = 'linear-gradient(90deg, #ff3333, #cc0000)';
            textColor = '#ffffff';
            break;
        default:
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
            animation: notificationSlideIn 0.3s ease forwards;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Автоскрытие через 4 секунды
    setTimeout(() => {
        notification.querySelector('div').style.animation = 'notificationSlideOut 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// =========== 3. ПЛАВНАЯ ПРОКРУТКА ===========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем якоря без ID
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
    // Функция для анимации при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.content-block, .step, .faq-item');
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
    
    // Устанавливаем начальное состояние
    const animatedElements = document.querySelectorAll('.content-block, .step, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.visibility = 'hidden';
    });
    
    // Запускаем анимацию
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Добавляем стили для анимаций
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
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
}

// =========== 5. ФИКСИРОВАННЫЙ ХЕДЕР ===========
function initFixedHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Эффект при скролле вниз/вверх
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        }
        
        // Скрытие/показ хедера при скролле
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Скролл вниз - скрываем хедер
            header.style.transform = 'translateY(-100%)';
        } else {
            // Скролл вверх - показываем хедер
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// =========== 6. ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ===========
// Инициализация всех интерактивных элементов
function initAllInteractiveElements() {
    // Добавляем обработчики для всех интерактивных элементов
    document.querySelectorAll('.neon-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Анимация для шагов
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 243, 255, 0.3)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initAllInteractiveElements();
});

// Экспорт функций для глобального доступа (если нужно)
window.CasinoScripts = {
    copyPromoCode: function(promoCode) {
        if (promoCode) {
            copyTextToClipboard(promoCode);
        } else {
            const defaultPromo = document.querySelector('.promo-code-display')?.textContent || 'ICE2024WIN';
            copyTextToClipboard(defaultPromo);
        }
    },
    showNotification: showNotification,
    initMobileMenu: initMobileMenu
};
