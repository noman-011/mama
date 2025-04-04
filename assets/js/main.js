// DOM Elements
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileNav = document.querySelector('.mobile-nav');
const cartCountElements = document.querySelectorAll('#cart-count, #mobile-cart-count');
const whatsappFloat = document.querySelector('.whatsapp-float');

// Initialize cart count
updateCartCount();

// Toggle mobile menu
if (hamburgerMenu && mobileNav) {
  hamburgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('show');
  });
}

// Update cart count
async function updateCartCount() {
  try {
    const response = await fetch('/api/cart-count', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      cartCountElements.forEach(el => {
        el.textContent = data.count;
      });
    }
  } catch (error) {
    console.error('Error updating cart count:', error);
  }
}

// Handle product options form submission
const productOptionsForm = document.getElementById('product-options-form');
if (productOptionsForm) {
  productOptionsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(productOptionsForm);
    const options = {
      productId: parseInt(productData.id),
      size: formData.get('size'),
      color: formData.get('color'),
      material: formData.get('material'),
      quantity: parseInt(formData.get('quantity')) || 1
    };
    
    try {
      const response = await fetch('/api/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options),
        credentials: 'include'
      });
      
      if (response.ok) {
        alert('Item added to cart!');
        updateCartCount();
      } else {
        alert('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding to cart');
    }
  });
}

// Handle cart item removal
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('remove-item')) {
    const productId = parseInt(e.target.dataset.id);
    const size = e.target.dataset.size;
    const color = e.target.dataset.color;
    
    try {
      const response = await fetch('/api/remove-from-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, size, color }),
        credentials: 'include'
      });
      
      if (response.ok) {
        // Refresh cart display
        window.location.reload();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }
});

// Handle thumbnail clicks
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('thumbnail')) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
      mainImage.src = e.target.dataset.fullImage;
      
      // Update active thumbnail
      document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
      });
      e.target.classList.add('active');
    }
  }
});

// Initialize product thumbnails
function initThumbnails() {
  const thumbnailContainer = document.querySelector('.thumbnail-images');
  const mainImage = document.getElementById('main-product-image');
  
  if (thumbnailContainer && mainImage && productData) {
    productData.images.forEach((image, index) => {
      const img = document.createElement('img');
      img.src = `/assets/images/${image}`;
      img.dataset.fullImage = `/assets/images/${image}`;
      img.alt = `Thumbnail ${index + 1}`;
      img.classList.add('thumbnail');
      if (index === 0) img.classList.add('active');
      
      thumbnailContainer.appendChild(img);
    });
  }
}

// Initialize related products
function initRelatedProducts() {
  const relatedContainer = document.querySelector('.related-products .products-grid');
  
  if (relatedContainer && productData) {
    // Filter out current product and get 3 random related products
    const related = PRODUCTS
      .filter(p => p.id !== productData.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    related.forEach(product => {
      const productHTML = `
        <div class="product-card">
          <img src="/assets/images/${product.images[0]}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p class="price">$${product.price.toFixed(2)}</p>
          <a href="/product/${product.id}" class="btn">View Details</a>
        </div>
      `;
      
      relatedContainer.innerHTML += productHTML;
    });
  }
}

// Initialize reviews
function initReviews() {
  const reviewsContainer = document.querySelector('.reviews-list');
  
  if (reviewsContainer) {
    // Mock reviews - in a real app, these would come from an API
    const reviews = [
      {
        id: 1,
        author: 'John D.',
        rating: 5,
        comment: 'Great quality shirt! The print looks amazing and the fabric is very comfortable.',
        date: '2023-05-15'
      },
      {
        id: 2,
        author: 'Sarah M.',
        rating: 4,
        comment: 'Love the design, fits perfectly. Would definitely order again!',
        date: '2023-04-28'
      }
    ];
    
    reviews.forEach(review => {
      const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
      
      const reviewHTML = `
        <div class="review">
          <div class="review-header">
            <span class="review-author">${review.author}</span>
            <span class="review-rating">${stars}</span>
            <span class="review-date">${review.date}</span>
          </div>
          <div class="review-comment">${review.comment}</div>
        </div>
      `;
      
      reviewsContainer.innerHTML += reviewHTML;
    });
  }
}

// Initialize product page components
if (document.querySelector('.product-detail')) {
  initThumbnails();
  initRelatedProducts();
  initReviews();
}

// Admin login form
const adminLoginForm = document.getElementById('admin-login-form');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(adminLoginForm);
    const credentials = {
      username: formData.get('username'),
      password: formData.get('password')
    };
    
    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (data.success) {
        window.location.href = '/admin-panel';
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  });
}