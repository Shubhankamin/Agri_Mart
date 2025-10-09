document.addEventListener('DOMContentLoaded', function() {
    // Cart data
    const cartItems = [
        {
            id: 1,
            title: "Fresh organic tomatoes",
            description: "Fresh, pesticide-free tomatoes grown locally.",
            price: 15.50,
            quantity: 2,
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23D1FAE5'/%3E%3Ccircle cx='50' cy='50' r='35' fill='%23EF4444'/%3E%3C/svg%3E"
        },
        {
            id: 2,
            title: "Farm Fresh Eggs",
            description: "Free-range eggs from happy, healthy chickens.",
            price: 6.50,
            quantity: 1,
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23D1FAE5'/%3E%3Cellipse cx='50' cy='50' rx='25' ry='30' fill='%23FEF7ED'/%3E%3C/svg%3E"
        },
        {
            id: 3,
            title: "Organic Avocados",
            description: "Creamy, nutrient-rich avocados.",
            price: 12.00,
            quantity: 3,
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23D1FAE5'/%3E%3Cellipse cx='50' cy='50' rx='30' ry='20' fill='%23047857'/%3E%3C/svg%3E"
        },
        {
            id: 4,
            title: "Artisan Bread",
            description: "Freshly baked sourdough bread.",
            price: 5.50,
            quantity: 1,
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23D1FAE5'/%3E%3Crect x='25' y='35' width='50' height='30' rx='5' fill='%23F59E0B'/%3E%3C/svg%3E"
        }
    ];

    // DOM Elements
    const cartItemsContainer = document.getElementById('cart-items-section');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartCount = document.getElementById('cart-count');
    const itemsCount = document.getElementById('items-count');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmRemoveBtn = document.getElementById('confirm-remove');
    const cancelRemoveBtn = document.getElementById('cancel-remove');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const orderSummary = document.querySelector('.order-summary');
    
    // Variables
    let itemToRemove = null;
    
    // Initialize cart
    renderCartItems();
    updateCartSummary();
    
    // Render cart items
    function renderCartItems() {
        if (cartItems.length === 0) {
            cartItemsContainer.style.display = 'none';
            orderSummary.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        }
        
        cartItemsContainer.innerHTML = `
            <div class="cart-items-header">
                <h2>Cart Items</h2>
            </div>
        `;
        
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.dataset.id = item.id;
            
            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="item-details">
                    <h3 class="item-title">${item.title}</h3>
                    <p class="item-description">${item.description}</p>
                    <div class="item-price">₹${item.price.toFixed(2)}</div>
                    <div class="item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus">-</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                </div>
                <button class="remove-btn" data-id="${item.id}" title="Remove item">
                    <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
                    </svg>
                </button>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners to dynamically created elements
        addEventListeners();
    }
    
    // Add event listeners
    function addEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemElement = this.closest('.cart-item');
                const itemId = parseInt(itemElement.dataset.id);
                const quantityInput = itemElement.querySelector('.quantity-input');
                const item = cartItems.find(item => item.id === itemId);
                
                if (this.classList.contains('plus')) {
                    item.quantity++;
                } else if (this.classList.contains('minus') && item.quantity > 1) {
                    item.quantity--;
                }
                
                quantityInput.value = item.quantity;
                updateCartSummary();
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function() {
                itemToRemove = parseInt(this.dataset.id);
                showConfirmationModal();
            });
        });
        
        // Checkout button (redirect only)
        checkoutBtn.addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }
    
    // Confirmation Modal Functions
    function showConfirmationModal() {
        confirmationModal.style.display = 'flex';
    }
    
    function hideConfirmationModal() {
        confirmationModal.style.display = 'none';
        itemToRemove = null;
    }
    
    confirmRemoveBtn.addEventListener('click', function() {
        if (itemToRemove) {
            const itemIndex = cartItems.findIndex(item => item.id === itemToRemove);
            if (itemIndex !== -1) {
                cartItems.splice(itemIndex, 1);
                renderCartItems();
                updateCartSummary();
            }
        }
        hideConfirmationModal();
    });
    
    cancelRemoveBtn.addEventListener('click', hideConfirmationModal);
    
    // Update cart summary
    function updateCartSummary() {
        let subtotal = 0;
        let itemCount = 0;
        
        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
            itemCount += item.quantity;
        });
        
        const tax = subtotal * 0.05;
        const total = subtotal + tax;
        
        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        taxElement.textContent = `₹${tax.toFixed(2)}`;
        totalElement.textContent = `₹${total.toFixed(2)}`;
        cartCount.textContent = itemCount;
        itemsCount.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`;
    }
});