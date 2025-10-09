document.addEventListener('DOMContentLoaded', function() {
    // Sample saved addresses for delivery
    const savedAddresses = [
        {
            id: 1,
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            address: "45 Green Valley Farms, Near Organic Market, Whitefield",
            city: "Bengaluru",
            state: "KA",
            pincode: "560001",
            landmark: "Near Metro Station",
            type: "home"
        },
        {
            id: 2,
            name: "Rajesh Kumar",
            phone: "+91 98765 43211",
            address: "12 Farm Fresh Road, Agricultural Zone, Hadapsar",
            city: "Pune",
            state: "MH",
            pincode: "411001",
            landmark: "Opposite Mall",
            type: "work"
        }
    ];

    // Separate array for billing addresses
    let billingAddresses = [];

    // Sample cart items
    const cartItems = [
        {
            id: 1,
            name: "Fresh Organic Tomatoes",
            seller: "Green Valley Farms",
            quantity: "2kg",
            price: 180,
            image: "https://via.placeholder.com/60x60/10B981/FFFFFF?text=TM"
        },
        {
            id: 2,
            name: "Farm Fresh Eggs",
            seller: "Happy Hens Farm",
            quantity: "1 dozen",
            price: 120,
            image: "https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=EG"
        },
        {
            id: 3,
            name: "Organic Avocados",
            seller: "Tropical Orchards",
            quantity: "4 pieces",
            price: 240,
            image: "https://via.placeholder.com/60x60/047857/FFFFFF?text=AV"
        }
    ];

    // DOM Elements
    const savedAddressesContainer = document.getElementById('saved-addresses');
    const billingSavedAddressesContainer = document.getElementById('billing-saved-addresses');
    const billingAddressSelection = document.getElementById('billing-address-selection');
    const addAddressBtn = document.getElementById('add-address-btn');
    const addBillingAddressBtn = document.getElementById('add-billing-address-btn');
    const editAddressModal = document.getElementById('edit-address-modal');
    const billingAddressModal = document.getElementById('billing-address-modal');
    const closeEditModal = document.getElementById('close-edit-modal');
    const closeBillingModal = document.getElementById('close-billing-modal');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const cancelBillingBtn = document.getElementById('cancel-billing-btn');
    const editAddressForm = document.getElementById('edit-address-form');
    const billingAddressForm = document.getElementById('billing-address-form');
    const editModalTitle = document.getElementById('edit-modal-title');
    const billingModalTitle = document.getElementById('billing-modal-title');
    const editModalSubmit = document.getElementById('edit-modal-submit');
    const billingModalSubmit = document.getElementById('billing-modal-submit');
    const editAddressBtn = document.getElementById('edit-address-btn');
    const sameAsShippingRadio = document.getElementById('same-as-shipping');
    const differentBillingRadio = document.getElementById('different-billing');
    const payNowBtn = document.getElementById('pay-now-btn');
    const paymentModal = document.getElementById('payment-modal');
    const successModal = document.getElementById('success-modal');
    const viewOrderBtn = document.getElementById('view-order-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const successOrderId = document.getElementById('success-order-id');
    const successOrderDate = document.getElementById('success-order-date');
    const orderModal = document.getElementById('order-modal');
    const closeOrderModal = document.getElementById('close-order-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const printOrderBtn = document.getElementById('print-order-btn');
    const modalOrderId = document.getElementById('modal-order-id');
    const modalOrderDate = document.getElementById('modal-order-date');
    const modalOrderTotal = document.getElementById('modal-order-total');
    const modalOrderItems = document.getElementById('modal-order-items');
    const modalDeliveryAddress = document.getElementById('modal-delivery-address');
    const modalBillingAddress = document.getElementById('modal-billing-address');

    // Variables
    let selectedShippingAddress = null;
    let selectedBillingAddress = null;
    let currentOrder = null;
    let editingAddressId = null;
    let editingBillingAddressId = null;
    let isAddingNewAddress = false;
    let isEditingBillingAddress = false;

    // Initialize page
    renderSavedAddresses();
    renderBillingAddresses();
    setupEventListeners();

    // Render saved addresses for delivery
    function renderSavedAddresses() {
        savedAddressesContainer.innerHTML = '';

        if (savedAddresses.length === 0) {
            savedAddressesContainer.innerHTML = `<div class="no-addresses"><p>No saved addresses found. Please add a new address.</p></div>`;
            return;
        }

        savedAddresses.forEach(address => {
            const addressCard = createAddressCard(address, 'shipping');
            savedAddressesContainer.appendChild(addressCard);
        });

        // Select first shipping address by default
        if (savedAddresses.length > 0 && !selectedShippingAddress) {
            const firstCard = document.querySelector('#saved-addresses .address-card');
            if (firstCard) firstCard.click();
        }
    }

    // Render billing addresses
    function renderBillingAddresses() {
        billingSavedAddressesContainer.innerHTML = '';

        if (billingAddresses.length === 0) {
            billingSavedAddressesContainer.innerHTML = `<div class="no-addresses"><p>No billing addresses found. Please add a new billing address.</p></div>`;
            return;
        }

        billingAddresses.forEach(address => {
            const addressCard = createAddressCard(address, 'billing');
            billingSavedAddressesContainer.appendChild(addressCard);
        });
    }

    function createAddressCard(address, type) {
        const card = document.createElement('div');
        card.className = 'address-card';
        card.dataset.id = address.id;

        const typeLabel = address.type === 'home' ? 'Home' : 'Work';

        card.innerHTML = `
            <div class="address-card-header">
                <div class="address-name">${address.name}</div>
                <div class="address-type-badge">${typeLabel}</div>
            </div>
            <div class="address-details">
                <p>${address.address}</p>
                <p>${address.city}, ${getStateName(address.state)} - ${address.pincode}</p>
                <p>${address.phone}</p>
                ${address.landmark ? `<p>Landmark: ${address.landmark}</p>` : ''}
            </div>
            <div class="address-actions">
                <button class="address-action edit-address" data-id="${address.id}" data-type="${type}">
                    <i class="fas fa-edit"></i> <span>Edit</span>
                </button>
                <button class="address-action delete-address" data-id="${address.id}" data-type="${type}">
                    <i class="fas fa-trash"></i> <span>Delete</span>
                </button>
            </div>
        `;

        card.addEventListener('click', function(e) {
            if (!e.target.closest('.address-actions')) {
                const container = type === 'shipping' ? savedAddressesContainer : billingSavedAddressesContainer;
                container.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));

                this.classList.add('selected');

                if (type === 'shipping') {
                    selectedShippingAddress = address;
                    
                    // If same as shipping is selected, update billing address to match
                    if (sameAsShippingRadio.checked) {
                        selectedBillingAddress = address;
                    }
                } else {
                    selectedBillingAddress = address;
                }
            }
        });

        return card;
    }

    function getStateName(code) {
        const states = { 'KA': 'Karnataka', 'MH': 'Maharashtra', 'TN': 'Tamil Nadu', 'DL': 'Delhi', 'UP': 'Uttar Pradesh' };
        return states[code] || code;
    }

    function setupEventListeners() {
        // Add new address buttons
        addAddressBtn.addEventListener('click', openAddAddressModal);
        addBillingAddressBtn.addEventListener('click', openAddBillingAddressModal);

        // Edit address header button
        editAddressBtn.addEventListener('click', () => { 
            if (selectedShippingAddress) {
                openEditModal(selectedShippingAddress);
            } else {
                showNotification('Please select an address to edit.', 'error');
            }
        });

        // Close modals
        closeEditModal.addEventListener('click', closeEditModalFunc);
        closeBillingModal.addEventListener('click', closeBillingModalFunc);
        cancelEditBtn.addEventListener('click', closeEditModalFunc);
        cancelBillingBtn.addEventListener('click', closeBillingModalFunc);

        // Form submissions
        editAddressForm.addEventListener('submit', handleAddressSubmit);
        billingAddressForm.addEventListener('submit', handleBillingAddressSubmit);

        // Billing address radio buttons
        sameAsShippingRadio.addEventListener('change', function() {
            if (this.checked) {
                billingAddressSelection.style.display = 'none';
                selectedBillingAddress = selectedShippingAddress;
            }
        });

        differentBillingRadio.addEventListener('change', function() {
            if (this.checked) {
                billingAddressSelection.style.display = 'block';
                
                // If no billing addresses exist yet, open the add billing address modal
                if (billingAddresses.length === 0) {
                    openAddBillingAddressModal();
                }
            }
        });

        // Edit/delete address buttons
        document.addEventListener('click', e => {
            if (e.target.closest('.edit-address')) {
                const button = e.target.closest('.edit-address');
                const addressId = button.dataset.id;
                const type = button.dataset.type;
                
                if (type === 'shipping') {
                    const address = savedAddresses.find(a => a.id == addressId);
                    if (address) openEditModal(address);
                } else {
                    const address = billingAddresses.find(a => a.id == addressId);
                    if (address) openEditBillingModal(address);
                }
            }
            
            if (e.target.closest('.delete-address')) {
                const button = e.target.closest('.delete-address');
                const addressId = button.dataset.id;
                const type = button.dataset.type;
                
                if (type === 'shipping') {
                    deleteAddress(addressId);
                } else {
                    deleteBillingAddress(addressId);
                }
            }
        });

        // Pay Now
        payNowBtn.addEventListener('click', processPayment);

        // Success modal buttons
        viewOrderBtn.addEventListener('click', () => { 
            successModal.style.display = 'none'; 
            if (currentOrder) {
                showOrderDetailsModal(currentOrder);
            }
        });
        continueShoppingBtn.addEventListener('click', () => { 
            successModal.style.display = 'none'; 
        });

        // Order modal buttons
        closeOrderModal.addEventListener('click', () => { orderModal.style.display = 'none'; });
        closeModalBtn.addEventListener('click', () => { orderModal.style.display = 'none'; });
        printOrderBtn.addEventListener('click', () => { window.print(); });
    }

    function openAddAddressModal() {
        isAddingNewAddress = true;
        editingAddressId = null;
        
        // Set modal title and button text
        editModalTitle.textContent = 'Add New Address';
        editModalSubmit.innerHTML = '<i class="fas fa-save"></i> Save Address';
        
        // Clear form fields
        editAddressForm.reset();
        
        // Show modal
        editAddressModal.style.display = 'flex';
    }

    function openAddBillingAddressModal() {
        isEditingBillingAddress = false;
        editingBillingAddressId = null;
        
        // Set modal title and button text
        billingModalTitle.textContent = 'Add Billing Address';
        billingModalSubmit.innerHTML = '<i class="fas fa-save"></i> Save Billing Address';
        
        // Clear form fields
        billingAddressForm.reset();
        
        // Show modal
        billingAddressModal.style.display = 'flex';
    }

    function openEditModal(address) {
        isAddingNewAddress = false;
        editingAddressId = address.id;
        
        // Set modal title and button text
        editModalTitle.textContent = 'Edit Address';
        editModalSubmit.innerHTML = '<i class="fas fa-save"></i> Update Address';
        
        // Populate form fields with address data
        document.getElementById('edit-full-name').value = address.name;
        document.getElementById('edit-phone').value = address.phone;
        document.getElementById('edit-address').value = address.address;
        document.getElementById('edit-city').value = address.city;
        document.getElementById('edit-state').value = address.state;
        document.getElementById('edit-pincode').value = address.pincode;
        document.getElementById('edit-landmark').value = address.landmark || '';
        
        // Set address type radio button
        const typeRadio = document.getElementById(`edit-${address.type}`);
        if (typeRadio) typeRadio.checked = true;

        // Show modal
        editAddressModal.style.display = 'flex';
    }

    function openEditBillingModal(address) {
        isEditingBillingAddress = true;
        editingBillingAddressId = address.id;
        
        // Set modal title and button text
        billingModalTitle.textContent = 'Edit Billing Address';
        billingModalSubmit.innerHTML = '<i class="fas fa-save"></i> Update Billing Address';
        
        // Populate form fields with address data
        document.getElementById('billing-full-name').value = address.name;
        document.getElementById('billing-phone').value = address.phone;
        document.getElementById('billing-address').value = address.address;
        document.getElementById('billing-city').value = address.city;
        document.getElementById('billing-state').value = address.state;
        document.getElementById('billing-pincode').value = address.pincode;
        document.getElementById('billing-landmark').value = address.landmark || '';
        
        // Set address type radio button
        const typeRadio = document.getElementById(`billing-${address.type}`);
        if (typeRadio) typeRadio.checked = true;

        // Show modal
        billingAddressModal.style.display = 'flex';
    }

    function closeEditModalFunc() {
        editAddressModal.style.display = 'none';
        editingAddressId = null;
        isAddingNewAddress = false;
        editAddressForm.reset();
    }

    function closeBillingModalFunc() {
        billingAddressModal.style.display = 'none';
        isEditingBillingAddress = false;
        editingBillingAddressId = null;
        billingAddressForm.reset();
    }

    function handleAddressSubmit(e) {
        e.preventDefault();
        
        const addressData = {
            name: document.getElementById('edit-full-name').value,
            phone: document.getElementById('edit-phone').value,
            address: document.getElementById('edit-address').value,
            city: document.getElementById('edit-city').value,
            state: document.getElementById('edit-state').value,
            pincode: document.getElementById('edit-pincode').value,
            landmark: document.getElementById('edit-landmark').value,
            type: document.querySelector('input[name="edit-address-type"]:checked').value
        };

        if (isAddingNewAddress) {
            // Create new address
            const newAddress = {
                id: savedAddresses.length > 0 ? Math.max(...savedAddresses.map(a => a.id)) + 1 : 1,
                ...addressData
            };
            savedAddresses.push(newAddress);
            showNotification('Address added successfully!', 'success');
            
            // Select the new address
            selectedShippingAddress = newAddress;
        } else {
            // Update existing address
            const addressIndex = savedAddresses.findIndex(a => a.id == editingAddressId);
            
            if (addressIndex !== -1) {
                savedAddresses[addressIndex] = { ...savedAddresses[addressIndex], ...addressData };
                showNotification('Address updated successfully!', 'success');
                
                // Update selected address if it was the one being edited
                if (selectedShippingAddress && selectedShippingAddress.id == editingAddressId) {
                    selectedShippingAddress = savedAddresses[addressIndex];
                }
            }
        }

        renderSavedAddresses();
        closeEditModalFunc();
    }

    function handleBillingAddressSubmit(e) {
        e.preventDefault();
        
        const addressData = {
            name: document.getElementById('billing-full-name').value,
            phone: document.getElementById('billing-phone').value,
            address: document.getElementById('billing-address').value,
            city: document.getElementById('billing-city').value,
            state: document.getElementById('billing-state').value,
            pincode: document.getElementById('billing-pincode').value,
            landmark: document.getElementById('billing-landmark').value,
            type: document.querySelector('input[name="billing-address-type"]:checked').value
        };

        if (isEditingBillingAddress) {
            // Update existing billing address
            const addressIndex = billingAddresses.findIndex(a => a.id == editingBillingAddressId);
            
            if (addressIndex !== -1) {
                billingAddresses[addressIndex] = { ...billingAddresses[addressIndex], ...addressData };
                showNotification('Billing address updated successfully!', 'success');
                
                // Update selected billing address if it was the one being edited
                if (selectedBillingAddress && selectedBillingAddress.id == editingBillingAddressId) {
                    selectedBillingAddress = billingAddresses[addressIndex];
                }
            }
        } else {
            // Create new billing address
            const newAddress = {
                id: billingAddresses.length > 0 ? Math.max(...billingAddresses.map(a => a.id)) + 1 : 1,
                ...addressData
            };
            billingAddresses.push(newAddress);
            showNotification('Billing address added successfully!', 'success');
            
            // Select the new billing address
            selectedBillingAddress = newAddress;
            
            // Make sure different billing radio is selected
            differentBillingRadio.checked = true;
            billingAddressSelection.style.display = 'block';
        }

        renderBillingAddresses();
        closeBillingModalFunc();
    }

    function deleteAddress(addressId) {
        if (confirm('Are you sure you want to delete this address?')) {
            const index = savedAddresses.findIndex(a => a.id == addressId);
            if (index !== -1) { 
                savedAddresses.splice(index, 1); 
                renderSavedAddresses(); 
                showNotification('Address deleted successfully!', 'success'); 
                
                // Clear selected address if it was deleted
                if (selectedShippingAddress && selectedShippingAddress.id == addressId) {
                    selectedShippingAddress = null;
                }
            }
        }
    }

    function deleteBillingAddress(addressId) {
        if (confirm('Are you sure you want to delete this billing address?')) {
            const index = billingAddresses.findIndex(a => a.id == addressId);
            if (index !== -1) { 
                billingAddresses.splice(index, 1); 
                renderBillingAddresses(); 
                showNotification('Billing address deleted successfully!', 'success'); 
                
                // Clear selected billing address if it was deleted
                if (selectedBillingAddress && selectedBillingAddress.id == addressId) {
                    selectedBillingAddress = null;
                    
                    // If billing address was deleted and different billing is selected, open add modal
                    if (differentBillingRadio.checked) {
                        openAddBillingAddressModal();
                    }
                }
            }
        }
    }

    function processPayment() {
        if (!selectedShippingAddress) { 
            showNotification('Please select a shipping address.', 'error'); 
            return; 
        }
        
        if (!selectedBillingAddress) {
            showNotification('Please select a billing address.', 'error');
            return;
        }
        
        paymentModal.style.display = 'flex';
        
        setTimeout(() => {
            paymentModal.style.display = 'none';
            currentOrder = createOrder();
            setTimeout(() => { 
                showSuccessModal(currentOrder); 
            }, 500);
        }, 3000);
    }

    function createOrder() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 10000);
        const orderId = `AGRI-${timestamp}-${random}`;
        const orderDate = new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const subtotal = cartItems.reduce((sum, i) => sum + i.price, 0);
        const discount = 50;
        const taxes = 25;
        const total = subtotal - discount + taxes;
        
        const order = {
            id: orderId,
            date: orderDate,
            items: [...cartItems],
            shippingAddress: selectedShippingAddress,
            billingAddress: selectedBillingAddress,
            subtotal, 
            discount, 
            taxes, 
            total, 
            status: 'confirmed'
        };
        
        return order;
    }

    function showSuccessModal(order) {
        successOrderId.textContent = order.id;
        successOrderDate.textContent = order.date;
        successModal.style.display = 'flex';
        showNotification('Payment Successful!', 'success');
    }

    function showOrderDetailsModal(order) {
        // Populate order information
        modalOrderId.textContent = order.id;
        modalOrderDate.textContent = order.date;
        modalOrderTotal.textContent = `₹${order.total}`;
        
        // Populate order items
        modalOrderItems.innerHTML = order.items.map(item => `
            <div class="order-item-detail">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    <p class="order-item-seller">Sold by: ${item.seller}</p>
                    <p class="order-item-quantity">Quantity: ${item.quantity}</p>
                </div>
                <div class="order-item-price">₹${item.price}</div>
            </div>
        `).join('');
        
        // Populate delivery address
        const addr = order.shippingAddress;
        modalDeliveryAddress.innerHTML = `
            <p><strong>${addr.name}</strong></p>
            <p>${addr.address}</p>
            <p>${addr.city}, ${getStateName(addr.state)} - ${addr.pincode}</p>
            <p>Phone: ${addr.phone}</p>
            ${addr.landmark ? `<p>Landmark: ${addr.landmark}</p>` : ''}
        `;
        
        // Populate billing address
        const billingAddr = order.billingAddress;
        modalBillingAddress.innerHTML = `
            <p><strong>${billingAddr.name}</strong></p>
            <p>${billingAddr.address}</p>
            <p>${billingAddr.city}, ${getStateName(billingAddr.state)} - ${billingAddr.pincode}</p>
            <p>Phone: ${billingAddr.phone}</p>
            ${billingAddr.landmark ? `<p>Landmark: ${billingAddr.landmark}</p>` : ''}
        `;
        
        // Show modal
        orderModal.style.display = 'flex';
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
});