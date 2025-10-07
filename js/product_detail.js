// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

// Find product
const product = products.find((p) => p.id === productId);

if (product) {
  // Basic Info
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = `₹${product.price}`;
  document.getElementById("productDescription").textContent =
    product.description;
  document.getElementById("mainImage").src = product.img;
  document.getElementById("mainImage").alt = product.name;

  // Rating
  const fullStars = "⭐".repeat(Math.floor(product.rating));
  const halfStar = product.rating % 1 >= 0.5 ? "⭐" : "";
  document.getElementById(
    "productRating"
  ).innerHTML = `${fullStars}${halfStar} <span>(${product.reviews} reviews)</span>`;

  // Old Price & Discount (example)
  document.getElementById("oldPrice").textContent = `₹${Math.floor(
    product.price * 1.2
  )}`;
  document.getElementById("discount").textContent = `20% OFF`;

  // Features
  const features = [
    "Safe & Fresh",
    "Organic",
    "Eco-friendly",
    "Locally Sourced",
  ];
  const featuresIcons = [
    "https://img.icons8.com/?size=24&id=82315&format=png",
    "https://img.icons8.com/?size=24&id=19808&format=png",
    "https://img.icons8.com/?size=24&id=60853&format=png",
    "https://img.icons8.com/?size=24&id=85034&format=png",
  ];

  const featuresContainer = document.getElementById("features");
  featuresContainer.innerHTML = "";
  features.forEach((f, i) => {
    const div = document.createElement("div");
    div.innerHTML = `<img src="${featuresIcons[i]}" /> ${f}`;
    featuresContainer.appendChild(div);
  });

  // Details Info
  document.getElementById(
    "detailsInfo"
  ).textContent = `Origin: ${product.origin}, Freshness: ${product.freshness}, Delivery: ${product.deliveryTime}`;

  // Size options
  const sizeContainer = document.getElementById("sizeOptions");
  sizeContainer.innerHTML = `<button class="size-btn active">${product.weight}</button>`;

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
    alert(`${quantity} x ${product.name} added to cart!`);
  });
}
// Similar products (same category, excluding current product)
const similarProducts = products.filter(
  (p) => p.category === product.category && p.id !== product.id
);

const carousel = document.getElementById("similarProductsCarousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Append cards
similarProducts.forEach((p) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}" class="carousel-img" />
    <h4>${p.name}</h4>
    <p>₹${p.price}</p>
    <a href="product-details.html?id=${p.id}" class="view-btn">View</a>
  `;

  carousel.appendChild(card);
});

// Function to determine how many cards to scroll based on screen width
const getCardsToScroll = () => {
  const width = window.innerWidth;
  if (width >= 1024) return 1;
  if (width >= 768) return 1;
  return 1;
};

// Function to get card width including gap
const getCardWidth = () => {
  const card = carousel.querySelector(".product-card");
  if (!card) return 0;
  const style = window.getComputedStyle(card);
  const gap = 16; // as defined in CSS
  return card.offsetWidth + gap;
};

// Function to update button states
const updateButtons = () => {
  prevBtn.disabled = carousel.scrollLeft <= 0;
  nextBtn.disabled =
    carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth;
};

// Scroll functions
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

// Event listeners
nextBtn.addEventListener("click", scrollRight);
prevBtn.addEventListener("click", scrollLeft);
carousel.addEventListener("scroll", updateButtons);
window.addEventListener("resize", updateButtons);

// Initial button state
updateButtons();

// Auto-scroll every 2 seconds
// if (similarProducts.length > 0) {
//   setInterval(scrollRight, 2000);
// }
