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
const inStockCheckbox = document.getElementById("inStock");
const onSaleCheckbox = document.getElementById("onSale");
const ratingRadios = document.querySelectorAll('input[name="rating"]');

const categorySelectMobile = document.getElementById("categorySelectMobile");
const priceRangeMobile = document.getElementById("priceRangeMobile");
const priceValueMobile = document.getElementById("priceValueMobile");
const sortSelectMobile = document.getElementById("sortSelectMobile");
const inStockCheckboxMobile =
  document.getElementById("inStockMobile") || inStockCheckbox;
const onSaleCheckboxMobile =
  document.getElementById("onSaleMobile") || onSaleCheckbox;
const ratingRadiosMobile =
  document.querySelectorAll('input[name="ratingMobile"]') || ratingRadios;

const mobileFilterBtn = document.getElementById("mobileFilterBtn");
const mobileFilterDrawer = document.getElementById("mobileFilterDrawer");
const closeDrawer = document.getElementById("closeDrawer");

// 2️⃣ Display products function
function displayProducts(list) {
  productGrid.innerHTML = "";

  if (list.length === 0) {
    productGrid.innerHTML = `<p class="no-results">No products found.</p>`;
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <div class="info">
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;

    // Navigate to details page when clicking card (except Add to Cart button)
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("add-cart-btn")) {
        window.location.href = `product_details.html?id=${product.id}`;
      }
    });

    // Add to cart button
    // const btn = card.querySelector(".add-cart-btn");
    // btn.addEventListener("click", (e) => {
    //   e.stopPropagation();
    //   alert(`"${product.name}" added to cart!`);
    // });

    productGrid.appendChild(card);
  });
}

function isMobileView() {
  return window.innerWidth <= 768; // adjust breakpoint
}

// 3️⃣ Filter & sort products
function filterProducts() {
  // Read all filter values from desktop
  const categoryDesktop = categorySelect?.value || "all";
  const maxPriceDesktop = parseInt(priceRange?.value) || Infinity;
  const sortDesktop = sortSelect?.value || "default";
  const inStockDesktop = inStockCheckbox?.checked || false;
  const onSaleDesktop = onSaleCheckbox?.checked || false;
  const ratingDesktop =
    parseInt(document.querySelector('input[name="rating"]:checked')?.value) ||
    0;

  // Read all filter values from mobile
  const categoryMobile = categorySelectMobile?.value || "all";
  const maxPriceMobile = parseInt(priceRangeMobile?.value) || Infinity;
  const sortMobile = sortSelectMobile?.value || "default";
  const inStockMobileVal = inStockCheckboxMobile?.checked || false;
  const onSaleMobileVal = onSaleCheckboxMobile?.checked || false;
  const ratingMobile =
    parseInt(
      document.querySelector('input[name="ratingMobile"]:checked')?.value
    ) || 0;

  // Read search text (shared)
  const searchText = searchInput?.value?.toLowerCase() || "";

  // Decide which set of filters to use based on which element triggered the event
  // Or simply filter products using **both sets independently** if you want
  // For simplicity, we combine them here: if desktop filter differs from default, use desktop
  const category = categoryDesktop !== "all" ? categoryDesktop : categoryMobile;
  const maxPrice =
    maxPriceDesktop !== Infinity ? maxPriceDesktop : maxPriceMobile;
  const sortBy = sortDesktop !== "default" ? sortDesktop : sortMobile;
  const inStock = inStockDesktop || inStockMobileVal;
  const onSale = onSaleDesktop || onSaleMobileVal;
  const minRating = ratingDesktop || ratingMobile;

  let filtered = products.filter((p) => {
    return (
      (category === "all" || p.category === category) &&
      p.name.toLowerCase().includes(searchText) &&
      p.price <= maxPrice &&
      (!minRating || p.rating >= minRating) &&
      (!inStock || p.inStock === true) &&
      (!onSale || p.onSale === true)
    );
  });

  // Sorting
  if (sortBy === "lowToHigh") filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "highToLow") filtered.sort((a, b) => b.price - a.price);
  if (sortBy === "aToZ") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "zToA") filtered.sort((a, b) => b.name.localeCompare(a.name));

  displayProducts(filtered);
}

// 4️⃣ Attach event listeners for filters
categorySelect.addEventListener("change", filterProducts);
searchInput.addEventListener("input", filterProducts);
priceRange.addEventListener("input", () => {
  priceValue.textContent = `₹0 - ₹${priceRange.value}`;
  filterProducts();
});
sortSelect.addEventListener("change", filterProducts);
inStockCheckbox.addEventListener("change", filterProducts);
onSaleCheckbox.addEventListener("change", filterProducts);
ratingRadios.forEach((r) => r.addEventListener("change", filterProducts));

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
  inStockCheckbox?.addEventListener("change", filterProducts);
  onSaleCheckbox?.addEventListener("change", filterProducts);
  ratingRadios.forEach((r) => r.addEventListener("change", filterProducts));

  // Mobile
  categorySelectMobile?.addEventListener("change", filterProducts);
  priceRangeMobile?.addEventListener("input", () => {
    priceValueMobile.textContent = `₹0 - ₹${priceRangeMobile.value}`;
    filterProducts();
  });
  sortSelectMobile?.addEventListener("change", filterProducts);
  inStockCheckboxMobile?.addEventListener("change", filterProducts);
  onSaleCheckboxMobile?.addEventListener("change", filterProducts);
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
