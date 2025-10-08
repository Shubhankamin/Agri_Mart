// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

// Find product
const product = products.find((p) => p.id === productId);

if (product) {
  const breadcrumbContainer = document.getElementById("breadcrumb");
  breadcrumbContainer.innerHTML = `
    <a href="index.html">Home</a> /
    <a href="category.html?category=${encodeURIComponent(product.category)}">${
    product.category
  }</a> /
    <span>${product.name}</span>
  `;
  // Basic Info
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = `₹${product.price}`;
  document.getElementById("productDescription").textContent =
    product.description;
  document.getElementById("mainImage").src = product.img;
  document.getElementById("mainImage").alt = product.name;

  // Create thumbnails
  const thumbnailsContainer = document.getElementById("thumbnails");
  const thumbnailImages = [product.img, product.img, product.img, product.img];

  thumbnailImages.forEach((imgSrc, index) => {
    const thumbnail = document.createElement("img");
    thumbnail.src = imgSrc;
    thumbnail.alt = `${product.name} thumbnail ${index + 1}`;
    thumbnail.classList.add("thumbnail");
    if (index === 0) thumbnail.classList.add("active");

    thumbnail.addEventListener("click", function () {
      document.getElementById("mainImage").src = imgSrc;
      document
        .querySelectorAll(".thumbnail")
        .forEach((thumb) => thumb.classList.remove("active"));
      this.classList.add("active");
    });

    thumbnailsContainer.appendChild(thumbnail);
  });

  // Rating
  const fullStars = Math.floor(product.rating);
  const halfStar = product.rating % 1 >= 0.5;

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

  const totalStars = 5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    const emptyStar = document.createElement("i");
    emptyStar.classList.add("far", "fa-star");
    starsContainer.appendChild(emptyStar);
  }

  const ratingText = document.createElement("span");
  ratingText.classList.add("rating-text");
  ratingText.textContent = `${product.rating} (${product.reviews} reviews)`;

  document.getElementById("productRating").appendChild(starsContainer);
  document.getElementById("productRating").appendChild(ratingText);

  // Old Price & Discount
  const oldPrice = Math.floor(product.price * 1.2);
  document.getElementById("oldPrice").textContent = `₹${oldPrice}`;
  document.getElementById("discount").textContent = `20% OFF`;

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
  document.getElementById(
    "detailsInfo"
  ).textContent = `Origin: ${product.origin}, Freshness: ${product.freshness}, Delivery: ${product.deliveryTime}`;

  // Quantity
  let quantity = 1;
  const quantityEl = document.getElementById("quantity");

  document.getElementById("increaseQty").addEventListener("click", () => {
    if (quantity < product.stock) quantity++;
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
    const currentCount = parseInt(cartCount.textContent);
    cartCount.textContent = currentCount + quantity;
  });

  // Buy Now
  document.getElementById("buyNow").addEventListener("click", () => {
    alert("Redirecting to checkout...");
  });
}

// Similar products
const similarProducts = products.filter(
  (p) => p.category === product.category && p.id !== product.id
);

const carousel = document.getElementById("similarProductsCarousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

similarProducts.forEach((p) => {
  const card = document.createElement("div");
  card.classList.add("product-card");
  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}" />
    <h4>${p.name}</h4>
    <p>₹${p.price}</p>
    <a href="product_details.html?id=${p.id}" class="view-btn">View</a>
  `;
  carousel.appendChild(card);
});

const getCardsToScroll = () => {
  const width = window.innerWidth;
  if (width >= 1024) return 1;
  if (width >= 768) return 1;
  return 1;
};

const getCardWidth = () => {
  const card = carousel.querySelector(".product-card");
  if (!card) return 0;
  const gap = 16;
  return card.offsetWidth + gap;
};

const updateButtons = () => {
  prevBtn.disabled = carousel.scrollLeft <= 0;
  nextBtn.disabled =
    carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth;
};

const scrollRight = () => {
  const cardsToScroll = getCardsToScroll();
  const cardWidth = getCardWidth();
  if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
    carousel.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    carousel.scrollBy({ left: cardWidth * cardsToScroll, behavior: "smooth" });
  }
  setTimeout(updateButtons, 300);
};

const scrollLeft = () => {
  const cardsToScroll = getCardsToScroll();
  const cardWidth = getCardWidth();
  carousel.scrollBy({ left: -cardWidth * cardsToScroll, behavior: "smooth" });
  setTimeout(updateButtons, 300);
};

nextBtn.addEventListener("click", scrollRight);
prevBtn.addEventListener("click", scrollLeft);
carousel.addEventListener("scroll", updateButtons);
window.addEventListener("resize", updateButtons);
updateButtons();

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
