document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const menuOverlay = document.getElementById('mobileMenuOverlay');
  const menuClose = document.getElementById('mobileMenuClose');
  const accordions = document.querySelectorAll('.mobile-menu-accordion');
  
  if (!menuToggle || !menuOverlay || !menuClose) return;
  menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  menuClose.addEventListener('click', function() {
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  menuOverlay.addEventListener('click', function(e) {
    if (e.target === menuOverlay) {
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  accordions.forEach(accordion => {
    const toggle = accordion.querySelector('.accordion-toggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        accordions.forEach(other => {
          if (other !== accordion) {
            other.classList.remove('active');
          }
        });
        
        accordion.classList.toggle('active');
      });
    }
  });
  
  function checkScreenSize() {
    if (window.innerWidth > 768) {
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  window.addEventListener('resize', checkScreenSize);
});