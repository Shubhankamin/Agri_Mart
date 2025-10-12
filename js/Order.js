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
    filter === "all"
      ? products
      : products.filter((p) => p.category === filter);

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
      <article class="product-card" data-product-id="${product.id}">
        <img src="${product.img}" alt="${product.name}" class="product-image" loading="lazy">
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
      dropdown.classList.toggle("active");
    });
    document.addEventListener("click", () => dropdown.classList.remove("active"));
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
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      renderProducts(category);
    });
  });

  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const expanded = mobileMenuToggle.getAttribute("aria-expanded") === "true";
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

document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("orders-container");
  const statusFilter = document.getElementById("status-filter");
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-btn");

  // Default sample orders (farm products)
const sampleOrders = [
  {
    id: "ORD-001",
    date: "2025-10-01",
    status: "delivered",
    items: [
      { name: "Organic Apples", qty: 3, price: "₹300" },
      { name: "Fresh Spinach Bunch", qty: 2, price: "₹80" },
    ],
    total: "₹460",
  },
  {
    id: "ORD-002",
    date: "2025-09-27",
    status: "processing",
    items: [
      { name: "Wheat Flour (1kg)", qty: 5, price: "₹200" },
      { name: "Tomatoes (1kg)", qty: 2, price: "₹120" },
    ],
    total: "₹320",
  },
  {
    id: "ORD-003",
    date: "2025-09-20",
    status: "shipped",
    items: [
      { name: "Organic Bananas (1 dozen)", qty: 2, price: "₹150" },
    ],
    total: "₹300",
  },
  {
    id: "ORD-004",
    date: "2025-08-29",
    status: "cancelled",
    items: [
      { name: "Rice (5kg)", qty: 1, price: "₹350" },
      { name: "Carrots (1kg)", qty: 3, price: "₹180" },
    ],
    total: "₹530",
  },
];

  // Load from localStorage or use sample
  let orders = JSON.parse(localStorage.getItem("orders")) || sampleOrders;

  function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  // Render orders
  function renderOrders(filter = "all", search = "") {
    ordersContainer.innerHTML = "";

    const filteredOrders = orders.filter(order => {
      const matchesStatus = filter === "all" ? true : order.status === filter;
      const matchesSearch = search
        ? order.id.toLowerCase().includes(search.toLowerCase()) ||
          order.items.some(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
        : true;
      return matchesStatus && matchesSearch;
    });

    if (filteredOrders.length === 0) {
      ordersContainer.innerHTML = `<div class="empty"><p>No orders found.</p></div>`;
      return;
    }

    filteredOrders.forEach(order => {
      const orderEl = document.createElement("div");
      orderEl.classList.add("order-card");
      orderEl.innerHTML = `
        <div class="order-meta">
          <div class="oid">${order.id}</div>
          <span class="date">${order.date}</span>
          <span class="status ${order.status}">${order.status}</span>
          <div class="card-actions-inline">
            <button class="view-btn">View</button>
          </div>
        </div>

        <div class="order-details">
          <div class="order-title">Order Details</div>
          <ul class="items-list">
            ${order.items
              .map(
                item =>
                  `<li><span>${item.name} (x${item.qty})</span><span>${item.price}</span></li>`
              )
              .join("")}
          </ul>
          <div class="total-row">Total: ${order.total}</div>
        </div>
      `;
      ordersContainer.appendChild(orderEl);
    });
  }

  // Filter change
  statusFilter.addEventListener("change", e => {
    renderOrders(e.target.value, searchInput.value);
  });

  // Search
  searchInput.addEventListener("input", e => {
    renderOrders(statusFilter.value, e.target.value);
  });

  // Clear all orders
  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all orders?")) {
      orders = [];
      saveOrders();
      renderOrders();
    }
  });

  // Create modal element
  const modal = document.createElement("div");
  modal.id = "order-modal";
  modal.style.display = "none";
  modal.style.position = "fixed";
  modal.style.top = 0;
  modal.style.left = 0;
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.background = "rgba(0,0,0,0.5)";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = 1000;
  modal.innerHTML = `
    <div style="background:#fff;padding:20px;border-radius:8px;max-width:400px;width:90%;position:relative;">
      <span id="modal-close" style="position:absolute;top:10px;right:15px;cursor:pointer;font-size:18px;font-weight:bold;">&times;</span>
      <div id="modal-content"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  // Close modal
  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Click outside modal to close
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  // View button click -> show modal
  ordersContainer.addEventListener("click", e => {
    if (e.target.classList.contains("view-btn")) {
      const orderId = e.target.closest(".order-card").querySelector(".oid")
        .textContent;
      const order = orders.find(o => o.id === orderId);
      modalContent.innerHTML = `
        <h3>Order ${order.id}</h3>
        <p><strong>Date:</strong> ${order.date}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${order.items
            .map(i => `<li>${i.name} x${i.qty} - ${i.price}</li>`)
            .join("")}
        </ul>
        <p><strong>Total:</strong> ${order.total}</p>
      `;
      modal.style.display = "flex";
    }
  });

  // Initial render
  renderOrders();
});
