document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("orders-container");
  const statusFilter = document.getElementById("status-filter");
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-btn");

  // Default sample orders
  const sampleOrders = [
    {
      id: "ORD-001",
      date: "2025-10-01",
      status: "delivered",
      items: [
        { name: "Organic Fertilizer", qty: 2, price: "₹1200" },
        { name: "Tractor Engine Oil", qty: 1, price: "₹850" },
      ],
      total: "₹3,250",
    },
    {
      id: "ORD-002",
      date: "2025-09-27",
      status: "processing",
      items: [
        { name: "Hybrid Seeds Pack", qty: 4, price: "₹1,000" },
        { name: "Pesticide Spray", qty: 1, price: "₹480" },
      ],
      total: "₹2,480",
    },
    {
      id: "ORD-003",
      date: "2025-09-20",
      status: "shipped",
      items: [
        { name: "Drip Irrigation Kit", qty: 1, price: "₹3,200" },
      ],
      total: "₹3,200",
    },
    {
      id: "ORD-004",
      date: "2025-08-29",
      status: "cancelled",
      items: [
        { name: "Solar Water Pump", qty: 1, price: "₹12,500" },
      ],
      total: "₹12,500",
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
          order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
        : true;
      return matchesStatus && matchesSearch;
    });

    if (filteredOrders.length === 0) {
      ordersContainer.innerHTML = `
        <div class="empty"><p>No orders found.</p></div>`;
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
        </div>

        <div class="order-details">
          <div class="order-title">Order Details</div>
          <ul class="items-list">
            ${order.items.map(item => `
              <li><span>${item.name} (x${item.qty})</span><span>${item.price}</span></li>
            `).join("")}
          </ul>
          <div class="total-row">Total: ${order.total}</div>

          <div class="card-actions">
            <button class="action-btn primary">View</button>
          </div>
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
    if (e.target.classList.contains("primary")) {
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
        <p><strong>Total:</strong> ${order.total}</p>
      `;
      modal.style.display = "flex";
    }
  });

  // Initial render
  renderOrders();
});
