document.addEventListener('DOMContentLoaded', function() {
  function initColorSwatches() {
    const swatches = document.querySelectorAll('.swatch');
    
    swatches.forEach(swatch => {
      swatch.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const color = this.getAttribute('data-color');
        const imageUrl = this.getAttribute('data-image');
        
        const primaryImage = productCard.querySelector('.primary-image');
        if (primaryImage && imageUrl) {
          primaryImage.src = imageUrl;
          primaryImage.setAttribute('data-color', color);
        }
        
        const allSwatches = productCard.querySelectorAll('.swatch');
        allSwatches.forEach(s => s.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  
  initColorSwatches();
});