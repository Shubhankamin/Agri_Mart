
// ===== sell.js =====

// IndexedDB setup

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
        const category = item.getAttribute("data-category"); // matches your HTML attribute
        window.location.href = `/products.html?category=${category}`;
      });
    });
  }
}
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

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.active").forEach((dropdown) =>
      dropdown.classList.remove("active")
    );
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

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  setupDynamicLinks();
  setupDropdown();
    setupNavigationEventListeners();

});

let db;
const request = indexedDB.open("AgriMartDB", 1);

request.onerror = (e) => console.error("DB error:", e);
request.onsuccess = (e) => {
  db = e.target.result;
  loadProductsForCurrentFarmer();
};

request.onupgradeneeded = (e) => {
  db = e.target.result;
  if (!db.objectStoreNames.contains("products")) {
    const store = db.createObjectStore("products", {
      keyPath: "id",
      autoIncrement: true,
    });
    store.createIndex("farmerId", "farmerId", { unique: false });
  }
};

// DOM Elements
const productContainer = document.getElementById("productContainer");
const addProductForm = document.getElementById("addProductForm");
const newProductImagesContainer = document.getElementById(
  "newProductImagesContainer"
);
const MAX_IMAGES = 3;
let newProductTempImages = [null, null, null];

// Get current farmer
if (!currentUser || currentUser.role !== "farmer") {
  alert("You must be logged in as a farmer to view this page.");
  window.location.href = "index.html";
}

// Convert file to base64 (optional, if you want previews)
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Load products for current farmer
function loadProductsForCurrentFarmer() {
  const tx = db.transaction("products", "readonly");
  const store = tx.objectStore("products");
  const request = store.getAll();

  request.onsuccess = (e) => {
    let products = e.target.result;
    products = products.filter((p) => p.farmerId === currentUser.email);
    renderProducts(products);
  };
}

// Render products
function renderProducts(products) {
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    // Image slider
    const slider = document.createElement("div");
    slider.classList.add("image-slider");
    product.images.forEach((imgData, i) => {
      const img = document.createElement("img");
      img.src =
        imgData instanceof Blob ? URL.createObjectURL(imgData) : imgData;
      if (i === 0) img.classList.add("active");
      slider.appendChild(img);
    });

    const prev = document.createElement("button");
    prev.classList.add("slider-btn", "prev");
    prev.textContent = "‹";
    const next = document.createElement("button");
    next.classList.add("slider-btn", "next");
    next.textContent = "›";
    slider.append(prev, next);

    const imgs = slider.querySelectorAll("img");
    let currentIndex = 0;
    prev.onclick = () => {
      imgs[currentIndex].classList.remove("active");
      currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
      imgs[currentIndex].classList.add("active");
    };
    next.onclick = () => {
      imgs[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % imgs.length;
      imgs[currentIndex].classList.add("active");
    };

    // Info section
    const info = document.createElement("div");
    info.classList.add("product-info");
    info.innerHTML = `
      <h3>${product.name}</h3>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Price:</strong> ₹${product.price} per kg</p>
      <p><strong>Quantity:</strong> ${product.quantity} kg</p>
      <p><strong>Available:</strong> ${product.availableQuantity} kg</p>
      <p><strong>Freshness:</strong> ${product.freshness}</p>
      <p><strong>Description:</strong> ${product.description}</p>
    `;

    // Buttons
    const btns = document.createElement("div");
    btns.classList.add("edit-btns");

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.classList.add("edit");
    edit.onclick = () => openEditModal(product);

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.classList.add("delete");
    del.onclick = () => deleteProduct(product.id);

    btns.append(edit, del);

    card.append(slider, info, btns);
    productContainer.appendChild(card);
  });
}

// Delete product
function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  const tx = db.transaction("products", "readwrite");
  const store = tx.objectStore("products");
  store.delete(id);

  tx.oncomplete = () => loadProductsForCurrentFarmer();
}

// Handle image uploads
newProductImagesContainer
  .querySelectorAll(".image-upload-box")
  .forEach((box, index) => {
    const fileInput = box.querySelector(".hidden-file-input");
    const imgElement = box.querySelector(".uploaded-img");
    const plusIcon = box.querySelector(".plus-icon");
    const removeBtn = box.querySelector(".remove-new-image");

    box.addEventListener("click", () => {
      if (imgElement.classList.contains("hidden")) fileInput.click();
    });

    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      newProductTempImages[index] = file;
      imgElement.src = URL.createObjectURL(file);
      imgElement.classList.remove("hidden");
      plusIcon.classList.add("hidden");
      removeBtn.classList.remove("hidden");
    });

    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      newProductTempImages[index] = null;
      imgElement.src = "";
      imgElement.classList.add("hidden");
      plusIcon.classList.remove("hidden");
      removeBtn.classList.add("hidden");
      fileInput.value = "";
    });
  });

// Add new product
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const quantity = parseInt(document.getElementById("productQuantity").value);
  const description = document
    .getElementById("productDescription")
    .value.trim();
  const availableQuantity = parseInt(
    document.getElementById("availableQuantity").value
  );
  const freshness = document.getElementById("freshness").value;
  const category = document.getElementById("productCategory").value;

  // Convert images to base64
  const uploadedImages = [];
  const fileInputs = document.querySelectorAll(".hidden-file-input");
  for (const input of fileInputs) {
    if (input.files[0]) {
      const base64 = await getBase64(input.files[0]);
      uploadedImages.push(base64);
    }
  }
  if (uploadedImages.length === 0) {
    alert("Please add at least one image.");
    return;
  }

  // Generate unique ID avoiding collisions with data.js products
  async function getNextProductId() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction("products", "readonly");
      const store = tx.objectStore("products");
      const request = store.getAll();

      request.onsuccess = (e) => {
        const dbProducts = e.target.result;
        const maxDbId = dbProducts.reduce(
          (max, p) => (p.id > max ? p.id : max),
          0
        );
        const maxDataId = products.reduce(
          (max, p) => (p.id > max ? p.id : max),
          0
        );
        resolve(Math.max(maxDbId, maxDataId) + 1);
      };

      request.onerror = (err) => reject(err);
    });
  }

  const nextId = await getNextProductId();

  const newProduct = {
    id: nextId,
    name,
    price,
    quantity,
    description,
    availableQuantity,
    freshness,
    category,
    images: uploadedImages,
    farmerId: currentUser.email,
  };

  const tx = db.transaction("products", "readwrite");
  const store = tx.objectStore("products");
  const request = store.add(newProduct);

  request.onsuccess = () => {
    alert("Product added successfully!");
    loadProductsForCurrentFarmer?.();

    addProductForm.reset();
    newProductTempImages = [null, null, null];

    // Reset image upload UI
    newProductImagesContainer
      .querySelectorAll(".image-upload-box")
      .forEach((box) => {
        box.querySelector(".uploaded-img").classList.add("hidden");
        box.querySelector(".uploaded-img").src = "";
        box.querySelector(".plus-icon").classList.remove("hidden");
        box.querySelector(".remove-new-image").classList.add("hidden");
        box.querySelector(".hidden-file-input").value = "";
      });
  };

  request.onerror = (err) => {
    console.error("Error adding product:", err);
    alert("Failed to add product. Check console.");
  };
});

// ===== EDIT FUNCTIONALITY =====
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const editImageContainer = document.getElementById("editImageContainer");
const addNewImageInput = document.getElementById("addNewImage");
let editProductId = null;

// Open edit modal
function openEditModal(product) {
  editProductId = product.id;
  editForm.reset();

  document.getElementById("editName").value = product.name;
  document.getElementById("editPrice").value = product.price;
  document.getElementById("editQuantity").value = product.quantity;
  document.getElementById("editDescription").value = product.description;
  document.getElementById("editAvailableQuantity").value =
    product.availableQuantity;
  document.getElementById("editFreshness").value = product.freshness;
  document.getElementById("editCategory").value = product.category;

  // Populate images
  populateEditImages(product);

  editModal.classList.remove("hidden");
}

// Close modal
document.getElementById("closeModal").onclick = () =>
  editModal.classList.add("hidden");

// Add new image in edit
addNewImageInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const base64 = await getBase64(file);
  editTempImages.push(base64);

  const div = document.createElement("div");
  div.classList.add("edit-img-box");
  div.innerHTML = `<img src="${base64}" alt="Product Image"><button type="button" class="remove-img-btn">x</button>`;
  editImageContainer.appendChild(div);

  div.querySelector(".remove-img-btn").onclick = () => {
    editTempImages = editTempImages.filter((img) => img !== base64);
    div.remove();
  };

  addNewImageInput.value = "";
});

let editTempImages = [null, null, null]; // temporary storage for edit modal

function populateEditImages(product) {
  const boxes = document.querySelectorAll(
    "#editImageContainer .image-upload-box"
  );

  boxes.forEach((box, index) => {
    const fileInput = box.querySelector(".hidden-file-input");
    const imgElement = box.querySelector(".uploaded-img");
    const plusIcon = box.querySelector(".plus-icon");
    const removeBtn = box.querySelector(".remove-new-image");

    // Show existing image if available
    if (product.images[index]) {
      imgElement.src = product.images[index];
      imgElement.classList.remove("hidden");
      plusIcon.classList.add("hidden");
      removeBtn.classList.remove("hidden");
      editTempImages[index] = product.images[index];
    } else {
      imgElement.src = "";
      imgElement.classList.add("hidden");
      plusIcon.classList.remove("hidden");
      removeBtn.classList.add("hidden");
      fileInput.value = "";
      editTempImages[index] = null;
    }

    // Click box to select new file
    box.addEventListener("click", () => {
      if (imgElement.classList.contains("hidden")) fileInput.click();
    });

    // File input change
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const base64 = await getBase64(file);
      editTempImages[index] = base64;
      imgElement.src = base64;
      imgElement.classList.remove("hidden");
      plusIcon.classList.add("hidden");
      removeBtn.classList.remove("hidden");
    });

    // Remove button
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editTempImages[index] = null;
      imgElement.src = "";
      imgElement.classList.add("hidden");
      plusIcon.classList.remove("hidden");
      removeBtn.classList.add("hidden");
      fileInput.value = "";
    });
  });
}

function showSnackbar(message, color = "#4caf50") {
  const snackbar = document.getElementById("snackbar");
  snackbar.textContent = message;
  snackbar.style.backgroundColor = color;
  snackbar.classList.add("show");

  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 3000); // visible for 3 seconds
}

// Submit edit form
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const tx = db.transaction("products", "readwrite");
  const store = tx.objectStore("products");
  const request = store.get(editProductId);

  request.onsuccess = (e) => {
    const product = e.target.result;

    product.name = document.getElementById("editName").value.trim();
    product.price = parseFloat(document.getElementById("editPrice").value);
    product.quantity = parseInt(document.getElementById("editQuantity").value);
    product.description = document
      .getElementById("editDescription")
      .value.trim();
    product.availableQuantity = parseInt(
      document.getElementById("editAvailableQuantity").value
    );
    product.freshness = document.getElementById("editFreshness").value;
    product.category = document.getElementById("editCategory").value;

    // Replace images with editTempImages (ignore nulls)
    product.images = editTempImages.filter((img) => img != null);

    const updateReq = store.put(product);
    updateReq.onsuccess = () => {
      showSnackbar("Product updated successfully!");
      editModal.classList.add("hidden");
      loadProductsForCurrentFarmer();
    };
    updateReq.onerror = (err) => console.error("Update failed:", err);
  };
});
