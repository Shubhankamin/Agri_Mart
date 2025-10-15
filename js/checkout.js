document.addEventListener("DOMContentLoaded", function () {
  // Sample saved addresses for delivery
  let savedAddresses = [];
  // Separate array for billing addresses
  let billingAddresses = JSON.parse(localStorage.getItem("billingAddresses")) || [];

  // FIX #2: Load cart items from localStorage
  let cartItems = [];
  let orderSummary = {
    subtotal: 0,
    tax: 0,
    total: 0,
    itemCount: 0,
  };
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const navLinks = document.getElementById("navLinks");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const mobileCloseBtn = document.getElementById("mobileCloseBtn");

    if (!mobileMenuToggle || !navLinks) return;

    function toggleMenu() {
      const isActive = navLinks.classList.toggle("active");
      mobileMenuToggle.classList.toggle("active");
      mobileOverlay?.classList.toggle("active");
      document.body.style.overflow = isActive ? "hidden" : "";
      mobileMenuToggle.setAttribute("aria-expanded", isActive);
    }

    function closeMenu() {
      navLinks.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
      mobileOverlay?.classList.remove("active");
      document.body.style.overflow = "";
      mobileMenuToggle.setAttribute("aria-expanded", "false");
    }

    mobileMenuToggle.addEventListener("click", toggleMenu);
    mobileOverlay?.addEventListener("click", closeMenu);
    mobileCloseBtn?.addEventListener("click", closeMenu);

    navLinks
      .querySelectorAll(".nav-link:not(.dropdown-toggle)")
      .forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

    const mobileProfile = document.querySelector(".mobile-profile-section");
    if (mobileProfile) {
      mobileProfile.style.cursor = "pointer";
      mobileProfile.addEventListener("click", () => {
        closeMenu();
        if (!user) {
          window.location.href = "/login.html";
        } else {
          window.location.href = "/profile.html";
        }
      });
    }

    // Update user info
    if (user) {
      const mobileUserName = document.getElementById("mobileUserName");
      const mobileUserEmail = document.getElementById("mobileUserEmail");
      if (mobileUserName) mobileUserName.textContent = user.name || "User";
      if (mobileUserEmail) mobileUserEmail.textContent = user.email || "";
    } else {
      const mobileUserName = document.getElementById("mobileUserName");
      const mobileUserEmail = document.getElementById("mobileUserEmail");
      if (mobileUserName) mobileUserName.textContent = "Guest User";
      if (mobileUserEmail) mobileUserEmail.textContent = "Tap to login";
    }

    // Sync cart counts
    const mobileCartCount = document.getElementById("mobileCartCount");
    if (mobileCartCount) {
      const observer = new MutationObserver(() => {
        const cartCount = document.getElementById("cart-count");
        if (cartCount) mobileCartCount.textContent = cartCount.textContent;
      });
      const cartCount = document.getElementById("cart-count");
      if (cartCount) {
        observer.observe(cartCount, {
          childList: true,
          characterData: true,
          subtree: true,
        });
        mobileCartCount.textContent = cartCount.textContent;
      }
    }
  }

  if (!currentUser) {
    console.error("No user logged in.");
  } else {
    const userEmail = currentUser.email || "";
    const userName = currentUser.name || "";
    const phone = currentUser.phone || "";

    // ✅ FIX: Update mobile user info
    const mobileUserNameEl = document.getElementById("mobileUserName");
    const mobileUserEmailEl = document.getElementById("mobileUserEmail");

    if (mobileUserNameEl) {
      mobileUserNameEl.textContent = userName || "Guest User";
    }
    if (mobileUserEmailEl) {
      mobileUserEmailEl.textContent = userEmail || "guest@agrimart.com";
    }

    // ✅ FIX: Load addresses from single source - localStorage "addresses"
    const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
    savedAddresses = addresses.filter((addr) => addr.email === currentUser.email);

    console.log("Loaded addresses for user:", savedAddresses);
  }

  // DOM Elements
  const savedAddressesContainer = document.getElementById("saved-addresses");
  const billingSavedAddressesContainer = document.getElementById("billing-saved-addresses");
  const billingAddressSelection = document.getElementById("billing-address-selection");
  const addAddressBtn = document.getElementById("add-address-btn");
  const addBillingAddressBtn = document.getElementById("add-billing-address-btn");
  const editAddressModal = document.getElementById("edit-address-modal");
  const billingAddressModal = document.getElementById("billing-address-modal");
  const closeEditModal = document.getElementById("close-edit-modal");
  const closeBillingModal = document.getElementById("close-billing-modal");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const cancelBillingBtn = document.getElementById("cancel-billing-btn");
  const editAddressForm = document.getElementById("edit-address-form");
  const billingAddressForm = document.getElementById("billing-address-form");
  const editModalTitle = document.getElementById("edit-modal-title");
  const billingModalTitle = document.getElementById("billing-modal-title");
  const editModalSubmit = document.getElementById("edit-modal-submit");
  const billingModalSubmit = document.getElementById("billing-modal-submit");
  const sameAsShippingRadio = document.getElementById("same-as-shipping");
  const differentBillingRadio = document.getElementById("different-billing");
  const payNowBtn = document.getElementById("pay-now-btn");
  const paymentModal = document.getElementById("payment-modal");
  const successModal = document.getElementById("success-modal");
  const viewOrderBtn = document.getElementById("view-order-btn");
  const continueShoppingBtn = document.getElementById("continue-shopping-btn");
  const successOrderId = document.getElementById("success-order-id");
  const successOrderDate = document.getElementById("success-order-date");
  const orderModal = document.getElementById("order-modal");
  const closeOrderModal = document.getElementById("close-order-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const printOrderBtn = document.getElementById("print-order-btn");
  const modalOrderId = document.getElementById("modal-order-id");
  const modalOrderDate = document.getElementById("modal-order-date");
  const modalOrderTotal = document.getElementById("modal-order-total");
  const modalOrderItems = document.getElementById("modal-order-items");
  const modalDeliveryAddress = document.getElementById("modal-delivery-address");
  const modalBillingAddress = document.getElementById("modal-billing-address");
  const checkoutCartItems = document.getElementById("checkout-cart-items");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryTax = document.getElementById("summary-tax");
  const summaryTotal = document.getElementById("summary-total");
  const summaryItemCount = document.getElementById("summary-item-count");
  const headerCartCount = document.getElementById("header-cart-count");
  const checkoutStatus = document.getElementById("checkout-status");
  const selectedDeliveryPreview = document.getElementById("selected-delivery-preview");
  const sameAddressDisplay = document.getElementById("same-address-display");
  const paymentAmount = document.getElementById("payment-amount");
  const successMessage = document.getElementById("success-message");

  // Variables
  let selectedShippingAddress = null;
  let selectedBillingAddress = null;
  let currentOrder = null;
  let editingAddressId = null;
  let editingBillingAddressId = null;
  let isAddingNewAddress = false;
  let isEditingBillingAddress = false;
  let focusedElementBeforeModal = null;

  // Initialize page
  loadCartData();
  renderCartItems();
  renderSavedAddresses();
  renderBillingAddresses();
  setupEventListeners();
  setupKeyboardNavigation();
  setupMobileMenu();

  // ✅ FIX: Add function to refresh addresses from localStorage
  function refreshAddresses() {
    const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
    savedAddresses = addresses.filter((addr) => addr.email === currentUser.email);
    renderSavedAddresses();
  }

  // Load cart data function
  function loadCartData() {
    try {
      const savedCart = localStorage.getItem("agrimart_cart");
      const savedOrderSummary = localStorage.getItem("agrimart_order_summary");

      if (savedCart) {
        cartItems = JSON.parse(savedCart);
      }

      if (savedOrderSummary) {
        orderSummary = JSON.parse(savedOrderSummary);
      } else {
        calculateOrderSummary();
      }

      if (headerCartCount) {
        headerCartCount.textContent = orderSummary.itemCount;
      }
    } catch (e) {
      console.error("Error loading cart data:", e);
      showNotification("Error loading cart data. Please return to cart.", "error");
    }
  }

  // Calculate order summary
  function calculateOrderSummary() {
    let subtotal = 0;
    let itemCount = 0;

    cartItems.forEach((item) => {
      subtotal += item.price * item.quantity;
      itemCount += item.quantity;
    });

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    orderSummary = {
      subtotal: subtotal,
      tax: tax,
      total: total,
      itemCount: itemCount,
    };
  }

  // Render cart items
  function renderCartItems() {
    if (cartItems.length === 0) {
      checkoutCartItems.innerHTML = '<p class="no-addresses">No items in cart. Please add items first.</p>';
      payNowBtn.disabled = true;
      return;
    }

    checkoutCartItems.innerHTML = "";

    cartItems.forEach((item) => {
      const cartItemElement = document.createElement("article");
      cartItemElement.className = "cart-item";
      const imageSrc = Array.isArray(item.image) && item.image.length > 0
        ? item.image[0].src
        : typeof item.image === "string" && item.image.trim() !== ""
        ? item.image
        : "assets/default-image.jpg";
      cartItemElement.innerHTML = `
                <div class="item-image">
    <img src="${escapeHtml(imageSrc)}"
         alt="${escapeHtml(item.title)}"
         loading="lazy">
  </div>
                <div class="item-details">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p class="item-seller">Sold by: Local Farmer</p>
                    <div class="item-quantity">
                        <span>Quantity: ${item.quantity}</span>
                    </div>
                </div>
                <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
            `;

      checkoutCartItems.appendChild(cartItemElement);
    });

    summarySubtotal.textContent = `₹${orderSummary.subtotal.toFixed(2)}`;
    summaryTax.textContent = `₹${orderSummary.tax.toFixed(2)}`;
    summaryTotal.textContent = `₹${orderSummary.total.toFixed(2)}`;
    summaryItemCount.textContent = orderSummary.itemCount;

    payNowBtn.disabled = false;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return String(text).replace(/[&<>"']/g, (m) => map[m]);
  }

  // ✅ FIX: Render saved addresses with real-time updates
  function renderSavedAddresses() {
    savedAddressesContainer.innerHTML = "";

    // Refresh addresses from localStorage to get latest changes
    const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
    savedAddresses = addresses.filter((addr) => addr.email === currentUser.email);

    if (savedAddresses.length === 0) {
      savedAddressesContainer.innerHTML = `<div class="no-addresses" role="status"><p>No saved addresses found. Please add a new address.</p></div>`;
      selectedShippingAddress = null;
      updateDeliveryAddressPreview();
      return;
    }

    savedAddresses.forEach((address, index) => {
      const addressCard = createAddressCard(address, "shipping", index);
      savedAddressesContainer.appendChild(addressCard);
    });

    // Select first shipping address by default if none selected
    if (savedAddresses.length > 0 && !selectedShippingAddress) {
      selectShippingAddress(savedAddresses[0]);
    } else if (selectedShippingAddress) {
      // Check if selected address still exists
      const addressExists = savedAddresses.find(addr => addr.id === selectedShippingAddress.id);
      if (!addressExists) {
        selectedShippingAddress = savedAddresses.length > 0 ? savedAddresses[0] : null;
        selectShippingAddress(selectedShippingAddress);
      }
    }
  }

  // Render billing addresses
  function renderBillingAddresses() {
    billingSavedAddressesContainer.innerHTML = "";

    if (billingAddresses.length === 0) {
      billingSavedAddressesContainer.innerHTML = `<div class="no-addresses" role="status"><p>No billing addresses found. Please add a new billing address.</p></div>`;
      return;
    }

    billingAddresses.forEach((address, index) => {
      const addressCard = createAddressCard(address, "billing", index);
      billingSavedAddressesContainer.appendChild(addressCard);
    });
  }

  // ✅ FIX: Updated createAddressCard to show "Home Address" or "Work Address"
  function createAddressCard(address, type, index) {
    const card = document.createElement("div");
    card.className = "address-card";
    card.dataset.id = address.id;
    card.setAttribute("role", "radio");
    card.setAttribute("aria-checked", "false");
    card.setAttribute("tabindex", index === 0 ? "0" : "-1");

    // ✅ FIX: Show "Home Address" or "Work Address" based on type
    const typeLabel = address.type === "home" ? "Home Address" : 
                     address.type === "work" ? "Work Address" : 
                     "Home Address";

    card.innerHTML = `
        <div class="address-card-header">
            <div class="address-name">${typeLabel}</div>
            <div class="address-type-badge">${typeLabel}</div>
        </div>
        <div class="address-details">
            <p><strong>${escapeHtml(address.name || "User")}</strong></p>
            <p>${escapeHtml(address.phone || "")}</p>
            <p>${escapeHtml(address.address || "")}</p>
            <p>${escapeHtml(address.city || "")}, ${getStateName(address.state)} - ${escapeHtml(address.pincode || "")}</p>
            ${address.landmark ? `<p>Landmark: ${escapeHtml(address.landmark)}</p>` : ""}
        </div>
        <div class="address-actions">
            <button class="address-action edit-address" data-id="${address.id}" data-type="${type}" type="button">
                <i class="fas fa-edit" aria-hidden="true"></i> <span>Edit</span>
            </button>
            <button class="address-action delete-address" data-id="${address.id}" data-type="${type}" type="button">
                <i class="fas fa-trash" aria-hidden="true"></i> <span>Delete</span>
            </button>
        </div>
    `;

    card.addEventListener("click", function (e) {
      if (!e.target.closest(".address-actions")) {
        if (type === "shipping") {
          selectShippingAddress(address);
        } else {
          selectBillingAddress(address);
        }
      }
    });

    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (type === "shipping") {
          selectShippingAddress(address);
        } else {
          selectBillingAddress(address);
        }
      }
    });

    return card;
  }

  // Select shipping address
  function selectShippingAddress(address) {
    selectedShippingAddress = address;

    const container = savedAddressesContainer;
    container.querySelectorAll(".address-card").forEach((c) => {
      c.classList.remove("selected");
      c.setAttribute("aria-checked", "false");
      c.setAttribute("tabindex", "-1");
    });

    const selectedCard = container.querySelector(`[data-id="${address.id}"]`);
    if (selectedCard) {
      selectedCard.classList.add("selected");
      selectedCard.setAttribute("aria-checked", "true");
      selectedCard.setAttribute("tabindex", "0");
    }

    if (sameAsShippingRadio.checked) {
      selectedBillingAddress = address;
      updateDeliveryAddressPreview();
    }

    announceToScreenReader(`Delivery address selected: ${address.name}, ${address.city}`);
  }

  // Select billing address
  function selectBillingAddress(address) {
    selectedBillingAddress = address;

    const container = billingSavedAddressesContainer;
    container.querySelectorAll(".address-card").forEach((c) => {
      c.classList.remove("selected");
      c.setAttribute("aria-checked", "false");
      c.setAttribute("tabindex", "-1");
    });

    const selectedCard = container.querySelector(`[data-id="${address.id}"]`);
    if (selectedCard) {
      selectedCard.classList.add("selected");
      selectedCard.setAttribute("aria-checked", "true");
      selectedCard.setAttribute("tabindex", "0");
    }

    announceToScreenReader(`Billing address selected: ${address.name}, ${address.city}`);
  }

  // ✅ FIX: Updated delivery address preview to show proper labels
  function updateDeliveryAddressPreview() {
    if (!selectedShippingAddress) {
      selectedDeliveryPreview.innerHTML = '<p class="no-addresses">Please select a delivery address first.</p>';
      return;
    }

    const addr = selectedShippingAddress;
    const typeLabel = addr.type === "home" ? "Home Address" : 
                     addr.type === "work" ? "Work Address" : 
                     "Home Address";
    
    selectedDeliveryPreview.innerHTML = `
            <p><strong>${typeLabel}</strong></p>
            <p><strong>${escapeHtml(addr.name || "User")}</strong></p>
            <p>${escapeHtml(addr.phone || "")}</p>
            <p>${escapeHtml(addr.address || "")}</p>
            <p>${escapeHtml(addr.city || "")}, ${getStateName(addr.state)} - ${escapeHtml(addr.pincode || "")}</p>
            ${addr.landmark ? `<p>Landmark: ${escapeHtml(addr.landmark)}</p>` : ""}
        `;
  }

  function getStateName(code) {
    const states = {
      KA: "Karnataka",
      MH: "Maharashtra",
      TN: "Tamil Nadu",
      DL: "Delhi",
      UP: "Uttar Pradesh",
      RJ: "Rajasthan",
      GJ: "Gujarat",
      WB: "West Bengal",
    };
    return states[code] || code;
  }

  function setupEventListeners() {
    // Add new address buttons
    addAddressBtn.addEventListener("click", openAddAddressModal);
    addBillingAddressBtn.addEventListener("click", openAddBillingAddressModal);

    // Close modals
    closeEditModal.addEventListener("click", closeEditModalFunc);
    closeBillingModal.addEventListener("click", closeBillingModalFunc);
    cancelEditBtn.addEventListener("click", closeEditModalFunc);
    cancelBillingBtn.addEventListener("click", closeBillingModalFunc);

    // Close modals on backdrop click
    editAddressModal.addEventListener("click", function (e) {
      if (e.target === editAddressModal) {
        closeEditModalFunc();
      }
    });

    billingAddressModal.addEventListener("click", function (e) {
      if (e.target === billingAddressModal) {
        closeBillingModalFunc();
      }
    });

    // Form submissions
    editAddressForm.addEventListener("submit", handleAddressSubmit);
    billingAddressForm.addEventListener("submit", handleBillingAddressSubmit);

    // Billing address radio buttons
    sameAsShippingRadio.addEventListener("change", function () {
      if (this.checked) {
        billingAddressSelection.style.display = "none";
        sameAddressDisplay.style.display = "block";
        selectedBillingAddress = selectedShippingAddress;
        updateDeliveryAddressPreview();
        announceToScreenReader("Billing address same as delivery address");
      }
    });

    differentBillingRadio.addEventListener("change", function () {
      if (this.checked) {
        billingAddressSelection.style.display = "block";
        sameAddressDisplay.style.display = "none";

        // ✅ FIX: Clear the selected billing address and don't show delivery address preview
        selectedBillingAddress = null;
        
        // ✅ FIX: Clear the delivery address preview when choosing different billing
        selectedDeliveryPreview.innerHTML = '<p class="no-addresses">Please add a new billing address below.</p>';
        
        // If no billing addresses exist yet, open the add billing address modal
        if (billingAddresses.length === 0) {
          setTimeout(() => openAddBillingAddressModal(), 300);
        }

        announceToScreenReader("Use different billing address selected. Please add a new billing address.");
      }
    });

    // Edit/delete address buttons - Event delegation
    document.addEventListener("click", (e) => {
      if (e.target.closest(".edit-address")) {
        const button = e.target.closest(".edit-address");
        const addressId = button.dataset.id;
        const type = button.dataset.type;

        if (type === "shipping") {
          const address = savedAddresses.find((a) => a.id == addressId);
          if (address) openEditModal(address);
        } else {
          const address = billingAddresses.find((a) => a.id == addressId);
          if (address) openEditBillingModal(address);
        }
      }

      if (e.target.closest(".delete-address")) {
        const button = e.target.closest(".delete-address");
        const addressId = button.dataset.id;
        const type = button.dataset.type;

        if (type === "shipping") {
          deleteAddress(addressId);
        } else {
          deleteBillingAddress(addressId);
        }
      }
    });

    // Pay Now
    payNowBtn.addEventListener("click", processPayment);

    // Success modal buttons
    viewOrderBtn.addEventListener("click", () => {
      successModal.style.display = "none";
      if (currentOrder) {
        showOrderDetailsModal(currentOrder);
      }
    });

    continueShoppingBtn.addEventListener("click", () => {
      successModal.style.display = "none";
      window.location.href = "products.html";
    });

    // Order modal buttons
    closeOrderModal.addEventListener("click", () => {
      orderModal.style.display = "none";
      restoreFocus();
    });

    closeModalBtn.addEventListener("click", () => {
      orderModal.style.display = "none";
      restoreFocus();
      window.location.href = "profile.html";
    });

    printOrderBtn.addEventListener("click", () => {
      window.print();
    });

    // ✅ FIX: Listen for storage changes to sync addresses in real-time
    window.addEventListener('storage', function(e) {
      if (e.key === 'addresses') {
        refreshAddresses();
      }
    });
  }

  // Setup keyboard navigation
  function setupKeyboardNavigation() {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (editAddressModal.style.display === "flex") {
          closeEditModalFunc();
        } else if (billingAddressModal.style.display === "flex") {
          closeBillingModalFunc();
        } else if (orderModal.style.display === "flex") {
          orderModal.style.display = "none";
          restoreFocus();
        } else if (successModal.style.display === "flex") {
          successModal.style.display = "none";
          restoreFocus();
        }
      }
    });
  }

  function openAddAddressModal() {
    isAddingNewAddress = true;
    editingAddressId = null;

    editModalTitle.textContent = "Add New Address";
    editModalSubmit.innerHTML = '<i class="fas fa-save" aria-hidden="true"></i> Save Address';

    editAddressForm.reset();
    clearFormErrors(editAddressForm);

    showModal(editAddressModal);
  }

  // ✅ FIX: Open billing address modal with empty form
  function openAddBillingAddressModal() {
    isEditingBillingAddress = false;
    editingBillingAddressId = null;

    billingModalTitle.textContent = "Add Billing Address";
    billingModalSubmit.innerHTML = '<i class="fas fa-save" aria-hidden="true"></i> Save Billing Address';

    // ✅ FIX: Clear the form instead of auto-filling
    billingAddressForm.reset();
    clearFormErrors(billingAddressForm);

    showModal(billingAddressModal);
  }

  function openEditModal(address) {
    isAddingNewAddress = false;
    editingAddressId = address.id;

    editModalTitle.textContent = "Edit Address";
    editModalSubmit.innerHTML = '<i class="fas fa-save" aria-hidden="true"></i> Update Address';

    // Populate form
    document.getElementById("edit-full-name").value = address.name || "";
    document.getElementById("edit-phone").value = address.phone || "";
    document.getElementById("edit-address").value = address.address || "";
    document.getElementById("edit-city").value = address.city || "";
    document.getElementById("edit-state").value = address.state || "";
    document.getElementById("edit-pincode").value = address.pincode || "";
    document.getElementById("edit-landmark").value = address.landmark || "";

    const typeRadio = document.getElementById(`edit-${address.type}`);
    if (typeRadio) typeRadio.checked = true;

    clearFormErrors(editAddressForm);
    showModal(editAddressModal);
  }

  function openEditBillingModal(address) {
    isEditingBillingAddress = true;
    editingBillingAddressId = address.id;

    billingModalTitle.textContent = "Edit Billing Address";
    billingModalSubmit.innerHTML = '<i class="fas fa-save" aria-hidden="true"></i> Update Billing Address';

    // Populate form
    document.getElementById("billing-full-name").value = address.name || "";
    document.getElementById("billing-phone").value = address.phone || "";
    document.getElementById("billing-address").value = address.address || "";
    document.getElementById("billing-city").value = address.city || "";
    document.getElementById("billing-state").value = address.state || "";
    document.getElementById("billing-pincode").value = address.pincode || "";
    document.getElementById("billing-landmark").value = address.landmark || "";

    const typeRadio = document.getElementById(`billing-${address.type}`);
    if (typeRadio) typeRadio.checked = true;

    clearFormErrors(billingAddressForm);
    showModal(billingAddressModal);
  }

  // Show modal with focus management
  function showModal(modal) {
    focusedElementBeforeModal = document.activeElement;
    modal.style.display = "flex";

    setTimeout(() => {
      const firstInput = modal.querySelector('input:not([type="radio"]), select, textarea');
      if (firstInput) firstInput.focus();
    }, 100);

    trapFocus(modal);
  }

  // Focus trap
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === "Tab") {
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
    };

    element.addEventListener("keydown", handleTabKey);
  }

  function closeEditModalFunc() {
    editAddressModal.style.display = "none";
    editingAddressId = null;
    isAddingNewAddress = false;
    editAddressForm.reset();
    clearFormErrors(editAddressForm);
    restoreFocus();
  }

  function closeBillingModalFunc() {
    billingAddressModal.style.display = "none";
    isEditingBillingAddress = false;
    editingBillingAddressId = null;
    billingAddressForm.reset();
    clearFormErrors(billingAddressForm);
    restoreFocus();
  }

  function restoreFocus() {
    if (focusedElementBeforeModal) {
      focusedElementBeforeModal.focus();
      focusedElementBeforeModal = null;
    }
  }

  // Form validation
  function validateForm(form) {
    let isValid = true;
    clearFormErrors(form);

    const formId = form.id;
    const prefix = formId === "edit-address-form" ? "edit" : "billing";

    // Full Name
    const nameInput = document.getElementById(`${prefix}-full-name`);
    const nameValue = nameInput.value.trim();
    if (nameValue.length < 2) {
      showFieldError(nameInput, `${prefix}-name-error`, "Name must be at least 2 characters");
      isValid = false;
    } else if (nameValue.length > 50) {
      showFieldError(nameInput, `${prefix}-name-error`, "Name must not exceed 50 characters");
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(nameValue)) {
      showFieldError(nameInput, `${prefix}-name-error`, "Name should only contain letters");
      isValid = false;
    }

    // Phone
    const phoneInput = document.getElementById(`${prefix}-phone`);
    const phoneValue = phoneInput.value.trim();
    if (!/^[0-9]{10}$/.test(phoneValue)) {
      showFieldError(phoneInput, `${prefix}-phone-error`, "Phone must be exactly 10 digits");
      isValid = false;
    }

    // Address
    const addressInput = document.getElementById(`${prefix}-address`);
    const addressValue = addressInput.value.trim();
    if (addressValue.length < 10) {
      showFieldError(addressInput, `${prefix}-address-error`, "Address must be at least 10 characters");
      isValid = false;
    } else if (addressValue.length > 200) {
      showFieldError(addressInput, `${prefix}-address-error`, "Address must not exceed 200 characters");
      isValid = false;
    }

    // City
    const cityInput = document.getElementById(`${prefix}-city`);
    const cityValue = cityInput.value.trim();
    if (cityValue.length < 2) {
      showFieldError(cityInput, `${prefix}-city-error`, "City must be at least 2 characters");
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(cityValue)) {
      showFieldError(cityInput, `${prefix}-city-error`, "City should only contain letters");
      isValid = false;
    }

    // State
    const stateInput = document.getElementById(`${prefix}-state`);
    if (!stateInput.value) {
      showFieldError(stateInput, `${prefix}-state-error`, "Please select a state");
      isValid = false;
    }

    // Pincode
    const pincodeInput = document.getElementById(`${prefix}-pincode`);
    const pincodeValue = pincodeInput.value.trim();
    if (!/^[0-9]{6}$/.test(pincodeValue)) {
      showFieldError(pincodeInput, `${prefix}-pincode-error`, "PIN code must be exactly 6 digits");
      isValid = false;
    }

    return isValid;
  }

  function showFieldError(input, errorId, message) {
    input.classList.add("error");
    input.setAttribute("aria-invalid", "true");
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
    }
  }

  function clearFormErrors(form) {
    form.querySelectorAll(".error").forEach((el) => {
      el.classList.remove("error");
      el.setAttribute("aria-invalid", "false");
    });
    form.querySelectorAll(".error-message").forEach((el) => {
      el.textContent = "";
      el.classList.remove("show");
    });
  }

  // ✅ FIX: Complete handleAddressSubmit function - save to central addresses list
  function handleAddressSubmit(e) {
    e.preventDefault();
    if (!validateForm(editAddressForm)) return;

    const addressData = {
      name: document.getElementById("edit-full-name").value.trim(),
      phone: document.getElementById("edit-phone").value.trim(),
      address: document.getElementById("edit-address").value.trim(),
      city: document.getElementById("edit-city").value.trim(),
      state: document.getElementById("edit-state").value,
      pincode: document.getElementById("edit-pincode").value.trim(),
      landmark: document.getElementById("edit-landmark").value.trim(),
      type: document.querySelector('input[name="edit-address-type"]:checked').value,
      email: currentUser.email // Add user email to link address to user
    };

    // ✅ FIX: Always save to central addresses list in localStorage
    const allAddresses = JSON.parse(localStorage.getItem("addresses")) || [];

    if (isAddingNewAddress) {
      const newAddress = { 
        id: Date.now(), 
        ...addressData 
      };
      savedAddresses.push(newAddress);
      allAddresses.push(newAddress);
      
      showNotification("Address added successfully!", "success");
    } else {
      const index = savedAddresses.findIndex((a) => a.id == editingAddressId);
      if (index !== -1) {
        savedAddresses[index] = { ...savedAddresses[index], ...addressData };
        
        const profileIndex = allAddresses.findIndex((a) => a.id == editingAddressId);
        if (profileIndex !== -1) {
          allAddresses[profileIndex] = { ...allAddresses[profileIndex], ...addressData };
        }
        
        showNotification("Address updated successfully!", "success");
      }
    }

    // ✅ FIX: Save to central addresses list
    localStorage.setItem("addresses", JSON.stringify(allAddresses));
    
    renderSavedAddresses();
    
    // Select the newly added/edited address
    if (isAddingNewAddress) {
      selectShippingAddress(savedAddresses[savedAddresses.length - 1]);
    } else {
      const updatedAddress = savedAddresses.find(a => a.id == editingAddressId);
      if (updatedAddress) selectShippingAddress(updatedAddress);
    }
    
    closeEditModalFunc();
  }

  function handleBillingAddressSubmit(e) {
    e.preventDefault();

    if (!validateForm(billingAddressForm)) {
      announceToScreenReader("Please fix the errors in the form");
      return;
    }

    const addressData = {
      name: document.getElementById("billing-full-name").value.trim(),
      phone: document.getElementById("billing-phone").value.trim(),
      address: document.getElementById("billing-address").value.trim(),
      city: document.getElementById("billing-city").value.trim(),
      state: document.getElementById("billing-state").value,
      pincode: document.getElementById("billing-pincode").value.trim(),
      landmark: document.getElementById("billing-landmark").value.trim(),
      type: document.querySelector('input[name="billing-address-type"]:checked').value,
    };

    if (isEditingBillingAddress) {
      const index = billingAddresses.findIndex((a) => a.id == editingBillingAddressId);
      if (index !== -1) {
        billingAddresses[index] = {
          ...billingAddresses[index],
          ...addressData,
        };
        showNotification("Billing address updated successfully!", "success");

        if (selectedBillingAddress && selectedBillingAddress.id == editingBillingAddressId) {
          selectedBillingAddress = billingAddresses[index];
        }
      }
    } else {
      const newAddress = {
        id: Date.now(), // unique ID
        ...addressData,
      };
      billingAddresses.push(newAddress);
      showNotification("Billing address added successfully!", "success");
      selectedBillingAddress = newAddress;

      differentBillingRadio.checked = true;
      billingAddressSelection.style.display = "block";
      sameAddressDisplay.style.display = "none";
    }

    // Save to localStorage
    localStorage.setItem("billingAddresses", JSON.stringify(billingAddresses));

    renderBillingAddresses();
    closeBillingModalFunc();
  }

  // ✅ FIX: Updated deleteAddress function to delete from central addresses list
  function deleteAddress(addressId) {
    if (confirm("Are you sure you want to delete this address?")) {
      const index = savedAddresses.findIndex((a) => a.id == addressId);
      if (index !== -1) {
        savedAddresses.splice(index, 1);
        
        // ✅ FIX: Also delete from central addresses list
        const allAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
        const profileIndex = allAddresses.findIndex((a) => a.id == addressId);
        if (profileIndex !== -1) {
          allAddresses.splice(profileIndex, 1);
          localStorage.setItem("addresses", JSON.stringify(allAddresses));
        }
        
        localStorage.setItem("savedAddresses", JSON.stringify(savedAddresses));
        renderSavedAddresses();
        showNotification("Address deleted successfully!", "success");

        if (selectedShippingAddress && selectedShippingAddress.id == addressId) {
          selectedShippingAddress = null;
          updateDeliveryAddressPreview();
        }
      }
    }
  }

  // ✅ FIX: Updated deleteBillingAddress function
  function deleteBillingAddress(addressId) {
    if (confirm("Are you sure you want to delete this billing address?")) {
      const index = billingAddresses.findIndex((a) => a.id == addressId);
      if (index !== -1) {
        billingAddresses.splice(index, 1);
        localStorage.setItem("billingAddresses", JSON.stringify(billingAddresses));
        renderBillingAddresses();
        showNotification("Billing address deleted successfully!", "success");

        if (selectedBillingAddress && selectedBillingAddress.id == addressId) {
          selectedBillingAddress = null;

          if (differentBillingRadio.checked && billingAddresses.length === 0) {
            setTimeout(() => openAddBillingAddressModal(), 300);
          }
        }
      }
    }
  }

  function processPayment() {
    if (!selectedShippingAddress) {
      showNotification("Please select a delivery address.", "error");
      announceToScreenReader("Please select a delivery address");
      return;
    }

    if (!selectedBillingAddress) {
      showNotification("Please select a billing address.", "error");
      announceToScreenReader("Please select a billing address");
      return;
    }

    if (cartItems.length === 0) {
      showNotification("Your cart is empty.", "error");
      return;
    }

    if (paymentAmount) {
      paymentAmount.textContent = `₹${orderSummary.total.toFixed(2)}`;
    }

    showModal(paymentModal);
    announceToScreenReader("Processing payment");

    setTimeout(() => {
      paymentModal.style.display = "none";
      currentOrder = createOrder();
      setTimeout(() => {
        showSuccessModal(currentOrder);
      }, 300);
    }, 3000);
  }

  function createOrder() {
    if (!currentUser) {
      showNotification("User not logged in.", "error");
      return;
    }

    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const orderId = `AGRI-${timestamp}-${random}`;
    const orderDate = new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const shippingAddr = selectedShippingAddress || savedAddresses.find((a) => a.email === currentUser.email) || null;
    const billingAddr = selectedBillingAddress || billingAddresses.find((a) => a.email === currentUser.email) || shippingAddr;

    if (!shippingAddr || !billingAddr) {
      showNotification("Please select delivery and billing addresses.", "error");
      return;
    }

    const farmerEmails = [...new Set(cartItems.map((item) => item.farmerEmail))];

    const order = {
      id: orderId,
      date: orderDate,
      items: [...cartItems],
      shippingAddress: shippingAddr,
      billingAddress: billingAddr,
      subtotal: orderSummary.subtotal,
      tax: orderSummary.tax,
      total: orderSummary.total,
      status: "confirmed",
      userEmail: currentUser.email,
      farmers: farmerEmails,
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("agrimart_cart");
    localStorage.removeItem("agrimart_order_summary");

    return order;
  }

  function showSuccessModal(order) {
    successOrderId.textContent = order.id;
    successOrderDate.textContent = order.date;

    if (successMessage) {
      successMessage.textContent = `Your payment of ₹${order.total.toFixed(2)} has been processed successfully.`;
    }

    showModal(successModal);
    announceToScreenReader("Payment successful!");
  }

  function showOrderDetailsModal(order) {
    modalOrderId.textContent = order.id;
    modalOrderDate.textContent = order.date;
    modalOrderTotal.textContent = `₹${order.total.toFixed(2)}`;
    document.body.style.overflow = "hidden";

    modalOrderItems.innerHTML = order.items
      .map((item) => {
        const imageSrc = item.image ? item.image : "/images/placeholder.png";
        return `
      <div class="order-item-detail">
        <div class="order-item-image">
          <img   src="${
            item.image && item.image.length
              ? item.image[0].src
              : "/images/no-image.jpg"
          }"  alt="${escapeHtml(item.title)}">
        </div>
        <div class="order-item-info">
          <h4>${escapeHtml(item.title)}</h4>
          <p class="order-item-seller">Sold by: Local Farmer</p>
          <p class="order-item-quantity">Quantity: ${item.quantity}</p>
        </div>
        <div class="order-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `;
      })
      .join("");

    const addr = order.shippingAddress;
    const typeLabel = addr.type === "home" ? "Home Address" : 
                     addr.type === "work" ? "Work Address" : 
                     "Home Address";
    
    modalDeliveryAddress.innerHTML = `
            <p><strong>${typeLabel}</strong></p>
            <p><strong>${escapeHtml(addr.name || "User")}</strong></p>
            <p>${escapeHtml(addr.phone || "")}</p>
            <p>${escapeHtml(addr.address || "")}</p>
            <p>${escapeHtml(addr.city || "")}, ${getStateName(addr.state)} - ${escapeHtml(addr.pincode || "")}</p>
            ${addr.landmark ? `<p>Landmark: ${escapeHtml(addr.landmark)}</p>` : ""}
        `;

    const billingAddr = order.billingAddress;
    const billingTypeLabel = billingAddr.type === "home" ? "Home Address" : 
                           billingAddr.type === "work" ? "Work Address" : 
                           "Home Address";
    
    modalBillingAddress.innerHTML = `
            <p><strong>${billingTypeLabel}</strong></p>
            <p><strong>${escapeHtml(billingAddr.name || "User")}</strong></p>
            <p>${escapeHtml(billingAddr.phone || "")}</p>
            <p>${escapeHtml(billingAddr.address || "")}</p>
            <p>${escapeHtml(billingAddr.city || "")}, ${getStateName(billingAddr.state)} - ${escapeHtml(billingAddr.pincode || "")}</p>
            ${billingAddr.landmark ? `<p>Landmark: ${escapeHtml(billingAddr.landmark)}</p>` : ""}
        `;

    showModal(orderModal);
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.setAttribute("role", "alert");
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${
                  type === "success"
                    ? "check-circle"
                    : type === "error"
                    ? "exclamation-circle"
                    : "info-circle"
                }" aria-hidden="true"></i>
                <span>${escapeHtml(message)}</span>
            </div>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  function announceToScreenReader(message) {
    if (checkoutStatus) {
      checkoutStatus.textContent = message;
      setTimeout(() => {
        checkoutStatus.textContent = "";
      }, 1000);
    }
  }
});