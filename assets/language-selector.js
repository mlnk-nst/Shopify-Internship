document.addEventListener('DOMContentLoaded', function() {
  // ===== ІСНУЮЧИЙ КОД ДЛЯ LANGUAGE SELECTOR (НЕ ЧІПАТИ) =====
  const toggle = document.getElementById('language-toggle');
  const dropdown = document.getElementById('language-dropdown');
  
  if (toggle && dropdown) {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });
    
    const options = dropdown.querySelectorAll('.language-option');
    options.forEach(option => {
      option.addEventListener('click', function() {
        const imageUrl = this.getAttribute('data-image');
        const altText = this.getAttribute('aria-label') || 'Language flag';
        
        const currentImage = toggle.querySelector('.language-flag-image');
        
        if (currentImage && imageUrl) {
          currentImage.src = imageUrl;
          currentImage.alt = altText;
        }
        
        dropdown.classList.remove('active');
      });
    });
    
    document.addEventListener('click', function() {
      dropdown.classList.remove('active');
    });
  }
  
  // ===== НОВИЙ КОД ДЛЯ АКОРДЕОНА ФУТЕРА =====
  function initFooterAccordion() {
    // Тільки на мобільних (до 768px)
    if (window.innerWidth <= 768) {
      const footerSections = document.querySelectorAll('.footer-section:not(.logo-section):not(.newsletter-section)');
      
      footerSections.forEach(section => {
        const heading = section.querySelector('h3');
        
        if (heading && !heading.hasAttribute('data-accordion-bound')) {
          heading.setAttribute('data-accordion-bound', 'true');
          
          heading.addEventListener('click', function() {
            // Закриваємо всі інші секції
            footerSections.forEach(otherSection => {
              if (otherSection !== section) {
                otherSection.classList.remove('active');
              }
            });
            
            // Перемикаємо поточну секцію
            section.classList.toggle('active');
          });
        }
      });
    } else {
      // На десктопі закриваємо всі акордеони
      const footerSections = document.querySelectorAll('.footer-section:not(.logo-section):not(.newsletter-section)');
      footerSections.forEach(section => {
        section.classList.remove('active');
        const heading = section.querySelector('h3');
        if (heading) {
          heading.removeAttribute('data-accordion-bound');
        }
      });
    }
  }
  
  // Ініціалізація при завантаженні
  initFooterAccordion();
  
  // Ініціалізація при зміні розміру вікна
  window.addEventListener('resize', function() {
    initFooterAccordion();
  });
});