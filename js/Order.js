// --- SHARED NAVIGATION & CART LOGIC ---

// Get current user from localStorage
const currentUser = localStorage.getItem("currentUser");
const user = currentUser ? JSON.parse(currentUser) : null;

// Add dynamic navbar links
function setupDynamicLinks() {
  const containers = document.querySelectorAll(".dynamic-links");
  if (containers.length === 0) return;

  containers.forEach(container => {
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

// Update Cart Count
function updateCartCount() {
  const cartCountElem = document.getElementById("cartCount");
  const mobileCartCountElem = document.getElementById("mobileCartCount");
  if (!cartCountElem || !mobileCartCountElem) return;

  const savedCart = localStorage.getItem("agrimart_cart");
  const cartData = savedCart ? JSON.parse(savedCart) : [];
  const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);

  cartCountElem.textContent = totalItems;
  mobileCartCountElem.textContent = totalItems;
}

// Setup Event Listeners for Navigation
function setupNavigationEventListeners() {
  // --- DROPDOWN LOGIC FOR BOTH DESKTOP & MOBILE ---
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const dropdown = toggle.closest(".dropdown");
      if (dropdown) {
        document.querySelectorAll(".dropdown.active").forEach(openDropdown => {
          if (openDropdown !== dropdown) openDropdown.classList.remove("active");
        });
        dropdown.classList.toggle("active");
      }
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.active").forEach(dropdown => {
      dropdown.classList.remove("active");
    });
  });

  // --- MOBILE MENU TOGGLE LOGIC ---
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileCloseBtn = document.querySelector(".mobile-close-btn"); // Get the new close button
  const body = document.body;

  if (mobileMenuToggle && navLinks && mobileOverlay) {
    const toggleMenu = () => {
      mobileMenuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
      body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
    };
    mobileMenuToggle.addEventListener("click", toggleMenu);
    mobileOverlay.addEventListener("click", toggleMenu);
    if (mobileCloseBtn) { // Add listener for the close button
      mobileCloseBtn.addEventListener("click", toggleMenu);
    }
  }
}

// --- MAIN INITIALIZATION SCRIPT ---

document.addEventListener("DOMContentLoaded", () => {
  // Initialize shared components on the page
  setupDynamicLinks();
  updateCartCount();
  setupNavigationEventListeners(); 

  // --- ORDERS PAGE SPECIFIC LOGIC ---
  const ordersContainer = document.getElementById("orders-container");
  const statusFilter = document.getElementById("status-filter");
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-btn");

  if (ordersContainer && statusFilter && searchInput && clearBtn) {
    const sampleOrders = [
      { id: "ORD-001", date: "2025-10-01", status: "delivered", items: [{ name: "Organic Apples", qty: 3, price: "₹300" }, { name: "Fresh Spinach Bunch", qty: 2, price: "₹80" }], total: "₹460" },
      { id: "ORD-002", date: "2025-09-27", status: "processing", items: [{ name: "Wheat Flour (1kg)", qty: 5, price: "₹200" }, { name: "Tomatoes (1kg)", qty: 2, price: "₹120" }], total: "₹320" },
      { id: "ORD-003", date: "2025-09-20", status: "shipped", items: [{ name: "Organic Bananas (1 dozen)", qty: 2, price: "₹150" }], total: "₹300" },
      { id: "ORD-004", date: "2025-08-29", status: "cancelled", items: [{ name: "Rice (5kg)", qty: 1, price: "₹350" }, { name: "Carrots (1kg)", qty: 3, price: "₹180" }], total: "₹530" },
    ];
    let orders = JSON.parse(localStorage.getItem("orders")) || sampleOrders;

    function saveOrders() {
      localStorage.setItem("orders", JSON.stringify(orders));
    }

    function renderOrders(filter = "all", search = "") {
      ordersContainer.innerHTML = "";
      const filteredOrders = orders.filter(order => {
        const matchesStatus = filter === "all" || order.status === filter;
        const matchesSearch = search
          ? order.id.toLowerCase().includes(search.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
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
              ${order.items.map(item => `<li><span>${item.name} (x${item.qty})</span><span>${item.price}</span></li>`).join("")}
            </ul>
            <div class="total-row">Total: ${order.total}</div>
          </div>`;
        ordersContainer.appendChild(orderEl);
      });
    }

    statusFilter.addEventListener("change", e => renderOrders(e.target.value, searchInput.value));
    searchInput.addEventListener("input", e => renderOrders(statusFilter.value, e.target.value));
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all orders?")) {
        orders = [];
        saveOrders();
        renderOrders();
      }
    });

    // Modal for order details
    const modal = document.createElement("div");
    modal.id = "order-modal";
    modal.style.cssText = "display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:1000;";
    modal.innerHTML = `<div style="background:#fff;padding:20px;border-radius:8px;max-width:400px;width:90%;position:relative;">
      <span id="modal-close" style="position:absolute;top:10px;right:15px;cursor:pointer;font-size:18px;font-weight:bold;">&times;</span>
      <div id="modal-content"></div></div>`;
    document.body.appendChild(modal);

    const modalContent = document.getElementById("modal-content");
    const modalClose = document.getElementById("modal-close");

    modalClose.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

    ordersContainer.addEventListener("click", e => {
      if (e.target.classList.contains("view-btn")) {
        const orderId = e.target.closest(".order-card").querySelector(".oid").textContent;
        const order = orders.find(o => o.id === orderId);
        modalContent.innerHTML = `
          <h3>Order ${order.id}</h3>
          <p><strong>Date:</strong> ${order.date}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Items:</strong></p>
          <ul>
            ${order.items.map(i => `<li>${i.name} x${i.qty} - ${i.price}</li>`).join("")}
          </ul>
          <p><strong>Total:</strong> ${order.total}</p>`;
        modal.style.display = "flex";
      }
    });

    renderOrders();
  }
});
