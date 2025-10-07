// /js/products.js

const productGrid = document.querySelector(".products-grid");
const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

function displayProducts(list) {
  productGrid.innerHTML = "";
  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <div class="info">
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button class="add-cart-btn">Add to Cart</button>
      </div>
    `;

    // Navigate to details page on click
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("add-cart-btn")) {
        window.location.href = `product_details.html?id=${product.id}`;
      }
    });

    // Add to cart
    const btn = card.querySelector(".add-cart-btn");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      alert(`"${product.name}" added to cart!`);
    });

    productGrid.appendChild(card);
  });
}

function filterProducts() {
  const category = categorySelect.value;
  const searchText = searchInput.value.toLowerCase();
  const maxPrice = parseInt(priceRange.value);

  const filtered = products.filter((p) => {
    const categoryMatch = category === "all" || p.category === category;
    const searchMatch = p.name.toLowerCase().includes(searchText);
    const priceMatch = p.price <= maxPrice;
    return categoryMatch && searchMatch && priceMatch;
  });

  displayProducts(filtered);
}

// Event listeners
categorySelect.addEventListener("change", filterProducts);
searchInput.addEventListener("input", filterProducts);
priceRange.addEventListener("input", () => {
  priceValue.textContent = `₹0 - ₹${priceRange.value}`;
  filterProducts();
});

// Initial
priceValue.textContent = `₹0 - ₹${priceRange.value}`;
displayProducts(products);

const similarProductsContainer = document.getElementById(
  "similarProductsCarousel"
);

// Example: pick 3 random products different from the current one
const similarProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

similarProducts.forEach((p) => {
  const card = document.createElement("div");
  card.classList.add("product-card");
  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}" />
    <h4>${p.name}</h4>
    <p>₹${p.price}</p>
    <a href="product_details.html?id=${p.id}" class="view-btn">View</a>
  `;
  similarProductsContainer.appendChild(card);
});
