const sidebarMenu = document.getElementById("sidebarMenu");
const snackbar = document.getElementById("snackbar");

// Get user info
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const users = JSON.parse(localStorage.getItem("users")) || [];

if (!currentUser) {
  showSnackbar("Please login first", "error");
  setTimeout(() => (window.location.href = "login.html"), 1000);
}

// Find full user details from users array
let user = users.find((u) => u.email === currentUser.email);

if (!user) {
  showSnackbar("User not found!", "error");
  setTimeout(() => (window.location.href = "login.html"), 1000);
}

// Sidebar items based on role
const menuItems = [
  "Personal Information",
  user?.role === "farmer" ? "Sales History" : "My Orders",
  "Manage Address",
  "Password Manager",
  "Logout",
];

// Content sections for each tab
const contentSections = {
  "Personal Information": `
<form id="profileForm" class="profile-form">
  <div class="form-row">
    <div class="form-group">
      <label>First Name *</label>
      <input type="text" id="firstName" placeholder="Leslie" required readonly />
    </div>
    <div class="form-group">
      <label>Last Name *</label>
      <input type="text" id="lastName" placeholder="Cooper" required readonly />
    </div>
  </div>

  <div class="form-group">
    <label>Email *</label>
    <input type="email" id="email" placeholder="example@gmail.com" required readonly />
  </div>

  <div class="form-group">
    <label>Phone *</label>
    <input type="tel" id="phone" placeholder="+91" required readonly />
  </div>

  <div class="form-group">
    <label>Gender *</label>
    <div class="gender-options">
      <label>
        <input type="radio" name="gender" value="Male" disabled /> <span>Male</span>
      </label>
      <label>
        <input type="radio" name="gender" value="Female" disabled /> <span>Female</span>
      </label>
    </div>
  </div>

  <button type="button" id="editBtn" class="update-btn">Edit</button>
</form>
  `,

  "Manage Address": `
<div id="manageAddressContainer">
  <!-- Add new address block -->
  <div id="addAddressBtn" class="add-address-btn" style="cursor:pointer; padding:10px; border:1px dashed #aaa; text-align:center; width:200px; border-radius:5px; margin-bottom:20px;">
    ➕ Add New Address
  </div>

  <!-- Container to display saved addresses -->
  <div id="addressList"></div>

  <!-- Hidden modal/dialog for adding address -->
  <div id="addressModal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); justify-content:center; align-items:center;">
    <div style="background:#fff; padding:20px; border-radius:10px; min-width:400px; position:relative;">
      <span id="closeModal" style="position:absolute; right:10px; top:10px; cursor:pointer;">✖</span>
      <form id="addressFormModal" class="address-form">
        <div class="form-group">
          <label>Address *</label>
          <textarea id="modalAddress" placeholder="House/Flat No., Building, Street, Area" required></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>City *</label>
            <input type="text" id="modalCity" placeholder="Enter your city" required />
          </div>
          <div class="form-group">
            <label>State *</label>
            <select id="modalState" required>
              <option value="">Select State</option>
              <option>Karnataka</option>
              <option>Maharashtra</option>
              <option>Tamil Nadu</option>
              <option>Kerala</option>
              <option>Delhi</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>PIN Code *</label>
            <input type="text" id="modalPincode" placeholder="6-digit PIN code" required />
          </div>
          <div class="form-group">
            <label>Landmark (Optional)</label>
            <input type="text" id="modalLandmark" placeholder="Nearby landmark" />
          </div>
        </div>
        <div class="form-group">
          <label>Address Type</label>
          <div class="address-type">
            <button type="button" class="type-btn active" data-type="Home">🏠 Home</button>
            <button type="button" class="type-btn" data-type="Work">🏢 Work</button>
          </div>
        </div>
        <button type="submit" class="update-btn">Save Address</button>
      </form>
    </div>
  </div>
</div>
`,
  "Password Manager": `
    <form id="passwordForm" class="password-form">
      <div class="form-group">
        <label>Old Password *</label>
        <input type="password" id="oldPassword" placeholder="Enter old password" required />
      </div>

      <div class="form-group">
        <label>New Password *</label>
        <input type="password" id="newPassword" placeholder="Enter new password" required />
      </div>

      <button type="submit" class="update-btn">Update Password</button>
    </form>
  `,
};

const contentContainer = document.querySelector(".content");

// Render sidebar buttons
menuItems.forEach((item, index) => {
  const btn = document.createElement("button");
  btn.textContent = item;
  if (index === 0) btn.classList.add("active");
  btn.addEventListener("click", () => handleTabClick(item, btn));
  sidebarMenu.appendChild(btn);
});

// Handle tab switching
// Handle tab switching
function handleTabClick(tabName, clickedBtn) {
  sidebarMenu
    .querySelectorAll("button")
    .forEach((b) => b.classList.remove("active"));
  clickedBtn.classList.add("active");

  // Handle logout
  if (tabName === "Logout") {
    localStorage.removeItem("currentUser");
    showSnackbar("Logged out successfully", "success");
    setTimeout(() => (window.location.href = "login.html"), 1000);
    return;
  }

  // Load tab content
  let contentHTML = `<header>
      <h3>${tabName}</h3>
      <p>Home / My Account / ${tabName}</p>
    </header>`;

  // Farmer's Sales History table
  if (tabName === "Sales History") {
    contentContainer.innerHTML = contentHTML; // Clear old content
    renderSalesHistory(); // Only call when tab is clicked
    return;
  }

  // Regular user My Orders
  if (tabName === "My Orders") {
    contentContainer.innerHTML = contentHTML; // Clear old content
    renderOrders(); // Only call when tab is clicked
    return;
  }

  // Load other sections from contentSections
  contentContainer.innerHTML =
    contentHTML + (contentSections[tabName] || "<p>Coming soon...</p>");

  // Attach specific handlers
  if (tabName === "Personal Information") attachProfileHandler();
  if (tabName === "Manage Address") attachAddressHandler();
  if (tabName === "Password Manager") attachPasswordHandler();
}

// Handlers
function attachProfileHandler() {
  const form = document.getElementById("profileForm");
  const editBtn = document.getElementById("editBtn");

  // Fill form fields from currentUser
  if (user) {
    document.getElementById("firstName").value = user.firstName || "";
    document.getElementById("lastName").value = user.lastName || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";
    const genderInputs = document.querySelectorAll("input[name='gender']");
    genderInputs.forEach((input) => {
      if (input.value === user.gender) input.checked = true;
    });
  }

  let editable = false;

  editBtn.addEventListener("click", () => {
    editable = !editable;

    // Toggle readonly/disabled fields
    form.querySelectorAll("input, select").forEach((el) => {
      if (el.type === "radio") {
        el.disabled = !editable;
      } else {
        el.readOnly = !editable;
      }
    });

    // Toggle button text
    editBtn.textContent = editable ? "Save" : "Edit";

    // If saving, update user data
    if (!editable) {
      // Validate phone
      const phone = document.getElementById("phone").value.trim();
      if (!/^\d{10}$/.test(phone)) {
        showSnackbar("Phone number must be 10 digits", "error");
        return;
      }

      // Save updated data in user object
      user.firstName = document.getElementById("firstName").value.trim();
      user.lastName = document.getElementById("lastName").value.trim();
      user.phone = phone;
      const selectedGender = document.querySelector(
        "input[name='gender']:checked"
      );
      user.gender = selectedGender ? selectedGender.value : "";

      // Update currentUser with minimal info (email and role)
      const updatedCurrentUser = {
        email: user.email,
        role: user.role,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

      // Update users array
      const index = users.findIndex((u) => u.email === user.email);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem("users", JSON.stringify(users));
      }

      showSnackbar("Profile updated successfully!", "success");
    }
  });
}

function attachAddressHandler() {
  const container = document.getElementById("manageAddressContainer");
  const addBtn = document.getElementById("addAddressBtn");
  const modal = document.getElementById("addressModal");
  const closeModal = document.getElementById("closeModal");
  const form = document.getElementById("addressFormModal");
  const addressListContainer = document.getElementById("addressList");

  // Open/close modal
  addBtn.addEventListener("click", () => (modal.style.display = "flex"));
  closeModal.addEventListener("click", () => (modal.style.display = "none"));

  // Type buttons in modal
  const typeButtons = form.querySelectorAll(".type-btn");
  typeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      typeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Render addresses
  function renderAddresses() {
    const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
    const userAddresses = addresses.filter(
      (addr) => addr.email === currentUser.email
    );

    if (userAddresses.length === 0) {
      addressListContainer.innerHTML =
        "<p style='color:#777;'>No addresses saved yet.</p>";
      return;
    }

    addressListContainer.innerHTML = userAddresses
      .map(
        (addr) => `
        <div style="
            border:1px solid #eee;
            border-radius:12px;
            padding:15px 20px;
            background:#fafafa;
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            box-shadow:0 2px 6px rgba(0,0,0,0.05);
            position:relative;
        ">
          <div>
            <strong style="font-size:16px; color:#333;">${
              addr.type
            } Address</strong>
            <p style="margin:4px 0; color:#555;">${addr.address}</p>
            <p style="margin:4px 0; color:#555;">${addr.city}, ${
          addr.state
        } - ${addr.pincode}</p>
            ${
              addr.landmark
                ? `<p style="margin:4px 0; color:#555;">Landmark: ${addr.landmark}</p>`
                : ""
            }
          </div>
          <span style="
              cursor:pointer; 
              color:#e74c3c; 
              font-size:18px; 
              margin-left:10px;
          " onclick="deleteAddress('${addr.type}')">❌</span>
        </div>
      `
      )
      .join("");
  }

  renderAddresses();

  // Save new address
  // Save new address
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const addressData = {
      email: currentUser.email, // user's email
      name: currentUser.name, // user's name
      address: document.getElementById("modalAddress").value.trim(),
      city: document.getElementById("modalCity").value.trim(),
      state: document.getElementById("modalState").value,
      pincode: document.getElementById("modalPincode").value.trim(),
      landmark: document.getElementById("modalLandmark").value.trim(),
      // type is optional now
    };

    if (!/^\d{6}$/.test(addressData.pincode)) {
      showSnackbar("PIN code must be 6 digits", "error");
      return;
    }

    const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
    addresses.push(addressData);
    localStorage.setItem("addresses", JSON.stringify(addresses));
    showSnackbar("Address added successfully!", "success");

    form.reset();
    modal.style.display = "none";
    renderAddresses();
  });

  // Delete address
  window.deleteAddress = function (type) {
    const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
    const filtered = addresses.filter(
      (addr) => !(addr.email === currentUser.email && addr.type === type)
    );
    localStorage.setItem("addresses", JSON.stringify(filtered));
    showSnackbar("Address deleted successfully!", "success");
    renderAddresses();
  };
}

function renderOrders() {
  const ordersContainer = document.createElement("div");
  ordersContainer.id = "ordersContainer";
  ordersContainer.style.display = "grid";
  ordersContainer.style.gridTemplateColumns =
    "repeat(auto-fit, minmax(300px, 1fr))";
  ordersContainer.style.gap = "20px";
  ordersContainer.style.marginTop = "20px";

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  let userOrders = [];

  if (user.role === "farmer") {
    // Show orders where this farmer sold products
    userOrders = orders.filter((o) => o.farmers.includes(currentUser.email));
    console.log(userOrders, "order");
  } else {
    // Regular customer, show orders placed by this user
    userOrders = orders.filter((o) => o.userEmail === currentUser.email);
    console.log(userOrders, "order");
  }

  if (userOrders.length === 0) {
    ordersContainer.innerHTML = "<p>No orders found.</p>";
  } else {
    ordersContainer.innerHTML = userOrders
      .map((o) => {
        const items =
          user.role === "farmer"
            ? o.items.filter((i) => i.farmerEmail === currentUser.email)
            : o.items;

        return `
        <div style="
          border:1px solid #eee;
          border-radius:12px;
          padding:15px;
          background:#fff;
          box-shadow:0 2px 6px rgba(0,0,0,0.05);
          margin-bottom:15px;
        ">
          <h4 style="margin:0 0 10px 0;">Order #${o.id}</h4>
          <p style="margin:0 0 5px 0; font-size:14px; color:#555;">Date: ${
            o.date
          }</p>
          <p style="margin:0 0 5px 0; font-size:14px; color:#555;">Status: <strong>${
            o.status
          }</strong></p>
          <p style="margin:0 0 10px 0; font-size:14px; color:#555;">Total: ₹${
            o.total
          }</p>
          <div>
            <strong>Products:</strong>
            <ul style="margin:5px 0 0 0; padding:0; list-style-type:none;">
              ${items
                .map(
                  (i) =>
                    `<li style="display:flex; align-items:center; margin-bottom:10px;">
                      <img src="${i.image}" alt="${
                      i.title
                    }" style="width:60px; height:60px; object-fit:cover; border-radius:6px; margin-right:10px;">
                      <div>
                        <div>${i.title}</div>
                        <div style="font-size:13px; color:#555;">Quantity: ${
                          i.quantity
                        }, Price: ₹${i.price.toFixed(2)}, Subtotal: ₹${(
                      i.price * i.quantity
                    ).toFixed(2)}</div>
                      </div>
                    </li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      `;
      })
      .join("");
  }
  contentContainer.appendChild(ordersContainer);
}

function renderSalesHistory() {
  const salesContainer = document.createElement("div");
  salesContainer.id = "salesContainer";
  salesContainer.style.display = "grid";
  salesContainer.style.gridTemplateColumns =
    "repeat(auto-fit, minmax(300px, 1fr))";
  salesContainer.style.gap = "20px";
  salesContainer.style.marginTop = "20px";

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  // Filter sales for the current farmer
  const sales = orders
    .map((o) => {
      // Only items sold by this farmer
      const soldItems = o.items.filter(
        (i) => i.farmerEmail === currentUser.email
      );
      if (soldItems.length === 0) return null;

      return {
        orderId: o.id,
        date: o.date,
        status: o.status,
        buyerEmail: o.userEmail,
        items: soldItems,
        total: soldItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };
    })
    .filter(Boolean);

  if (sales.length === 0) {
    salesContainer.innerHTML = "<p>No sales found.</p>";
  } else {
    salesContainer.innerHTML = sales
      .map((sale) => {
        return `
        <div style="
          border:1px solid #eee;
          border-radius:12px;
          padding:15px;
          background:#fff;
          box-shadow:0 2px 6px rgba(0,0,0,0.05);
        ">
          <h4 style="margin:0 0 10px 0;">Order #${sale.orderId}</h4>
          <p style="margin:0 0 5px 0; font-size:14px; color:#555;">Date: ${
            sale.date
          }</p>
          <p style="margin:0 0 5px 0; font-size:14px; color:#555;">Buyer: <strong>${
            sale.buyerEmail
          }</strong></p>
          <p style="margin:0 0 5px 0; font-size:14px; color:#555;">Status: <strong>${
            sale.status
          }</strong></p>
          <p style="margin:0 0 10px 0; font-size:14px; color:#555;">Total Earnings: ₹${sale.total.toFixed(
            2
          )}</p>
          <div>
            <strong>Products Sold:</strong>
            <ul style="margin:5px 0 0 0; padding:0; list-style-type:none;">
              ${sale.items
                .map(
                  (i) => `
                  <li style="display:flex; align-items:center; margin-bottom:10px;">
                    <img src="${i.image}" alt="${
                    i.title
                  }" style="width:60px; height:60px; object-fit:cover; border-radius:6px; margin-right:10px;">
                    <div>
                      <div>${i.title}</div>
                      <div style="font-size:13px; color:#555;">Quantity Sold: ${
                        i.quantity
                      }, Price: ₹${i.price.toFixed(2)}, Subtotal: ₹${(
                    i.price * i.quantity
                  ).toFixed(2)}</div>
                    </div>
                  </li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
        `;
      })
      .join("");
  }

  contentContainer.appendChild(salesContainer);
}

// Call it for farmers
if (user.role === "farmer") {
  renderSalesHistory();
}

function attachPasswordHandler() {
  const form = document.getElementById("passwordForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const oldPass = document.getElementById("oldPassword").value;
    const newPass = document.getElementById("newPassword").value;

    if (oldPass !== user.password) {
      showSnackbar("Old password is incorrect!", "error");
      return;
    }

    user.password = newPass;
    localStorage.setItem("currentUser", JSON.stringify(user));
    showSnackbar("Password updated successfully!", "success");
  });
}

// Load default tab
handleTabClick("Personal Information", sidebarMenu.querySelector("button"));

// Snackbar
function showSnackbar(message, type = "info") {
  snackbar.textContent = message;
  snackbar.style.backgroundColor =
    type === "success" ? "#4caf50" : type === "error" ? "#e74c3c" : "#333";
  snackbar.classList.add("show");
  setTimeout(() => snackbar.classList.remove("show"), 3000);
}



// Get current user from localStorage
const currentUser = localStorage.getItem("currentUser");
const user = currentUser ? JSON.parse(currentUser) : null;

// Function to setup dynamic navbar links and category dropdown
function setupNavbar() {
  const container = document.querySelector(".dynamic-links");
  if (!container) return; // stop if no container exists

  // Clear existing links
  container.innerHTML = "";

  // Always show "Products"
  const productsLink = document.createElement("a");
  productsLink.href = "/products.html";
  productsLink.className = "nav-link";
  productsLink.textContent = "Products";
  container.appendChild(productsLink);

  // Show "Sell" only if user is a farmer
  if (user && user.role === "farmer") {
    const sellLink = document.createElement("a");
    sellLink.href = "/sell.html";
    sellLink.className = "nav-link";
    sellLink.textContent = "Sell";
    container.appendChild(sellLink);
  }

  // Setup category dropdown
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      dropdownMenu.classList.remove("active");
    });

    // Redirect to products page on category click
    dropdownMenu.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const category = item.getAttribute("data-category");
        window.location.href = `products.html?category=${category}`;
      });
    });
  }
}

// Initialize navbar on page load
document.addEventListener("DOMContentLoaded", () => {
  setupNavbar();
});
