document.addEventListener('DOMContentLoaded', function() {
  const sliderSections = document.querySelectorAll('.collections-slider-section');
  
  sliderSections.forEach((section) => {
    const sectionId = section.dataset.sectionId;
    const slider = document.getElementById(`slider-${sectionId}`);
    const pagination = document.getElementById(`pagination-${sectionId}`);
    const container = slider ? slider.parentElement : null;
    
    if (!slider || !pagination || !container) return;
    
    const slides = Array.from(slider.children);
    if (slides.length <= 1) {
      pagination.style.display = 'none';
      return;
    }
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let scrollTimeout = null;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    
    initSlider();
    
    function initSlider() {
      setupEventListeners();
      updateCurrentIndexFromScroll();
    }
    
    function setupEventListeners() {
      if (isMobile) {
        container.addEventListener('scroll', handleScroll);
      }
      
      const dots = pagination.querySelectorAll('.pagination-dot');
      dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          goToSlide(index);
        });
      });
      
      window.addEventListener('resize', handleResize);
    }
    
    function handleScroll() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateCurrentIndexFromScroll();
      }, 100);
    }
    
    function updateCurrentIndexFromScroll() {
      if (!isMobile) return;
      
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      
      let mostVisibleIndex = 0;
      let maxVisibility = 0;
      
      slides.forEach((slide, index) => {
        const slideLeft = slide.offsetLeft;
        const slideWidth = slide.offsetWidth;
        const slideCenter = slideLeft + slideWidth / 2;
        const containerCenter = scrollLeft + containerWidth / 2;
        const distance = Math.abs(slideCenter - containerCenter);
        const visibility = 1 - (distance / containerWidth);
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleIndex = index;
        }
      });
      
      if (mostVisibleIndex !== currentIndex) {
        currentIndex = mostVisibleIndex;
        updateActiveDot();
      }
    }
    
    function goToSlide(index) {
      if (index < 0 || index >= totalSlides || index === currentIndex) return;
      
      currentIndex = index;
      
      if (isMobile) {
        const slide = slides[index];
        const slideLeft = slide.offsetLeft;
        const slideWidth = slide.offsetWidth;
        const containerWidth = container.offsetWidth;
        
        const scrollPosition = slideLeft - (containerWidth - slideWidth) / 2;
        
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
      
      updateActiveDot();
    }
    
    function updateActiveDot() {
      const dots = pagination.querySelectorAll('.pagination-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
    
    function handleResize() {
      updateCurrentIndexFromScroll();
    }
  });
});