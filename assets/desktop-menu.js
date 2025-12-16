document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const desktopMenuOverlay = document.getElementById('desktopMenuOverlay');
  const desktopMenuClose = document.getElementById('desktopMenuClose');
  const megamenuContent = document.getElementById('desktopMegamenuContent');
  
  function isDesktop() {
    return window.innerWidth >= 768;
  }
  
  function openDesktopMegamenu() {
    if (!isDesktop()) return;
    
    desktopMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadCollectionsWithUniqueContent();
  }
  
  function closeDesktopMegamenu() {
    desktopMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (isDesktop()) {
        openDesktopMegamenu();
      }
    });
  }
  
  if (desktopMenuClose) {
    desktopMenuClose.addEventListener('click', closeDesktopMegamenu);
  }
  
  if (desktopMenuOverlay) {
    desktopMenuOverlay.addEventListener('click', function(e) {
      if (e.target === desktopMenuOverlay) {
        closeDesktopMegamenu();
      }
    });
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && desktopMenuOverlay.classList.contains('active')) {
      closeDesktopMegamenu();
    }
  });
  
  async function loadCollectionsWithUniqueContent() {
    if (!megamenuContent) return;
    
    megamenuContent.innerHTML = `
      <div class="collections-loading">
        <div class="loading-spinner"></div>
        <p>Loading collections...</p>
      </div>
    `;
    
    try {
      const response = await fetch('/collections.json');
      const data = await response.json();
      
      if (!data.collections || data.collections.length === 0) {
        showNoCollectionsMessage();
        return;
      }
      const collections = data.collections.slice(0, 6);
      const collectionsWithContent = await Promise.all(
        collections.map(async (collection, index) => {
          return await getUniqueCollectionContent(collection, index);
        })
      );
      
      renderUniqueCollections(collectionsWithContent);
      
    } catch (error) {
      console.error('Error loading collections:', error);
      showNoCollectionsMessage();
    }
  }
  
  async function getUniqueCollectionContent(collection, index) {
    try {
      const productsResponse = await fetch(`/collections/${collection.handle}/products.json?limit=5`);
      const productsData = await productsResponse.json();
      const uniqueOptions = generateUniqueOptions(collection, productsData.products, index);
      
      return {
        ...collection,
        uniqueOptions: uniqueOptions,
        products: productsData.products || []
      };
      
    } catch (error) {
      console.error(`Error loading content for ${collection.title}:`, error);
      return {
        ...collection,
        uniqueOptions: [
          { text: "View all products", url: `/collections/${collection.handle}` },
          { text: "Explore collection", url: `/collections/${collection.handle}` },
          { text: "Shop now", url: `/collections/${collection.handle}` }
        ],
        products: []
      };
    }
  }
  
  function generateUniqueOptions(collection, products, index) {
    const options = [];
    options.push({
      text: `View all ${collection.title.toLowerCase()}`,
      url: `/collections/${collection.handle}`
    });
    
    if (products && products.length > 0) {
      const productTypes = [...new Set(products.map(p => p.product_type).filter(Boolean))];
      const vendors = [...new Set(products.map(p => p.vendor).filter(Boolean))];
      const tags = products.flatMap(p => p.tags || []).filter(Boolean);
      
      if (products.length >= 2) {
        options.push({
          text: `Top: ${products[0].title.substring(0, 20)}...`,
          url: `/products/${products[0].handle}`
        });
      }
      
      if (productTypes.length > 0) {
        const mainType = productTypes[0];
        options.push({
          text: `${mainType} collection`,
          url: `/collections/${collection.handle}?filter.p.product_type=${encodeURIComponent(mainType)}`
        });
      }
      
      const popularTags = getPopularTags(tags);
      if (popularTags.length > 0) {
        options.push({
          text: `#${popularTags[0]}`,
          url: `/collections/${collection.handle}/${popularTags[0]}`
        });
      }
      
      options.push({
        text: "New arrivals",
        url: `/collections/${collection.handle}?sort_by=created-descending`
      });
      
      options.push({
        text: "Best value",
        url: `/collections/${collection.handle}?sort_by=price-ascending`
      });
      
    } else {
      const generalOptions = [
        { text: "Explore selection", url: `/collections/${collection.handle}` },
        { text: "Coming soon", url: `/collections/${collection.handle}` },
        { text: "Special offers", url: `/collections/${collection.handle}` }
      ];
      
      options.push(...generalOptions.slice(0, 3));
    }
    
    return options.slice(0, 5);
  }
  
  function getPopularTags(tags) {
    const tagCounts = {};
    tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 3);
  }
  
  function renderUniqueCollections(collections) {
    if (!megamenuContent || collections.length === 0) {
      showNoCollectionsMessage();
      return;
    }
    
    let html = '';
    
    for (let i = 0; i < collections.length; i += 4) {
      const group = collections.slice(i, i + 4);
      
      group.forEach(collection => {
        html += `
          <div class="megamenu-col" data-collection="${collection.handle}">
            <h3 class="megamenu-col-title">${collection.title}</h3>
            <ul class="megamenu-subcollections">
        `;
        collection.uniqueOptions.forEach(option => {
          html += `
            <li class="megamenu-subcollection-item">
              <a href="${option.url}" class="megamenu-subcollection-link">
                ${option.text}
              </a>
            </li>
          `;
        });
        
        html += `
            </ul>
          </div>
        `;
      });
      
      html += '</div>';
    }
    
    megamenuContent.innerHTML = html;
  }
  
  function showNoCollectionsMessage() {
    megamenuContent.innerHTML = `
      <div class="no-collections-message">
        <p>No collections found</p>
        <p>Please add collections in your Shopify admin</p>
      </div>
    `;
  }
  
  window.addEventListener('resize', function() {
    if (!isDesktop() && desktopMenuOverlay.classList.contains('active')) {
      closeDesktopMegamenu();
    }
  });
});