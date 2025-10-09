// Product Data
const products = [
    {
        id: 1,
        name: 'Fresh Strawberries',
        category: 'fruits',
        price: 489,
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80',
        description: 'Sweet, juicy organic strawberries'
    },
    {
        id: 2,
        name: 'Organic Bananas',
        category: 'fruits',
        price: 219,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
        description: 'Ripe organic bananas, perfect for snacking'
    },
    {
        id: 3,
        name: 'Red Apples',
        category: 'fruits',
        price: 366,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',
        description: 'Crisp and sweet red apples'
    },
    {
        id: 4,
        name: 'Fresh Oranges',
        category: 'fruits',
        price: 349,
        image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80',
        description: 'Juicy oranges packed with vitamin C'
    },
    {
        id: 5,
        name: 'Organic Tomatoes',
        category: 'vegetables',
        price: 159,
        image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80',
        description: 'Vine-ripened organic tomatoes'
    },
    {
        id: 6,
        name: 'Fresh Carrots',
        category: 'vegetables',
        price: 219,
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
        description: 'Crunchy organic carrots, farm fresh'
    },
    {
        id: 7,
        name: 'Green Broccoli',
        category: 'vegetables',
        price: 299,
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80',
        description: 'Fresh organic broccoli crowns'
    },
    {
        id: 8,
        name: 'Bell Peppers',
        category: 'vegetables',
        price: 449,
        image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
        description: 'Colorful mix of fresh bell peppers'
    },
    {
        id: 9,
        name: 'Organic Oats',
        category: 'cereals',
        price: 599,
        image: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=400&q=80',
        description: 'Whole grain organic rolled oats'
    },
    {
        id: 10,
        name: 'Brown Rice',
        category: 'cereals',
        price: 649,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
        description: 'Premium organic brown rice'
    },
    {
        id: 11,
        name: 'Quinoa',
        category: 'cereals',
        price: 799,
        image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80',
        description: 'Protein-rich organic quinoa'
    },
    {
        id: 12,
        name: 'Whole Wheat',
        category: 'cereals',
        price: 499,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
        description: 'Stone-ground whole wheat flour'
    }
];

// Cart state
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    loadCart();
    
    // Render products
    renderProducts('all');
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup contact form if on contact page
    if (document.getElementById('contactForm')) {
        setupContactForm();
    }
});

// Setup Event Listeners
function setupEventListeners() {
    // Dropdown toggle
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');
    
    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdown.classList.remove('active');
        });
        
        // Handle dropdown item clicks
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                if (document.getElementById('productsGrid')) {
                    renderProducts(category);
                }
            });
        });
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products
            const filter = this.getAttribute('data-filter');
            renderProducts(filter);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
        });
    }
}

// Render Products
function renderProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">₹${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})" aria-label="Add ${product.name} to cart">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Add to Cart
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save to localStorage
    saveCart();
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification();
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show Notification
function showNotification() {
    const notification = document.getElementById('cartNotification');
    if (!notification) return;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('agrimart_cart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('agrimart_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Contact Form Setup
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Show success message
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.classList.add('show');
                
                // Reset form
                form.reset();
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 3000);
            }
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.parentElement.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validate Form
function validateForm() {
    const form = document.getElementById('contactForm');
    if (!form) return false;
    
    let isValid = true;
    const inputs = form.querySelectorAll('.form-input[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate Individual Field
function validateField(field) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.form-error');
    
    // Remove previous error
    formGroup.classList.remove('error');
    errorElement.textContent = '';
    
    // Check if field is empty
    if (field.hasAttribute('required') && !field.value.trim()) {
        formGroup.classList.add('error');
        errorElement.textContent = 'This field is required';
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            formGroup.classList.add('error');
            errorElement.textContent = 'Please enter a valid email address';
            return false;
        }
    }
    
    // Phone validation (optional, but if provided must be valid)
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(field.value)) {
            formGroup.classList.add('error');
            errorElement.textContent = 'Please enter a valid phone number';
            return false;
        }
    }
    
    return true;
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});