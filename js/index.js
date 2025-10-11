// Product Data
const products = [
    {
        id: 1,
        name: 'Fresh Strawberries',
        category: 'fruits',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80',
        description: 'Sweet, juicy organic strawberries'
    },
    {
        id: 2,
        name: 'Organic Bananas',
        category: 'fruits',
        price: 2.49,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
        description: 'Ripe organic bananas, perfect for snacking'
    },
    {
        id: 3,
        name: 'Red Apples',
        category: 'fruits',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',
        description: 'Crisp and sweet red apples'
    },
    {
        id: 4,
        name: 'Fresh Oranges',
        category: 'fruits',
        price: 3.49,
        image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80',
        description: 'Juicy oranges packed with vitamin C'
    },
    {
        id: 5,
        name: 'Organic Tomatoes',
        category: 'vegetables',
        price: 3.29,
        image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80',
        description: 'Vine-ripened organic tomatoes'
    },
    {
        id: 6,
        name: 'Fresh Carrots',
        category: 'vegetables',
        price: 2.19,
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
        description: 'Crunchy organic carrots, farm fresh'
    },
    {
        id: 7,
        name: 'Green Broccoli',
        category: 'vegetables',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80',
        description: 'Fresh organic broccoli crowns'
    },
    {
        id: 8,
        name: 'Bell Peppers',
        category: 'vegetables',
        price: 4.49,
        image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
        description: 'Colorful mix of fresh bell peppers'
    },
    {
        id: 9,
        name: 'Organic Oats',
        category: 'cereals',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=400&q=80',
        description: 'Whole grain organic rolled oats'
    },
    {
        id: 10,
        name: 'Brown Rice',
        category: 'cereals',
        price: 6.49,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
        description: 'Premium organic brown rice'
    },
    {
        id: 11,
        name: 'Quinoa',
        category: 'cereals',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80',
        description: 'Protein-rich organic quinoa'
    },
    {
        id: 12,
        name: 'Whole Wheat',
        category: 'cereals',
        price: 4.99,
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
                const category = this.getAttribute('data-filter');
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
                    <span class="product-price">$${product.price.toFixed(2)}</span>
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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const sendButton = document.getElementById('sendButton');
    const successMessage = document.getElementById('successMessage');

    if (!form) return;

    const inputs = form.querySelectorAll('.form-input[required]');

    // Disable send button initially
    sendButton.disabled = true;

    // Listen for input changes
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateField(input);
            toggleSendButton();
        });
        input.addEventListener('blur', () => {
            validateField(input);
            toggleSendButton();
        });
    });

    // Toggle send button
    function toggleSendButton() {
        const valid = validateForm();
        showformsubmittedNotification();
        sendButton.disabled = !valid;
        
    }

    function showformsubmittedNotification() {
    const notification = document.getElementById('successMessage');
    if (!notification) return;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

    // Validate full form
    function validateForm() {
        let valid = true;
        inputs.forEach(input => {
            if (!validateField(input)) valid = false;
        });
        return valid;
    }

    // Validate each field
    function validateField(field) {
        const errorSpan = field.parentElement.querySelector('.form-error');
        let message = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            message = 'This field is required.';
        } else if (field.type === 'email' && !validateEmail(field.value)) {
            message = 'Please enter a valid email address.';
        } else if (field.tagName === 'SELECT' && field.value === '') {
            message = 'Please select a subject.';
        }

        if (message) {
            errorSpan.textContent = message;
            field.classList.add('invalid');
            return false;
        } else {
            errorSpan.textContent = '';
            field.classList.remove('invalid');
            return true;
        }
    }

    // Email validation regex
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Handle form submission
    form.addEventListener('submit', e => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show success message
        successMessage.classList.add('show');

        // Clear fields
        form.reset();
        sendButton.disabled = true;

        // Hide success message after 3 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    });
});
