// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Закрытие меню при клике вне его
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Копирование промокода
function copyPromoCode() {
    const promoCode = document.getElementById('promoCode').innerText;
    
    // Создаем временный элемент input
    const tempInput = document.createElement('input');
    tempInput.value = promoCode;
    document.body.appendChild(tempInput);
    
    // Выделяем и копируем текст
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    
    // Удаляем временный элемент
    document.body.removeChild(tempInput);
    
    // Показываем уведомление
    const button = document.querySelector('.copy-button');
    if (button) {
        const originalText = button.innerText;
        button.innerText = 'Промокод скопирован! ✓';
        button.style.background = 'linear-gradient(90deg, #00ff00, #00cc00)';
        button.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
        
        setTimeout(() => {
            button.innerText = originalText;
            button.style.background = 'linear-gradient(90deg, #ff00ff, #ff0088)';
            button.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.5)';
        }, 2000);
    }
}

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Учитываем высоту шапки
                behavior: 'smooth'
            });
        }
    });
});

// Анимация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления элементов
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.content-block, .step');
        
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Установка начального состояния
    const elements = document.querySelectorAll('.content-block, .step');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Запуск анимации
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Инициализация анимации через небольшую задержку
    setTimeout(animateOnScroll, 100);
});

// Фиксированная шапка при скролле
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.background = 'rgba(10, 25, 47, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.background = 'rgba(10, 25, 47, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    }
    
    lastScrollTop = scrollTop;
});
