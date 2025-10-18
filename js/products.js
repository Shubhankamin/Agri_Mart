// ==========================
// /js/products.js
// ==========================

// 1️⃣ Select DOM elements
const productGrid = document.querySelector(".products-grid");

const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const sortSelect = document.getElementById("sortSelect");
// const inStockCheckbox = document.getElementById("inStock");
// const onSaleCheckbox = document.getElementById("onSale");
const ratingRadios = document.querySelectorAll('input[name="rating"]');

const categorySelectMobile = document.getElementById("categorySelectMobile");
const priceRangeMobile = document.getElementById("priceRangeMobile");
const priceValueMobile = document.getElementById("priceValueMobile");
const sortSelectMobile = document.getElementById("sortSelectMobile");
// const inStockCheckboxMobile =
//   document.getElementById("inStockMobile") || inStockCheckbox;
// const onSaleCheckboxMobile =
//   document.getElementById("onSaleMobile") || onSaleCheckbox;
const ratingRadiosMobile =
  document.querySelectorAll('input[name="ratingMobile"]') || ratingRadios;

const mobileFilterBtn = document.getElementById("mobileFilterBtn");
const mobileFilterDrawer = document.getElementById("mobileFilterDrawer");
const closeDrawer = document.getElementById("FiltercloseDrawer");
const currentUser = localStorage.getItem("currentUser");

const user = currentUser ? JSON.parse(currentUser) : null;

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

// --- PROFILE DISPLAY LOGIC ---
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

// Setup Event Listeners for Navigation
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

// --- MAIN INITIALIZATION SCRIPT ---
document.addEventListener("DOMContentLoaded", () => {
  setupDynamicLinks();
  updateCartCount();
  updateProfileUI(); // ✅ added profile update
  setupNavigationEventListeners();
});

function truncateText(text, maxLength = 55) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}
// 2️⃣ Display products function
function displayProducts(list) {
  productGrid.innerHTML = "";

  if (list.length === 0) {
    productGrid.innerHTML = `<p class="no-results" style="text-align:center;font-size:1.5rem;margin-top:20px;">No products found.</p>`;
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    // handle DB images (base64) or data.js images
    let imgSrc = Array.isArray(product.images)
      ? product.images[0]
      : product.img
      ? product.img[0].src
      : "";

    // const shortDesc =
    //   product.description?.length > 70
    //     ? product.description.slice(0, 70) + "..."
    //     : product.description || "";

    card.innerHTML = `
      <div class="product-img">
        <img src="${imgSrc}" alt="${product.name}" loading="lazy" />
      </div>

      <div class="product-content">
        <span class="product-category">${product.category || "Category"}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${truncateText(product.description)}</p>
        <div class="product-footer">
          <h4 class="product-price">₹${product.price.toFixed(2)}</h4>
          <button class="add-cart-btn" data-id="${product.id}">
            <i class="fa fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `;

    // Navigate to details page
    card.addEventListener("click", (e) => {
      if (
        !e.target.classList.contains("add-cart-btn") &&
        !e.target.closest(".add-cart-btn")
      ) {
        window.location.href = `product_details.html?id=${product.id}`;
      }
    });

    productGrid.appendChild(card);
  });
}

let db;
const request = indexedDB.open("AgriMartDB", 1);

request.onerror = (e) => console.error("DB error:", e);
request.onsuccess = (e) => {
  db = e.target.result;
  loadAllProducts(); // Load DB products + data.js products
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

let allProducts = []; // <-- use this for filtering & display

function loadAllProducts() {
  const tx = db.transaction("products", "readonly");
  const store = tx.objectStore("products");
  const request = store.getAll();

  request.onsuccess = (e) => {
    const dbProducts = e.target.result.map((p) => ({
      ...p,
      images: p.images || [],
    }));
    console.log(dbProducts, "DB products");

    // Merge with data.js products
    allProducts = [...products, ...dbProducts]; // <-- products from data.js
    console.log(allProducts, "Merged products");
    filterProducts(); // display merged products
  };
}

function isMobileView() {
  return window.innerWidth <= 768; // adjust breakpoint
}

// 3️⃣ Filter & sort products
function filterProducts() {
  if (!allProducts || allProducts.length === 0) return;

  const categoryDesktop = categorySelect?.value || "all";
  const maxPriceDesktop = parseInt(priceRange?.value) || Infinity;
  const sortDesktop = sortSelect?.value || "default";
  const ratingDesktop =
    parseInt(document.querySelector('input[name="rating"]:checked')?.value) ||
    0;

  const categoryMobile = categorySelectMobile?.value || "all";
  const maxPriceMobile = parseInt(priceRangeMobile?.value) || Infinity;
  const sortMobile = sortSelectMobile?.value || "default";
  const ratingMobile =
    parseInt(
      document.querySelector('input[name="ratingMobile"]:checked')?.value
    ) || 0;

  const searchText = searchInput?.value?.toLowerCase() || "";

  const category = categoryDesktop !== "all" ? categoryDesktop : categoryMobile;
  const maxPrice =
    maxPriceDesktop !== Infinity ? maxPriceDesktop : maxPriceMobile;
  const sortBy = sortDesktop !== "default" ? sortDesktop : sortMobile;
  const minRating = ratingDesktop || ratingMobile;

  let filtered = allProducts.filter((p) => {
    return (
      (category === "all" || p.category === category) &&
      p.name.toLowerCase().includes(searchText) &&
      p.price <= maxPrice &&
      (!minRating || p.rating >= minRating)
    );
  });

  if (sortBy === "lowToHigh") filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "highToLow") filtered.sort((a, b) => b.price - a.price);
  if (sortBy === "aToZ") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "zToA") filtered.sort((a, b) => b.name.localeCompare(a.name));

  displayProducts(filtered);
}

// ===== Attach filter event listeners =====
categorySelect?.addEventListener("change", filterProducts);
searchInput?.addEventListener("input", filterProducts);
priceRange?.addEventListener("input", () => {
  priceValue.textContent = `₹0 - ₹${priceRange.value}`;
  filterProducts();
});
sortSelect?.addEventListener("change", filterProducts);
ratingRadios.forEach((r) => r.addEventListener("change", filterProducts));

categorySelectMobile?.addEventListener("change", filterProducts);
priceRangeMobile?.addEventListener("input", () => {
  priceValueMobile.textContent = `₹0 - ₹${priceRangeMobile.value}`;
  filterProducts();
});
sortSelectMobile?.addEventListener("change", filterProducts);
ratingRadiosMobile.forEach((r) => r.addEventListener("change", filterProducts));
// 5️⃣ Mobile drawer toggle
mobileFilterBtn.addEventListener("click", () => {
  mobileFilterDrawer.classList.add("open");
  document.body.style.overflow = "hidden";
});

closeDrawer.addEventListener("click", () => {
  mobileFilterDrawer.classList.remove("open");
  document.body.style.overflow = "";
  console.log("Close drawer clicked");
});

window.addEventListener("click", (e) => {
  if (
    mobileFilterDrawer.classList.contains("open") &&
    !mobileFilterDrawer.contains(e.target) &&
    !mobileFilterBtn.contains(e.target)
  ) {
    mobileFilterDrawer.classList.remove("open");
    document.body.style.overflow = "";
  }
});

// 6️⃣ Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Set initial price range text
  priceValue.textContent = `₹0 - ₹${priceRange.value}`;
  priceValueMobile.textContent = `₹0 - ₹${priceRangeMobile.value}`;

  // Check if a category is passed via query string
  const urlParams = new URLSearchParams(window.location.search);
  const queryCategory = urlParams.get("category") || "all";
  categorySelect.value = queryCategory;
  categorySelectMobile.value = queryCategory;

  // Attach filter event listeners

  // Desktop
  categorySelect?.addEventListener("change", filterProducts);
  priceRange?.addEventListener("input", () => {
    priceValue.textContent = `₹0 - ₹${priceRange.value}`;
    filterProducts();
  });
  sortSelect?.addEventListener("change", filterProducts);
  // inStockCheckbox?.addEventListener("change", filterProducts);
  // onSaleCheckbox?.addEventListener("change", filterProducts);
  ratingRadios.forEach((r) => r.addEventListener("change", filterProducts));

  // Mobile
  categorySelectMobile?.addEventListener("change", filterProducts);
  priceRangeMobile?.addEventListener("input", () => {
    priceValueMobile.textContent = `₹0 - ₹${priceRangeMobile.value}`;
    filterProducts();
  });
  sortSelectMobile?.addEventListener("change", filterProducts);
  // inStockCheckboxMobile?.addEventListener("change", filterProducts);
  // onSaleCheckboxMobile?.addEventListener("change", filterProducts);
  ratingRadiosMobile.forEach((r) =>
    r.addEventListener("change", filterProducts)
  );

  // Display products initially
  filterProducts();
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("quantityModal");
  const modalQty = document.getElementById("modalQty");
  const increaseBtn = document.getElementById("increaseQty");
  const decreaseBtn = document.getElementById("decreaseQty");
  const confirmBtn = document.getElementById("confirmAddToCart");
  const cancelBtn = document.getElementById("cancelModal");

  let selectedProductId = null;
  let quantity = 1;

  // 🛒 Listen for Add to Cart clicks
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-cart-btn")) {
      console.log("Add to Cart clicked");
      selectedProductId = e.target.dataset.id;
      quantity = 1;
      modalQty.textContent = quantity;
      modal.style.display = "flex"; // show modal
    }
  });

  // ➕ Increment
  increaseBtn.addEventListener("click", () => {
    if (quantity < 99) {
      quantity++;
      modalQty.textContent = quantity;
    }
  });

  // ➖ Decrement
  decreaseBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      modalQty.textContent = quantity;
    }
  });

  // ✅ Confirm add to cart → redirect
  confirmBtn.addEventListener("click", () => {
    if (selectedProductId) {
      const url = `cart.html?id=${selectedProductId}&qty=${quantity}`;
      window.location.href = url;
    }
  });

  // ❌ Cancel / close modal
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal if clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
