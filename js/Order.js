// Key used in localStorage
const STORAGE_KEY = "agrimart_orders";

// Simple utility to format dates (human-readable)
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

// Sample orders inserted if none exist (demo)
const sampleOrders = [
  {
    id: "ORD-20251008-001",
    createdAt: new Date().toISOString(),
    status: "delivered",
    items: [
      { name: "Organic Tomatoes (1kg)", qty: 2, price: 120 },
      { name: "Millet Flour (2kg)", qty: 1, price: 220 }
    ]
  },
  {
    id: "ORD-20250930-102",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "shipped",
    items: [
      { name: "Cow Ghee (500g)", qty: 1, price: 350 },
      { name: "Green Chillies (250g)", qty: 3, price: 45 }
    ]
  },
  {
    id: "ORD-20250820-548",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    status: "processing",
    items: [
      { name: "Fertilizer A", qty: 1, price: 450 }
    ]
  }
];

// get orders from localStorage, create sample if empty
function getOrders() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleOrders));
    return sampleOrders.slice();
  }
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error("Invalid orders JSON in localStorage:", e);
    return [];
  }
}

function saveOrders(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// rendering
const container = document.getElementById("orders-container");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const clearBtn = document.getElementById("clear-btn");
const exportBtn = document.getElementById("export-btn");

let orders = getOrders();

// helper to compute totals
function orderTotal(order) {
  return order.items.reduce((s, it) => s + it.qty * it.price, 0);
}

function renderOrders(list) {
  container.innerHTML = "";
  if (!list.length) {
    container.innerHTML = `<div class="empty"><strong>No orders found.</strong><br/>Place some orders or clear localStorage to reset samples.</div>`;
    return;
  }

  // show newest first
  list.slice().reverse().forEach(order => {
    const card = document.createElement("article");
    card.className = "order-card";
    card.style.borderLeftColor = order.status === "delivered" ? "var(--accent)" : "transparent";

    card.innerHTML = `
      <div class="order-meta" aria-hidden="true">
        <div class="oid">#${order.id}</div>
        <div class="date">${formatDate(order.createdAt)}</div>
        <div class="status ${order.status}">${order.status}</div>
      </div>

      <div class="order-details">
        <div class="order-title">Order summary</div>
        <ul class="items-list">
          ${order.items.map(it => `<li><span>${it.name} × ${it.qty}</span> <span>₹ ${ (it.price * it.qty).toFixed(2) }</span></li>`).join("")}
        </ul>
        <div class="total-row">Total: ₹ ${orderTotal(order).toFixed(2)}</div>

        <div class="card-actions">
          <button class="action-btn view-details">View details</button>
          <button class="action-btn primary track-order">Track</button>
          <button class="action-btn" data-id="${order.id}" aria-label="Remove order">Remove</button>
        </div>
      </div>
    `;

    // attach action listeners
    card.querySelector(".view-details").addEventListener("click", () => {
      const details = card.querySelector(".items-list");
      if (details.style.display === "none") {
        details.style.display = "";
      } else {
        details.style.display = "none";
      }
    });

    card.querySelector(".track-order").addEventListener("click", () => {
      alert(`Status for ${order.id}: ${order.status.toUpperCase()}`);
    });

    card.querySelectorAll(".action-btn[data-id]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        if (!confirm(`Remove order ${id}? This action cannot be undone.`)) return;
        orders = orders.filter(o => o.id !== id);
        saveOrders(orders);
        runFilters(); // re-render
      });
    });

    container.appendChild(card);
  });
}

// apply search & filter
function runFilters() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const status = statusFilter.value;
  let filtered = orders.filter(o => {
    // match status
    if (status !== "all" && o.status !== status) return false;

    // match search by id or item name
    if (!q) return true;
    if (o.id.toLowerCase().includes(q)) return true;
    const itemMatch = o.items.some(it => it.name.toLowerCase().includes(q));
    if (itemMatch) return true;
    return false;
  });

  renderOrders(filtered);
}

// events
searchInput.addEventListener("input", () => runFilters());
statusFilter.addEventListener("change", () => runFilters());

clearBtn.addEventListener("click", () => {
  if (!confirm("Clear all orders from localStorage?")) return;
  orders = [];
  saveOrders(orders);
  runFilters();
});

exportBtn.addEventListener("click", () => {
  const data = JSON.stringify(orders, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "agrimart_orders.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// initial render
runFilters();
