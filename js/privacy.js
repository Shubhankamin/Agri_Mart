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

// --- MAIN INITIALIZATION SCRIPT ---
document.addEventListener("DOMContentLoaded", () => {
  setupDynamicLinks();
  updateCartCount();
  updateProfileUI(); // ✅ added profile update
  setupNavigationEventListeners();
});
