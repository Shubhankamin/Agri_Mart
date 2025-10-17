// ----------------------------
// Navbar setup (dynamic links + category dropdown)
// ----------------------------
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
  const dropdown = document.querySelector(".dropdown");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (dropdown && dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();

      const isActive = dropdown.classList.contains("active");
      dropdown.classList.toggle("active", !isActive);
      dropdownToggle.setAttribute("aria-expanded", !isActive);
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      dropdown.classList.remove("active");
      dropdownToggle.setAttribute("aria-expanded", "false");
    });

    // Handle category clicks
    dropdownMenu.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const category = item.getAttribute("data-category");
        window.location.href = `/products.html?category=${category}`;
      });
    });
  }
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  setupDynamicLinks();
  setupDropdown();
});

const sidebarMenu = document.getElementById("sidebarMenu");
const snackbar = document.getElementById("snackbar");

// Get user info
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

console.log(currentUser, "current user");
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

function populateUserInfo() {
  if (!user) return;

  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const genderInputs = document.querySelectorAll('input[name="gender"]');

  if (firstNameInput) firstNameInput.value = user.firstName || "";
  if (lastNameInput) lastNameInput.value = user.lastName || "";
  if (emailInput) emailInput.value = user.email || "";
  if (phoneInput) phoneInput.value = user.phone || "";

  if (genderInputs.length > 0 && user.gender) {
    genderInputs.forEach((input) => {
      input.checked = input.value === user.gender;
    });
  }
}

function loadSection(sectionName) {
  const container = document.getElementById("contentContainer");
  container.innerHTML = contentSections[sectionName];

  // Wait for DOM to render, then populate fields
  if (sectionName === "Personal Information") {
    setTimeout(populateUserInfo, 0);
  }
}

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
  <div id="addressModal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:1000;">
    <div style="background:#fff; padding:20px; border-radius:10px; min-width:400px; max-width:500px; position:relative;">
      <span id="closeModal" style="position:absolute; right:10px; top:10px; cursor:pointer; font-size:24px; color:#999;">✖</span>
      <h3 id="modalTitle" style="margin-top:0;">Add New Address</h3>
      <form id="addressFormModal" class="address-form">
        <input type="hidden" id="editAddressId" value="">
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
              <option value="KA">Karnataka</option>
              <option value="MH">Maharashtra</option>
              <option value="TN">Tamil Nadu</option>
              <option value="KL">Kerala</option>
              <option value="DL">Delhi</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="RJ">Rajasthan</option>
              <option value="GJ">Gujarat</option>
              <option value="WB">West Bengal</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>PIN Code *</label>
            <input type="text" id="modalPincode" placeholder="6-digit PIN code" required maxlength="6" />
          </div>
          <div class="form-group">
            <label>Landmark (Optional)</label>
            <input type="text" id="modalLandmark" placeholder="Nearby landmark" />
          </div>
        </div>
        <div class="form-group">
          <label>Address Type</label>
          <div class="address-type">
            <button type="button" class="type-btn active" data-type="home">🏠 Home</button>
            <button type="button" class="type-btn" data-type="work">🏢 Work</button>
          </div>
        </div>
        <div style="display:flex; gap:10px; margin-top:15px;">
          <button type="submit" id="submitAddressBtn" class="update-btn" style="flex:1;">Save Address</button>
          <button type="button" id="cancelAddressBtn" class="update-btn" style="flex:1; background:#6c757d;">Cancel</button>
        </div>
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
    contentContainer.innerHTML = contentHTML;
    renderSalesHistory();
    return;
  }

  // Regular user My Orders
  if (tabName === "My Orders") {
    contentContainer.innerHTML = contentHTML;
    renderOrders();
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

// ✅ COMPLETE FIXED: Address Handler with Edit & Delete + Cancel Button
function attachAddressHandler() {
  const container = document.getElementById("manageAddressContainer");
  const addBtn = document.getElementById("addAddressBtn");
  const modal = document.getElementById("addressModal");
  const closeModal = document.getElementById("closeModal");
  const form = document.getElementById("addressFormModal");
  const addressListContainer = document.getElementById("addressList");
  const modalTitle = document.getElementById("modalTitle");
  const submitBtn = document.getElementById("submitAddressBtn");
  const editAddressIdInput = document.getElementById("editAddressId");
  const cancelBtn = document.getElementById("cancelAddressBtn");

  let isEditMode = false;

  // ✅ FIX: Migrate old addresses without IDs
  function ensureAllAddressesHaveIds() {
    let addresses = JSON.parse(localStorage.getItem("addresses")) || [];
    let needsUpdate = false;

    addresses = addresses.map((addr, index) => {
      if (
        !addr.id ||
        addr.id === undefined ||
        addr.id === null ||
        addr.id === "undefined" ||
        addr.id === ""
      ) {
        needsUpdate = true;
        return {
          ...addr,
          id: Date.now() + index + Math.floor(Math.random() * 10000),
        };
      }
      return addr;
    });

    if (needsUpdate) {
      localStorage.setItem("addresses", JSON.stringify(addresses));
    }

    return addresses;
  }

  // Function to close modal and reset
  function closeModalAndReset() {
    modal.style.display = "none";
    isEditMode = false;
    form.reset();
    editAddressIdInput.value = "";
    const typeButtons = form.querySelectorAll(".type-btn");
    typeButtons.forEach((b) => b.classList.remove("active"));
    typeButtons[0].classList.add("active");
  }

  // Open modal for ADD
  addBtn.addEventListener("click", () => {
    isEditMode = false;
    editAddressIdInput.value = "";
    modalTitle.textContent = "Add New Address";
    submitBtn.textContent = "Save Address";

    modal.style.display = "flex";
    form.reset();
    const typeButtons = form.querySelectorAll(".type-btn");
    typeButtons.forEach((b) => b.classList.remove("active"));
    typeButtons[0].classList.add("active");
  });

  // Close modal (X button)
  closeModal.addEventListener("click", closeModalAndReset);

  // ✅ Cancel button handler
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModalAndReset);
  }

  // Close modal on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModalAndReset();
    }
  });

  // Type buttons in modal
  const typeButtons = form.querySelectorAll(".type-btn");
  typeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      typeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Render addresses
  function renderAddresses() {
    const allAddresses = ensureAllAddressesHaveIds();
    const userAddresses = allAddresses.filter(
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
            margin-bottom:15px;
        ">
          <div>
            <strong style="font-size:16px; color:#333;">${
              addr.type || "Home"
            } Address</strong>
            <p style="margin:4px 0; color:#555;"><strong>${
              addr.name || ""
            }</strong></p>
            <p style="margin:4px 0; color:#555;">${addr.phone || ""}</p>
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
          <div style="display:flex; gap:15px; align-items:center;">
            <span class="edit-address-btn" data-address-id="${
              addr.id
            }" style="cursor:pointer; color:#3498db; font-size:16px;" title="Edit">✏️</span>
            <span class="delete-address-btn" data-address-id="${
              addr.id
            }" style="cursor:pointer; color:#e74c3c; font-size:18px;" title="Delete">❌</span>
          </div>
        </div>
      `
      )
      .join("");
  }

  // Initial render
  renderAddresses();

  // ✅ Event delegation for EDIT and DELETE
  addressListContainer.addEventListener("click", function (e) {
    // Handle DELETE
    const deleteBtn = e.target.closest(".delete-address-btn");
    if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();

      const addressId = deleteBtn.getAttribute("data-address-id");

      if (
        !addressId ||
        addressId === "null" ||
        addressId === "undefined" ||
        addressId === ""
      ) {
        showSnackbar("Error: Invalid address ID", "error");
        return;
      }

      if (confirm("Are you sure you want to delete this address?")) {
        let addresses = JSON.parse(localStorage.getItem("addresses")) || [];

        const beforeLength = addresses.length;
        addresses = addresses.filter(
          (addr) => String(addr.id) !== String(addressId)
        );

        if (beforeLength === addresses.length) {
          showSnackbar("Error: Address not found", "error");
          return;
        }

        localStorage.setItem("addresses", JSON.stringify(addresses));
        showSnackbar("Address deleted successfully!", "success");
        renderAddresses();
      }
    }

    // Handle EDIT
    const editBtn = e.target.closest(".edit-address-btn");
    if (editBtn) {
      e.preventDefault();
      e.stopPropagation();

      const addressId = editBtn.getAttribute("data-address-id");

      if (
        !addressId ||
        addressId === "null" ||
        addressId === "undefined" ||
        addressId === ""
      ) {
        showSnackbar("Error: Invalid address ID", "error");
        return;
      }

      const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
      const addressToEdit = addresses.find(
        (addr) => String(addr.id) === String(addressId)
      );

      if (!addressToEdit) {
        showSnackbar("Error: Address not found", "error");
        return;
      }

      // Populate form
      isEditMode = true;
      editAddressIdInput.value = addressId;
      modalTitle.textContent = "Edit Address";
      submitBtn.textContent = "Update Address";

      document.getElementById("modalAddress").value =
        addressToEdit.address || "";
      document.getElementById("modalCity").value = addressToEdit.city || "";
      document.getElementById("modalState").value = addressToEdit.state || "";
      document.getElementById("modalPincode").value =
        addressToEdit.pincode || "";
      document.getElementById("modalLandmark").value =
        addressToEdit.landmark || "";

      // Set type button
      const typeButtons = form.querySelectorAll(".type-btn");
      typeButtons.forEach((btn) => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-type") === (addressToEdit.type || "home")) {
          btn.classList.add("active");
        }
      });

      modal.style.display = "flex";
    }
  });

  // Save/Update address
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const activeTypeBtn = form.querySelector(".type-btn.active");
    const selectedType = activeTypeBtn
      ? activeTypeBtn.getAttribute("data-type").toLowerCase()
      : "home";

    const fullName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`.trim()
        : user.firstName || user.lastName || "User";

    const pincode = document.getElementById("modalPincode").value.trim();
    if (!/^\d{6}$/.test(pincode)) {
      showSnackbar("PIN code must be 6 digits", "error");
      return;
    }

    const addressData = {
      email: currentUser.email,
      name: fullName,
      phone: user.phone || "",
      address: document.getElementById("modalAddress").value.trim(),
      city: document.getElementById("modalCity").value.trim(),
      state: document.getElementById("modalState").value,
      pincode: pincode,
      landmark: document.getElementById("modalLandmark").value.trim(),
      type: selectedType,
    };

    let addresses = JSON.parse(localStorage.getItem("addresses")) || [];

    if (isEditMode) {
      // UPDATE
      const editId = editAddressIdInput.value;
      const index = addresses.findIndex(
        (addr) => String(addr.id) === String(editId)
      );

      if (index !== -1) {
        addresses[index] = {
          ...addresses[index],
          ...addressData,
        };
        showSnackbar("Address updated successfully!", "success");
      }
    } else {
      // ADD
      const newAddress = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        ...addressData,
      };
      addresses.push(newAddress);
      showSnackbar("Address added successfully!", "success");
    }

    localStorage.setItem("addresses", JSON.stringify(addresses));

    closeModalAndReset();
    renderAddresses();
  });
}

function renderOrders() {
  const ordersContainer = document.createElement("div");
  ordersContainer.id = "ordersContainer";
  ordersContainer.style.marginTop = "20px";

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  let userOrders = [];

  if (user.role === "farmer") {
    userOrders = orders.filter(
      (o) => o.farmers && o.farmers.includes(currentUser.email)
    );
  } else {
    userOrders = orders.filter((o) => o.userEmail === currentUser.email);
  }

  if (userOrders.length === 0) {
    ordersContainer.innerHTML = `
      <div style="text-align:center; padding:40px; color:#999;">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h3>No Orders Yet</h3>
        <p>Looks like you haven't placed any orders yet.</p>
      </div>
    `;
  } else {
    ordersContainer.innerHTML = userOrders
      .map((o) => {
        const items =
          user.role === "farmer"
            ? o.items.filter((i) => i.farmerEmail === currentUser.email)
            : o.items;

        const statusColor =
          o.status === "Delivered"
            ? "#388e3c"
            : o.status === "Shipped"
            ? "#1976d2"
            : o.status === "Processing"
            ? "#f57c00"
            : "#666";

        return `
        <div style="
          border:1px solid #e0e0e0;
          border-radius:8px;
          background:#fff;
          margin-bottom:16px;
          overflow:hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        ">
          <div style="
            background:#f8f8f8;
            padding:12px 16px;
            border-bottom:1px solid #e0e0e0;
            display:flex;
            justify-content:space-between;
            align-items:center;
            flex-wrap:wrap;
            gap:10px;
          ">
            <div>
              <div style="font-size:12px; color:#666;">ORDER PLACED</div>
              <div style="font-size:13px; font-weight:500; color:#222;">${
                o.date
              }</div>
            </div>
            <div>
              <div style="font-size:12px; color:#666;">TOTAL</div>
              <div style="font-size:13px; font-weight:500; color:#222;">₹${o.total.toFixed(
                2
              )}</div>
            </div>
            <div>
              <div style="font-size:12px; color:#666;">ORDER ID</div>
              <div style="font-size:13px; font-weight:500; color:#222;">#${
                o.id
              }</div>
            </div>
          </div>
          <div style="
            padding:12px 16px;
            background:#fff;
            border-bottom:1px solid #f0f0f0;
          ">
            <div style="
              display:inline-block;
              padding:4px 12px;
              background:${statusColor};
              color:#fff;
              border-radius:4px;
              font-size:12px;
              font-weight:600;
              text-transform:uppercase;
            ">
              ${o.status}
            </div>
          </div>
          <div style="padding:16px;">
         ${items
           .map(
             (item) => `
  <div style="
    display:flex;
    gap:16px;
    padding-bottom:16px;
    margin-bottom:16px;
    border-bottom:1px solid #f0f0f0;
  ">
    <div style="flex-shrink:0;">
      <img 
        src="${
          item.image && item.image.length
            ? item.image[0].src
            : "/images/no-image.jpg"
        }" 
        alt="${item.title}" 
        style="
          width:100px;
          height:100px;
          object-fit:cover;
          border-radius:6px;
          border:1px solid #e0e0e0;
        "
      />
    </div>
    <div style="flex:1;">
      <h4 style="
        margin:0 0 8px 0;
        font-size:16px;
        color:#222;
        font-weight:500;
      ">${item.title}</h4>
      
      <div style="
        display:flex;
        gap:20px;
        margin-bottom:8px;
        flex-wrap:wrap;
      ">
        <div>
          <span style="color:#666; font-size:13px;">Quantity:</span>
          <span style="color:#222; font-weight:500; font-size:13px;"> ${
            item.quantity
          }</span>
        </div>
        <div>
          <span style="color:#666; font-size:13px;">Price:</span>
          <span style="color:#222; font-weight:500; font-size:13px;"> ₹${item.price.toFixed(
            2
          )}</span>
        </div>
        <div>
          <span style="color:#666; font-size:13px;">Subtotal:</span>
          <span style="color:#00b67a; font-weight:600; font-size:14px;"> ₹${(
            item.price * item.quantity
          ).toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>
`
           )
           .join("")}
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

    const userIndex = users.findIndex((u) => u.email === user.email);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem("users", JSON.stringify(users));
    }

    showSnackbar("Password updated successfully!", "success");
    form.reset();
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
