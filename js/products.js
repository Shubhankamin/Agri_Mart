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
const closeDrawer = document.getElementById("closeDrawer");

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

    card.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" class="product-image" loading="lazy">
      <div class="info">
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;

    // Navigate to details page
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("add-cart-btn")) {
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
