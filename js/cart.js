document.addEventListener("DOMContentLoaded", function () {
  // ⭐ Get current user - BUT DON'T BLOCK GUEST USERS
  const currentUser = localStorage.getItem("currentUser");
  const user = currentUser ? JSON.parse(currentUser) : null;

  // ⭐ Setup Mobile Menu & Dynamic Links - SAME AS INDEX PAGE
  setupMobileMenu();
  setupDynamicLinks();
  setupDropdown();

  // ⭐ NO LOGIN CHECK HERE - GUESTS CAN VIEW CART
  // Show guest banner if not logged in
  if (!user) {
    showGuestBanner();
  }

  // Cart data - initially empty; will load from localStorage
  const cartItems = [];

  // DOM Elements
  const cartItemsContainer = document.getElementById("cart-items-section");
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartCount = document.getElementById("cart-count");
  const itemsCount = document.getElementById("items-count");
  const confirmationModal = document.getElementById("confirmation-modal");
  const confirmRemoveBtn = document.getElementById("confirm-remove");
  const cancelRemoveBtn = document.getElementById("cancel-remove");
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const orderSummary = document.querySelector(".order-summary");
  const cartStatus = document.getElementById("cart-status");

  // Variables
  let itemToRemove = null;
  let focusedElementBeforeModal = null;

  // Load cart from localStorage
  loadCartFromStorage();

  // Read product ID & quantity from query
  const params = new URLSearchParams(window.location.search);
  const newProductId = parseInt(params.get("id"));
  const newProductQty = parseInt(params.get("qty")) || 1;

  // If product exists in query, add to cart
  if (newProductId) {
    const product = products.find((p) => p.id === newProductId);
    if (product) {
      const productPrice = parseFloat(product.price) || 0;

      const newCartItem = {
        id: product.id,
        title: product.name || product.title || "Unnamed Product",
        description:
          product.description || product.desc || "No description available.",
        price: parseFloat(
          product.price || product.cost || product.newPrice || 0
        ),
        quantity: newProductQty,
        image:
          (product.images && product.images[0] && product.images[0].url) ||
          product.image ||
          product.img ||
          "assets/default-image.jpg",
        farmerEmail: product.farmerEmail || "",
        inStock: product.stock ? product.stock > 0 : true,
        onSale: product.onSale || false,
      };

      const existingIndex = cartItems.findIndex(
        (item) => item.id === newCartItem.id
      );

      if (existingIndex !== -1) {
        cartItems[existingIndex].quantity += newProductQty;
      } else {
        cartItems.push(newCartItem);
      }

      saveCartToStorage();
      renderCartItems();
      updateCartSummary();
    }
  }

  // Render cart and update summary
  renderCartItems();
  updateCartSummary();

  // Keyboard navigation - Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && confirmationModal.style.display === "flex") {
      hideConfirmationModal();
    }
  });

  // Close modal on backdrop click
  if (confirmationModal) {
    confirmationModal.addEventListener("click", function (e) {
      if (e.target === confirmationModal) {
        hideConfirmationModal();
      }
    });
  }

  // ⭐ Show Guest Banner
  function showGuestBanner() {
    const cartContainer = document.querySelector(".container");
    if (!cartContainer) return;

    const banner = document.createElement("div");
    banner.className = "guest-banner";

    banner.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f0ad4e" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <p>
        👋 You're shopping as a <strong>guest</strong>. 
        <a href="/login.html">Login</a> 
        or 
        <a href="/signup.html">Sign up</a> 
        to track your orders and get exclusive deals!
      </p>
    `;

    cartContainer.insertBefore(banner, cartContainer.firstChild);
  }

  // Load cart from localStorage
  function loadCartFromStorage() {
    const savedCart = localStorage.getItem("agrimart_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        cartItems.length = 0;
        cartItems.push(...parsedCart);
      } catch (e) {
        console.error("Error loading cart from storage:", e);
      }
    }
  }

  // Save cart to localStorage
  function saveCartToStorage() {
    try {
      localStorage.setItem("agrimart_cart", JSON.stringify(cartItems));
      updateNavbarCartCount();
    } catch (e) {
      console.error("Error saving cart to storage:", e);
    }
  }

  // ⭐ Update navbar cart count
  function updateNavbarCartCount() {
    const navCartCount = document.getElementById("cart-count");
    const mobileCartCount = document.getElementById("mobileCartCount");
    
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (navCartCount) navCartCount.textContent = totalItems;
    if (mobileCartCount) mobileCartCount.textContent = totalItems;
  }

  // Render cart items
  function renderCartItems() {
    if (cartItems.length === 0) {
      cartItemsContainer.style.display = "none";
      if (orderSummary) orderSummary.style.display = "none";
      emptyCartMessage.style.display = "block";
      return;
    }

    cartItemsContainer.style.display = "block";
    if (orderSummary) orderSummary.style.display = "block";
    emptyCartMessage.style.display = "none";

    cartItemsContainer.innerHTML = `
    <div class="cart-items-header">
        <h2>Cart Items</h2>
    </div>
  `;

    cartItems.forEach((item) => {
      const itemElement = document.createElement("article");
      itemElement.className = "cart-item";
      itemElement.dataset.id = item.id;
      itemElement.setAttribute(
        "aria-label",
        `${item.title}, quantity ${item.quantity}, price ₹${Number(
          item.price || 0
        ).toFixed(2)}`
      );

      // Use first image from array
      const imageSrc =
        Array.isArray(item.image) && item.image.length > 0
          ? item.image[0].src
          : "assets/default-image.jpg"; // fallback if array empty

      itemElement.innerHTML = `
      <div class="item-image">
        <img src="${imageSrc}" 
             alt="${escapeHtml(item.title)}" 
             loading="lazy">
      </div>
      <div class="item-details">
          <h3 class="item-title">${escapeHtml(item.title)}</h3>
          <p class="item-description">${escapeHtml(item.description)}</p>
          <div class="item-price" aria-label="Price ₹${(
            item.price || 0
          ).toFixed(2)}">
            ₹${(item.price || 0).toFixed(2)}
          </div>

          <div class="item-controls">
              <div class="quantity-controls" role="group" aria-label="Quantity controls for ${escapeHtml(
                item.title
              )}">
                  <button class="quantity-btn minus" 
                          aria-label="Decrease quantity" 
                          data-id="${item.id}"
                          ${item.quantity <= 1 ? "disabled" : ""}>-</button>
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
                          ${item.quantity >= 99 ? "disabled" : ""}>+</button>
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

    addEventListeners();
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

  // Add event listeners with event delegation
  function addEventListeners() {
    cartItemsContainer.addEventListener("click", handleCartInteraction);
    cartItemsContainer.addEventListener("change", handleQuantityChange);
    cartItemsContainer.addEventListener("keydown", handleKeyboardNavigation);
  }

  function handleCartInteraction(e) {
    const plusBtn = e.target.closest(".plus");
    const minusBtn = e.target.closest(".minus");
    const removeBtn = e.target.closest(".remove-btn");

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

  function handleQuantityChange(e) {
    if (e.target.classList.contains("quantity-input")) {
      const itemId = parseInt(e.target.dataset.id);
      const newQuantity = parseInt(e.target.value);

      if (newQuantity >= 1 && newQuantity <= 99) {
        const item = cartItems.find((item) => item.id === itemId);
        if (item) {
          item.quantity = newQuantity;
          saveCartToStorage();
          renderCartItems();
          updateCartSummary();
          announceToScreenReader(`Quantity updated to ${newQuantity}`);
        }
      } else {
        renderCartItems();
      }
    }
  }

  function handleKeyboardNavigation(e) {
    if (e.key === "Enter") {
      const button = e.target.closest("button");
      if (button) button.click();
    }
  }

  function updateQuantity(itemId, change) {
    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      item.quantity = newQuantity;
      saveCartToStorage();
      renderCartItems();
      updateCartSummary();
      const action = change > 0 ? "increased" : "decreased";
      announceToScreenReader(`Quantity ${action} to ${newQuantity}`);
    }
  }

  function showConfirmationModal() {
    if (!confirmationModal) return;
    focusedElementBeforeModal = document.activeElement;
    confirmationModal.style.display = "flex";
    setTimeout(() => confirmRemoveBtn && confirmRemoveBtn.focus(), 100);
    trapFocus(confirmationModal);
  }

  function hideConfirmationModal() {
    if (!confirmationModal) return;
    confirmationModal.style.display = "none";
    itemToRemove = null;
    if (focusedElementBeforeModal) focusedElementBeforeModal.focus();
  }

  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener("keydown", function (e) {
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
    });
  }

  if (confirmRemoveBtn) {
    confirmRemoveBtn.addEventListener("click", function () {
      if (itemToRemove) {
        const itemIndex = cartItems.findIndex(
          (item) => item.id === itemToRemove
        );
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
  }

  if (cancelRemoveBtn) {
    cancelRemoveBtn.addEventListener("click", hideConfirmationModal);
  }

  function updateCartSummary() {
    let subtotal = 0;
    let itemCount = cartItems.length; // count distinct items

    cartItems.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `₹${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `₹${total.toFixed(2)}`;
    if (cartCount) cartCount.textContent = itemCount;

    const itemText = itemCount === 1 ? "item" : "items";
    if (itemsCount) itemsCount.textContent = `${itemCount} ${itemText} in your cart`;
    if (cartCount) cartCount.setAttribute("aria-label", `${itemCount} ${itemText} in cart`);
  }

  function announceToScreenReader(message) {
    if (cartStatus) {
      cartStatus.textContent = message;
      setTimeout(() => {
        cartStatus.textContent = "";
      }, 1000);
    }
  }

  // ⭐ CHECKOUT BUTTON - ONLY HERE WE CHECK LOGIN
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      // Check if cart is empty
      if (cartItems.length === 0) {
        e.preventDefault();
        announceToScreenReader(
          "Your cart is empty. Please add items before checkout."
        );
        alert(
          "Your cart is empty. Please add items before proceeding to checkout."
        );
        return;
      }

      // ⭐ CHECK IF USER IS LOGGED IN
      if (!user) {
        e.preventDefault();
        
        const shouldLogin = confirm(
          "Please login to complete your purchase.\n\nWould you like to login now?"
        );

        if (shouldLogin) {
          // Save redirect URL so user comes back to cart after login
          localStorage.setItem("redirectAfterLogin", "/cart.html");
          window.location.href = "/login.html";
        }
        return;
      }

      // User is logged in - proceed to checkout
      try {
        localStorage.setItem("agrimart_cart", JSON.stringify(cartItems));

        let subtotal = 0;
        cartItems.forEach((item) => {
          subtotal += item.price * item.quantity;
        });

        const orderSummary = {
          subtotal: subtotal,
          tax: subtotal * 0.05,
          total: subtotal + subtotal * 0.05,
          itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        };

        localStorage.setItem(
          "agrimart_order_summary",
          JSON.stringify(orderSummary)
        );

        announceToScreenReader("Proceeding to checkout");
        
        // Allow navigation to checkout page
        window.location.href = "/checkout.html";
      } catch (error) {
        console.error("Error saving cart data:", error);
        alert("There was an error. Please try again.");
        e.preventDefault();
      }
    });
  }

  // ===== MOBILE MENU SETUP - SAME AS INDEX PAGE =====
  function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');

    if (!mobileMenuToggle || !navLinks) return;

    function toggleMenu() {
      const isActive = navLinks.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      mobileOverlay?.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
      mobileMenuToggle.setAttribute('aria-expanded', isActive);
    }

    function closeMenu() {
      navLinks.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      mobileOverlay?.classList.remove('active');
      document.body.style.overflow = '';
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }

    mobileMenuToggle.addEventListener('click', toggleMenu);
    mobileOverlay?.addEventListener('click', closeMenu);
    mobileCloseBtn?.addEventListener('click', closeMenu);

    navLinks.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    const mobileProfile = document.querySelector('.mobile-profile-section');
    if (mobileProfile) {
      mobileProfile.style.cursor = 'pointer';
      mobileProfile.addEventListener('click', () => {
        closeMenu();
        if (!user) {
          window.location.href = '/login.html';
        } else {
          window.location.href = '/profile.html';
        }
      });
    }

    // Update user info
    if (user) {
      const mobileUserName = document.getElementById('mobileUserName');
      const mobileUserEmail = document.getElementById('mobileUserEmail');
      if (mobileUserName) mobileUserName.textContent = user.name || 'User';
      if (mobileUserEmail) mobileUserEmail.textContent = user.email || '';
    } else {
      const mobileUserName = document.getElementById('mobileUserName');
      const mobileUserEmail = document.getElementById('mobileUserEmail');
      if (mobileUserName) mobileUserName.textContent = 'Guest User';
      if (mobileUserEmail) mobileUserEmail.textContent = 'Tap to login';
    }

    // Sync cart counts
    const mobileCartCount = document.getElementById('mobileCartCount');
    if (mobileCartCount) {
      const observer = new MutationObserver(() => {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) mobileCartCount.textContent = cartCount.textContent;
      });
      const cartCount = document.getElementById('cart-count');
      if (cartCount) {
        observer.observe(cartCount, { childList: true, characterData: true, subtree: true });
        mobileCartCount.textContent = cartCount.textContent;
      }
    }
  }

  // ===== SETUP DYNAMIC LINKS - SAME AS INDEX PAGE =====
  function setupDynamicLinks() {
    const container = document.querySelector(".dynamic-links");
    if (!container) return;

    container.innerHTML = "";

    const productsLink = document.createElement("a");
    productsLink.href = "/products.html";
    productsLink.className = "nav-link";
    productsLink.textContent = "Products";
    container.appendChild(productsLink);

    if (user && user.role === "farmer") {
      const sellLink = document.createElement("a");
      sellLink.href = "/sell.html";
      sellLink.className = "nav-link";
      sellLink.textContent = "Sell";
      container.appendChild(sellLink);
    }
  }

  // ===== DROPDOWN FUNCTIONALITY =====
  function setupDropdown() {
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isExpanded = dropdownToggle.getAttribute("aria-expanded") === "true";
        dropdownToggle.setAttribute("aria-expanded", !isExpanded);
        dropdownMenu.classList.toggle("show");
      });

      document.addEventListener("click", () => {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.classList.remove("show");
      });

      document.querySelectorAll(".dropdown-item").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const category = item.getAttribute("data-filter");
          window.location.href = `/products.html?category=${category}`;
        });
      });
    }
  }

  // Log for debugging
  console.log("🛒 Cart Page: Guest users can view and manage cart!");
  console.log("Current user:", user ? user.email : "Guest");
});