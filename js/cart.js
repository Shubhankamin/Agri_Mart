document.addEventListener('DOMContentLoaded', function() {
    // Cart data - Changed to support real images instead of SVG
    const cartItems = [
        {
            id: 1,
            title: "Fresh organic tomatoes",
            description: "Fresh, pesticide-free tomatoes grown locally.",
            price: 15.50,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=400&fit=crop"
        },
        {
            id: 2,
            title: "Farm Fresh Eggs",
            description: "Free-range eggs from happy, healthy chickens.",
            price: 6.50,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1582722872445-44dc1f3e3b9f?w=400&h=400&fit=crop"
        },
        {
            id: 3,
            title: "Organic Avocados",
            description: "Creamy, nutrient-rich avocados.",
            price: 12.00,
            quantity: 3,
            image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop"
        },
        {
            id: 4,
            title: "Artisan Bread",
            description: "Freshly baked sourdough bread.",
            price: 5.50,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop"
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
    const checkoutBtn = document.getElementById('checkout-btn');
    const orderSummary = document.querySelector('.order-summary');
    const cartStatus = document.getElementById('cart-status');
    
    // Variables
    let itemToRemove = null;
    let focusedElementBeforeModal = null;
    
    // Initialize cart
    loadCartFromStorage();
    renderCartItems();
    updateCartSummary();
    
    // Keyboard navigation - Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && confirmationModal.style.display === 'flex') {
            hideConfirmationModal();
        }
    });
    
    // Close modal on backdrop click
    confirmationModal.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            hideConfirmationModal();
        }
    });
    
    // Load cart from localStorage
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('agrimart_cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                // Merge saved cart with default items (for demo purposes)
                // In production, you'd replace cartItems entirely
                cartItems.length = 0;
                cartItems.push(...parsedCart);
            } catch (e) {
                console.error('Error loading cart from storage:', e);
            }
        }
    }
    
    // Save cart to localStorage
    function saveCartToStorage() {
        try {
            localStorage.setItem('agrimart_cart', JSON.stringify(cartItems));
        } catch (e) {
            console.error('Error saving cart to storage:', e);
        }
    }
    
    // Render cart items
    function renderCartItems() {
        if (cartItems.length === 0) {
            cartItemsContainer.style.display = 'none';
            orderSummary.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        }
        
        cartItemsContainer.style.display = 'block';
        orderSummary.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        
        cartItemsContainer.innerHTML = `
            <div class="cart-items-header">
                <h2>Cart Items</h2>
            </div>
        `;
        
        cartItems.forEach(item => {
            const itemElement = document.createElement('article');
            itemElement.className = 'cart-item';
            itemElement.dataset.id = item.id;
            itemElement.setAttribute('aria-label', `${item.title}, quantity ${item.quantity}, price ₹${item.price.toFixed(2)}`);
            
            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
                </div>
                <div class="item-details">
                    <h3 class="item-title">${escapeHtml(item.title)}</h3>
                    <p class="item-description">${escapeHtml(item.description)}</p>
                    <div class="item-price" aria-label="Price ₹${item.price.toFixed(2)}">₹${item.price.toFixed(2)}</div>
                    <div class="item-controls">
                        <div class="quantity-controls" role="group" aria-label="Quantity controls for ${escapeHtml(item.title)}">
                            <button class="quantity-btn minus" 
                                    aria-label="Decrease quantity" 
                                    data-id="${item.id}"
                                    ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                            <input type="number" 
                                   class="quantity-input" 
                                   value="${item.quantity}" 
                                   min="1" 
                                   max="99"
                                   aria-label="Quantity"
                                   data-id="${item.id}">
                            <button class="quantity-btn plus" 
                                    aria-label="Increase quantity" 
                                    data-id="${item.id}"
                                    ${item.quantity >= 99 ? 'disabled' : ''}>+</button>
                        </div>
                    </div>
                </div>
                <button class="remove-btn" 
                        data-id="${item.id}" 
                        aria-label="Remove ${escapeHtml(item.title)} from cart">
                    <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
                    </svg>
                </button>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners using event delegation
        addEventListeners();
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
    
    // Add event listeners with event delegation
    function addEventListeners() {
        // Event delegation for all cart item interactions
        cartItemsContainer.addEventListener('click', handleCartInteraction);
        cartItemsContainer.addEventListener('change', handleQuantityChange);
        cartItemsContainer.addEventListener('keydown', handleKeyboardNavigation);
    }
    
    // Handle all cart interactions
    function handleCartInteraction(e) {
        const plusBtn = e.target.closest('.plus');
        const minusBtn = e.target.closest('.minus');
        const removeBtn = e.target.closest('.remove-btn');
        
        if (plusBtn) {
            const itemId = parseInt(plusBtn.dataset.id);
            updateQuantity(itemId, 1);
        } else if (minusBtn) {
            const itemId = parseInt(minusBtn.dataset.id);
            updateQuantity(itemId, -1);
        } else if (removeBtn) {
            itemToRemove = parseInt(removeBtn.dataset.id);
            showConfirmationModal();
        }
    }
    
    // Handle direct quantity input change
    function handleQuantityChange(e) {
        if (e.target.classList.contains('quantity-input')) {
            const itemId = parseInt(e.target.dataset.id);
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity >= 1 && newQuantity <= 99) {
                const item = cartItems.find(item => item.id === itemId);
                if (item) {
                    item.quantity = newQuantity;
                    saveCartToStorage();
                    renderCartItems();
                    updateCartSummary();
                    announceToScreenReader(`Quantity updated to ${newQuantity}`);
                }
            } else {
                // Reset to current value if invalid
                renderCartItems();
            }
        }
    }
    
    // Handle keyboard navigation
    function handleKeyboardNavigation(e) {
        // Allow Enter key on buttons
        if (e.key === 'Enter') {
            const button = e.target.closest('button');
            if (button) {
                button.click();
            }
        }
    }
    
    // Update quantity
    function updateQuantity(itemId, change) {
        const item = cartItems.find(item => item.id === itemId);
        if (!item) return;
        
        const newQuantity = item.quantity + change;
        
        if (newQuantity >= 1 && newQuantity <= 99) {
            item.quantity = newQuantity;
            saveCartToStorage();
            renderCartItems();
            updateCartSummary();
            
            const action = change > 0 ? 'increased' : 'decreased';
            announceToScreenReader(`Quantity ${action} to ${newQuantity}`);
        }
    }
    
    // Confirmation Modal Functions with focus management
    function showConfirmationModal() {
        focusedElementBeforeModal = document.activeElement;
        confirmationModal.style.display = 'flex';
        
        // Focus the confirm button
        setTimeout(() => {
            confirmRemoveBtn.focus();
        }, 100);
        
        // Trap focus within modal
        trapFocus(confirmationModal);
    }
    
    function hideConfirmationModal() {
        confirmationModal.style.display = 'none';
        itemToRemove = null;
        
        // Restore focus
        if (focusedElementBeforeModal) {
            focusedElementBeforeModal.focus();
        }
    }
    
    // Focus trap for modal
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }
    
    confirmRemoveBtn.addEventListener('click', function() {
        if (itemToRemove) {
            const itemIndex = cartItems.findIndex(item => item.id === itemToRemove);
            if (itemIndex !== -1) {
                const itemName = cartItems[itemIndex].title;
                cartItems.splice(itemIndex, 1);
                saveCartToStorage();
                renderCartItems();
                updateCartSummary();
                announceToScreenReader(`${itemName} removed from cart`);
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
        
        const itemText = itemCount === 1 ? 'item' : 'items';
        itemsCount.textContent = `${itemCount} ${itemText} in your cart`;
        
        // Update cart count aria-label
        cartCount.setAttribute('aria-label', `${itemCount} ${itemText} in cart`);
    }
    
    // Announce to screen readers
    function announceToScreenReader(message) {
        if (cartStatus) {
            cartStatus.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                cartStatus.textContent = '';
            }, 1000);
        }
    }
    
    // Checkout button - Save cart to localStorage for checkout page
    checkoutBtn.addEventListener('click', function(e) {
        if (cartItems.length === 0) {
            e.preventDefault();
            announceToScreenReader('Your cart is empty. Please add items before checkout.');
            alert('Your cart is empty. Please add items before proceeding to checkout.');
            return;
        }
        
        // Save cart data to localStorage for checkout page
        try {
            localStorage.setItem('agrimart_cart', JSON.stringify(cartItems));
            
            // Calculate and save order summary
            let subtotal = 0;
            cartItems.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            
            const orderSummary = {
                subtotal: subtotal,
                tax: subtotal * 0.05,
                total: subtotal + (subtotal * 0.05),
                itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
            };
            
            localStorage.setItem('agrimart_order_summary', JSON.stringify(orderSummary));
            
            announceToScreenReader('Proceeding to checkout');
        } catch (e) {
            console.error('Error saving cart data:', e);
            alert('There was an error. Please try again.');
            e.preventDefault();
        }
    });
});