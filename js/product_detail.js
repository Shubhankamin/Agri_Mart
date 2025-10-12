// ---------------------------
// IndexedDB setup
// ---------------------------
let db;
let allProducts = []; // merged products

const request = indexedDB.open("AgriMartDB", 1);

request.onerror = (e) => console.error("DB error:", e);

request.onsuccess = (e) => {
  db = e.target.result;
  loadAllProducts();
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

// Load products from IndexedDB + data.js
function loadAllProducts() {
  const tx = db.transaction("products", "readonly");
  const store = tx.objectStore("products");
  const request = store.getAll();

  request.onsuccess = (e) => {
    const dbProducts = e.target.result.map((p) => ({
      ...p,
      img: (p.images || []).map((base64) => ({ src: base64 })), // convert base64 strings to {src: ...}
    }));
    allProducts = [...products, ...dbProducts];
    console.log("Merged products:", allProducts);

    // Now run the existing product display code
    displayProductDetails();
  };
}

// ---------------------------
// Existing product display logic
// ---------------------------
function displayProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));

  // Use merged products here
  const product = allProducts.find((p) => p.id === productId);
  console.log("Product ID:", product);

  if (product) {
    const breadcrumbContainer = document.getElementById("breadcrumb");
    breadcrumbContainer.innerHTML = `
      <a href="index.html">Home</a> /
      <a href="category.html?category=${encodeURIComponent(product.category)}">
        ${product.category}
      </a> /
      <span>${product.name}</span>
    `;

    // Basic Info
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productPrice").textContent = `₹${product.price}`;
    document.getElementById("productDescription").textContent =
      product.description;
    document.getElementById("mainImage").src =
      product.img[0]?.src || "images/no-image.png";
    document.getElementById("mainImage").alt = product.name;

    // Thumbnails
    const thumbnailsContainer = document.getElementById("thumbnails");
    thumbnailsContainer.innerHTML = "";
    if (Array.isArray(product.img) && product.img.length > 0) {
      product.img.forEach((imgObj, index) => {
        const thumbnail = document.createElement("img");
        thumbnail.src = imgObj.src;
        thumbnail.alt = `${product.name} thumbnail ${index + 1}`;
        thumbnail.classList.add("thumbnail");
        if (index === 0) thumbnail.classList.add("active");

        thumbnail.addEventListener("click", function () {
          document.getElementById("mainImage").src = imgObj.src;
          document
            .querySelectorAll(".thumbnail")
            .forEach((thumb) => thumb.classList.remove("active"));
          this.classList.add("active");
        });

        thumbnailsContainer.appendChild(thumbnail);
      });
    } else {
      const fallback = document.createElement("img");
      fallback.src = "images/no-image.png";
      fallback.alt = "No image available";
      thumbnailsContainer.appendChild(fallback);
    }

    // Rating
    const fullStars = Math.floor(product.rating || 0);
    const halfStar = (product.rating || 0) % 1 >= 0.5;
    const starsContainer = document.createElement("div");
    starsContainer.classList.add("stars");

    for (let i = 0; i < fullStars; i++) {
      const star = document.createElement("i");
      star.classList.add("fas", "fa-star");
      starsContainer.appendChild(star);
    }
    if (halfStar) {
      const halfStarEl = document.createElement("i");
      halfStarEl.classList.add("fas", "fa-star-half-alt");
      starsContainer.appendChild(halfStarEl);
    }
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      const emptyStar = document.createElement("i");
      emptyStar.classList.add("far", "fa-star");
      starsContainer.appendChild(emptyStar);
    }

    const ratingText = document.createElement("span");
    ratingText.classList.add("rating-text");
    ratingText.textContent = `${product.rating || 0} (${
      product.reviews || 0
    } reviews)`;

    const ratingContainer = document.getElementById("productRating");
    ratingContainer.innerHTML = "";
    ratingContainer.appendChild(starsContainer);
    ratingContainer.appendChild(ratingText);

    // Old Price & Discount
    document.getElementById("oldPrice").textContent = `₹${Math.floor(
      (product.price || 0) * 1.2
    )}`;
    document.getElementById("discount").textContent = "20% OFF";

    // Features
    const features = [
      "Safe & Fresh",
      "Organic",
      "Eco-friendly",
      "Locally Sourced",
    ];
    const featuresIcons = [
      "fas fa-shield-alt",
      "fas fa-leaf",
      "fas fa-recycle",
      "fas fa-truck",
    ];
    const featuresContainer = document.getElementById("features");
    featuresContainer.innerHTML = "";
    features.forEach((f, i) => {
      const div = document.createElement("div");
      div.classList.add("feature");
      div.innerHTML = `<i class="${featuresIcons[i]}"></i><span>${f}</span>`;
      featuresContainer.appendChild(div);
    });

    // Details Info
    document.getElementById("detailsInfo").textContent = `Origin: ${
      product.origin || "Unknown"
    }, Freshness: ${product.freshness || "N/A"}, Delivery: ${
      product.deliveryTime || "2-4 days"
    }`;

    // Quantity
    let quantity = 1;
    const quantityEl = document.getElementById("quantity");
    quantityEl.textContent = quantity;

    document.getElementById("increaseQty").addEventListener("click", () => {
      if (quantity < (product.stock || 10)) quantity++;
      quantityEl.textContent = quantity;
    });

    document.getElementById("decreaseQty").addEventListener("click", () => {
      if (quantity > 1) quantity--;
      quantityEl.textContent = quantity;
    });

    // Add to Cart
    document.getElementById("addToCart").addEventListener("click", () => {
      showNotification(`${quantity} x ${product.name} added to cart!`);
      const cartCount = document.querySelector(".cart-count");
      cartCount.textContent = parseInt(cartCount.textContent || 0) + quantity;

      // Optional: redirect to cart page
      // window.location.href = `cart.html?id=${product.id}&qty=${quantity}`;
    });

    const buyNowBtn = document.getElementById("buyNow");
    if (buyNowBtn)
      buyNowBtn.addEventListener("click", () =>
        alert("Redirecting to checkout...")
      );

    // Farmer
    const farmerNameEl = document.getElementById("farmerName");
    if (farmerNameEl)
      farmerNameEl.textContent = product.farmerId || "Unknown";

    // Similar products
    const similarProducts = allProducts.filter(
      (p) => p.category === product.category && p.id !== product.id
    );

    const carousel = document.getElementById("similarProductsCarousel");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    carousel.innerHTML = "";

    similarProducts.forEach((p) => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${p.img[0]?.src || "images/no-image.png"}" alt="${p.name}" />
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <a href="product_details.html?id=${p.id}" class="view-btn">View</a>
      `;
      carousel.appendChild(card);
    });

    const getCardWidth = () => {
      const card = carousel.querySelector(".product-card");
      if (!card) return 0;
      return card.offsetWidth + 16;
    };

    const scrollRight = () =>
      carousel.scrollBy({ left: getCardWidth(), behavior: "smooth" });
    const scrollLeft = () =>
      carousel.scrollBy({ left: -getCardWidth(), behavior: "smooth" });

    nextBtn.addEventListener("click", scrollRight);
    prevBtn.addEventListener("click", scrollLeft);
    carousel.addEventListener("scroll", () => {
      prevBtn.disabled = carousel.scrollLeft <= 0;
      nextBtn.disabled =
        carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth;
    });
  } else {
    console.log("Product not found");
  }
}

// Notification function
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--primary-color);
    color: white;
    padding: 15px 20px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-hover);
    z-index: 1000;
    transform: translateX(150%);
    transition: transform 0.3s ease;
  `;
  document.body.appendChild(notification);
  setTimeout(() => (notification.style.transform = "translateX(0)"), 100);
  setTimeout(() => {
    notification.style.transform = "translateX(150%)";
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}
