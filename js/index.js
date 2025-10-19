// Cart state
let cart = [];

// Get current user from localStorage
// const currentUser = localStorage.getItem("currentUser");
// const user = currentUser ? JSON.parse(currentUser) : null;
// common.js
function truncateText(text, maxLength = 55) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// Add dynamic navbar links
function setupDynamicLinks() {
  const containers = document.querySelectorAll(".dynamic-links");
  if (containers.length === 0) return;

  containers.forEach((container) => {
    container.innerHTML = ""; // Clear existing links
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
  });
}

// Load Cart
function loadCart() {
  const savedCart = localStorage.getItem("agrimart_cart");
  if (savedCart) cart = JSON.parse(savedCart);
  updateCartCount();
}

// Update Cart Count
function updateNavbarCartCount() {
  const navCartCount = document.getElementById("cart-count");
  const mobileCartCount = document.getElementById("mobileCartCount");

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (navCartCount) navCartCount.textContent = totalItems;
  if (mobileCartCount) mobileCartCount.textContent = totalItems;
}

function goToProductDetails(id) {
  window.location.href = `/product_details.html?id=${id}`;
}

function updateProfileUI() {
  const desktopProfile = document.querySelector(".profile-link img");
  const mobileUserName = document.getElementById("mobileUserName");
  const mobileUserEmail = document.getElementById("mobileUserEmail");

  if (user) {
    // Logged-in user
    if (desktopProfile) {
      desktopProfile.src = user.image || "/Images/Profile.png"; // fallback image
      desktopProfile.alt = user.name || "Profile";
    }
    if (mobileUserName) {
      mobileUserName.textContent = user.name || "User";
    }
    if (mobileUserEmail) {
      mobileUserEmail.textContent = user.email || "No email provided";
    }
  } else {
    // Guest user
    if (desktopProfile) {
      desktopProfile.src = "/Images/Profile.png";
      desktopProfile.alt = "Guest";
    }
    if (mobileUserName) {
      mobileUserName.textContent = "Guest User";
    }
    if (mobileUserEmail) {
      mobileUserEmail.textContent = "Login or Sign Up";
    }
  }
}
function filterProducts(category, btn) {
  // Remove 'active' class from all buttons
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));

  // Add 'active' class to clicked button
  btn.classList.add("active");

  // Render products based on selected category
  renderProducts(category);

  // Smooth scroll to products section
  const productsSection = document.getElementById("products");
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Render Products (only on pages with #productsGrid)
function renderProducts(filter = "all") {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) return; // skip if no products grid

  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
 <article class="product-card" data-product-id="${
   product.id
 }" onclick="goToProductDetails(${product.id})">
     <img src="${product.img[0].src}" alt="${
        product.name
      }" class="product-image" loading="lazy">

        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
 <p class="product-description">${truncateText(
   product.description
 )}</p>          <div class="product-footer">
            <span class="product-price">₹${product.price.toFixed(2)}</span>
            <button class="add-to-cart-btn" onclick="goToProductDetails(${
              product.id
            })" aria-label="View ${product.name}">
            
              View Product
            </button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

// Add to Cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) existingItem.quantity += 1;
  else cart.push({ ...product, quantity: 1 });

  saveCart();
  updateCartCount();
  showNotification();
}

function saveCart() {
  localStorage.setItem("agrimart_cart", JSON.stringify(cart));
}

function showNotification() {
  const notification = document.getElementById("cartNotification");
  if (!notification) return;

  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 2000);
}

// Setup Event Listeners (only elements that exist)
function setupNavigationEventListeners() {
  // --- Dropdown logic (desktop & mobile) ---
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const dropdown = toggle.closest(".dropdown");
      document.querySelectorAll(".dropdown.active").forEach((open) => {
        if (open !== dropdown) open.classList.remove("active");
      });
      dropdown.classList.toggle("active");
    });
  });

  // ✅ CATEGORY CLICK HANDLER (for dropdown items)
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // prevent dropdown from closing before click registers
      const category = item.getAttribute("data-filter");
      if (category) {
        window.location.href = `products.html?category=${encodeURIComponent(
          category
        )}`;
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".dropdown.active")
      .forEach((dropdown) => dropdown.classList.remove("active"));
  });

  // --- MOBILE MENU TOGGLE LOGIC ---
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");
  const mobileOverlay = document.getElementById("mobileOverlay");

  if (mobileMenuToggle && navLinks && mobileOverlay) {
    const toggleMenu = () => {
      mobileMenuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
      mobileOverlay.classList.toggle("active");

      document.body.style.overflow = navLinks.classList.contains("active")
        ? "hidden"
        : "auto";
    };

    mobileMenuToggle.addEventListener("click", toggleMenu);
    mobileOverlay.addEventListener("click", toggleMenu);
  }
}

// ------------------------
// Initialize all JS safely
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  setupDynamicLinks();
  updateCartCount();
  renderProducts("all"); // only renders if #productsGrid exists
  // setupEventListeners();
  setupNavigationEventListeners();
  updateProfileUI();

  // Contact form setup only if exists
  if (document.getElementById("contactForm")) setupContactForm();
});
