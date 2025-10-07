const products = [
  {
    id: 1,
    name: "Fresh Mangoes",
    price: 80,
    category: "fruits",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 2,
    name: "Organic Tomatoes",
    price: 40,
    category: "vegetables",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 3,
    name: "Rice",
    price: 60,
    category: "grains",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 4,
    name: "Strawberries",
    price: 150,
    category: "fruits",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 5,
    name: "Carrots",
    price: 50,
    category: "vegetables",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 6,
    name: "Bananas",
    price: 30,
    category: "fruits",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 7,
    name: "Broccoli",
    price: 70,
    category: "vegetables",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 8,
    name: "Wheat Flour",
    price: 45,
    category: "grains",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 9,
    name: "Blueberries",
    price: 200,
    category: "fruits",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 10,
    name: "Spinach",
    price: 35,
    category: "vegetables",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 11,
    name: "Quinoa",
    price: 120,
    category: "grains",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 12,
    name: "Pineapple",
    price: 90,
    category: "fruits",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 13,
    name: "Cucumber",
    price: 25,
    category: "vegetables",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 14,
    name: "Barley",
    price: 55,
    category: "grains",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
  {
    id: 15,
    name: "Mangoes (Alphonso)",
    price: 180,
    category: "fruits",
    img: "https://dummyimage.com/600x400/a877a8/fff.png",
  },
];

//   <span class="wishlist">&#9825;</span>;

const productGrid = document.querySelector(".products-grid");
const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

// Display products
function displayProducts(list) {
  productGrid.innerHTML = "";
  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <div class="info">
        <h3>${product.name}</h3>
        <p>₹${product.price}/kg</p>
        <button class="add-cart-btn">Add to Cart</button>
      </div>
    `;

    // Add event for card click (excluding button)
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("add-cart-btn")) {
        window.location.href = `product.html?id=${product.id}`;
      }
    });

    // Add to cart button
    const btn = card.querySelector(".add-cart-btn");
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent redirect
      alert(`Product ${product.id} added to cart!`);
    });

    productGrid.appendChild(card);
  });
}

// Filter function combining all filters
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
  priceValue.textContent = `$0 - ₹${priceRange.value}`;
  filterProducts();
});

// Initial load
priceValue.textContent = `$0 - ₹${priceRange.value}`;
displayProducts(products);
const mobileFilterBtn = document.getElementById("mobileFilterBtn");
const mobileFilterDrawer = document.getElementById("mobileFilterDrawer");
const closeDrawer = document.getElementById("closeDrawer");

mobileFilterBtn.addEventListener("click", () => {
  mobileFilterDrawer.classList.add("open");
});

closeDrawer.addEventListener("click", () => {
  mobileFilterDrawer.classList.remove("open");
});

// Optional: click outside drawer to close
window.addEventListener("click", (e) => {
  if (e.target === mobileFilterDrawer) {
    mobileFilterDrawer.classList.remove("open");
  }
});
