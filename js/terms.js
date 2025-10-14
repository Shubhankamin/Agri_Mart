// --- SHARED NAVIGATION & CART LOGIC ---

// Get current user from localStorage
const currentUser = localStorage.getItem("currentUser");
const user = currentUser ? JSON.parse(currentUser) : null;

// Add dynamic navbar links
function setupDynamicLinks() {
  const containers = document.querySelectorAll(".dynamic-links");
  if (containers.length === 0) return;

  containers.forEach(container => {
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

// Setup Event Listeners for Navigation
function setupNavigationEventListeners() {
  // --- DROPDOWN LOGIC FOR BOTH DESKTOP & MOBILE ---
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const dropdown = toggle.closest(".dropdown");
      if (dropdown) {
        document.querySelectorAll(".dropdown.active").forEach(openDropdown => {
          if (openDropdown !== dropdown) openDropdown.classList.remove("active");
        });
        dropdown.classList.toggle("active");
      }
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.active").forEach(dropdown => {
      dropdown.classList.remove("active");
    });
  });

  // --- MOBILE MENU TOGGLE LOGIC ---
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileCloseBtn = document.querySelector(".mobile-close-btn"); // Get the new close button
  const body = document.body;
  const close=document.getElementById('closeDrawer');


  if (mobileMenuToggle && navLinks && mobileOverlay) {
    const toggleMenu = () => {
      mobileMenuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
      body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
    };
    mobileMenuToggle.addEventListener("click", toggleMenu);
    // mobileOverlay.addEventListener("click", toggleMenu);
    close.addEventListener("click", toggleMenu);

    if (mobileCloseBtn) { // Add listener for the close button
      mobileCloseBtn.addEventListener("click", toggleMenu);
    }
  }
}



// --- MAIN INITIALIZATION SCRIPT ---

document.addEventListener("DOMContentLoaded", () => {
  // Initialize shared components on the page
  setupDynamicLinks();
  updateCartCount();
  setupNavigationEventListeners();
});