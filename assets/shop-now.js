document.addEventListener('DOMContentLoaded', function() {
  const iconContainers = document.querySelectorAll('.icon-container');
  
  iconContainers.forEach(icon => {
    icon.addEventListener('click', function(e) {
      if (window.innerWidth > 768) { 
        e.preventDefault();
        const productCard = this.closest('.image-container');
        const shopNowBtn = productCard.querySelector('.shop-now-button');
        
        shopNowBtn.classList.toggle('show');
      }
    });
  });
  
  const mobileIcons = document.querySelectorAll('.icon-container');
  mobileIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        const productUrl = this.closest('.image-container').querySelector('a').href;
        window.location.href = productUrl;
      }
    });
  });
});