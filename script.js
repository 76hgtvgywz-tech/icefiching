// Копирование промокода
function copyPromoCode() {
    const promoCode = document.getElementById('promoCode').innerText;
    const tempInput = document.createElement('input');
    tempInput.value = promoCode;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Показать уведомление
    const button = document.querySelector('.copy-button');
    const originalText = button.innerText;
    button.innerText = 'Промокод скопирован!';
    button.style.background = 'linear-gradient(90deg, #00ff00, #00cc00)';
    
    setTimeout(() => {
        button.innerText = originalText;
        button.style.background = 'linear-gradient(90deg, #ff00ff, #ff0088)';
    }, 2000);
}

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-links');
    nav.classList.toggle('active');
}

// Анимация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.content-block, .step');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Плавное появление элементов
    const style = document.createElement('style');
    style.textContent = `
        .content-block, .step {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    `;
    document.head.appendChild(style);
});