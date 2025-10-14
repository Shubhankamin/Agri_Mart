
// Cart state
let cart = [];

// Get current user from localStorage
const currentUser = localStorage.getItem("currentUser");
const user = currentUser ? JSON.parse(currentUser) : null;

// Add dynamic navbar links
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

// Load Cart
function loadCart() {
  const savedCart = localStorage.getItem("agrimart_cart");
  if (savedCart) cart = JSON.parse(savedCart);
  updateCartCount();
}

// Update Cart Count
function updateCartCount() {
  const cartCountElem = document.getElementById("cartCount");
  if (!cartCountElem) return;

  const savedCart = localStorage.getItem("agrimart_cart");
  const cartData = savedCart ? JSON.parse(savedCart) : [];
  const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);

  cartCountElem.textContent = totalItems;
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
      <article class="product-card" data-product-id="${product.id}">
    <img src="${product.img[0].src}" alt="${
        product.name
      }" class="product-image" loading="lazy">

        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-footer">
            <span class="product-price">₹${product.price.toFixed(2)}</span>
            <button class="add-to-cart-btn" onclick="addToCart(${
              product.id
            })" aria-label="Add ${product.name} to cart">
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
function setupEventListeners() {
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdown = document.querySelector(".dropdown");

  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("Dropdown toggle clicked");
      dropdown.classList.toggle("active");
    });
    document.addEventListener("click", () =>
      dropdown.classList.remove("active")
    );
    document.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const category = item.getAttribute("data-filter");
        window.location.href = `products.html?category=${category}`;
      });
    });
  }

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-filter");
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      renderProducts(category);
    });
  });

  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", () => {
      // navLinks.classList.toggle("active");
      const expanded =
        mobileMenuToggle.getAttribute("aria-expanded") === "true";
      mobileMenuToggle.setAttribute("aria-expanded", !expanded);
    });
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
  setupEventListeners();

  // Contact form setup only if exists
  if (document.getElementById("contactForm")) setupContactForm();
});
