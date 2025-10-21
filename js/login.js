// -------------------- LOGIN PAGE LOGIC --------------------
const customerTab = document.getElementById("customerTab");
const farmerTab = document.getElementById("farmerTab");
const farmerField = document.querySelector(".farmer-field");

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const farmerIdInput = document.getElementById("loginFarmerId");
const loginBtn = document.querySelector(".signup-btn");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const farmerIdError = document.getElementById("farmerIdError");

let isFarmer = false;

// Theme toggle logic
// const themeToggle = document.getElementById("themeToggle");

// Check saved theme in localStorage
// const savedTheme = localStorage.getItem("theme");
// if (savedTheme) {
//   document.documentElement.setAttribute("data-theme", savedTheme);
//   themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
// }

// Toggle on button click
// themeToggle.addEventListener("click", () => {
//   const currentTheme = document.documentElement.getAttribute("data-theme");
//   if (currentTheme === "dark") {
//     document.documentElement.setAttribute("data-theme", "light");
//     localStorage.setItem("theme", "light");
//     themeToggle.textContent = "🌙";
//   } else {
//     document.documentElement.setAttribute("data-theme", "dark");
//     localStorage.setItem("theme", "dark");
//     themeToggle.textContent = "☀️";
//   }
// });

// -------------------- ROLE TOGGLE --------------------
if (customerTab && farmerTab) {
  customerTab.addEventListener("click", () => {
    isFarmer = false;
    customerTab.classList.add("active");
    farmerTab.classList.remove("active");
    farmerField?.classList.add("hidden");
    validateForm();
  });

  farmerTab.addEventListener("click", () => {
    isFarmer = true;
    farmerTab.classList.add("active");
    customerTab.classList.remove("active");
    farmerField?.classList.remove("hidden");
    validateForm();
  });
}

// Auto-uppercase Farmer ID
if (farmerIdInput) {
  farmerIdInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
    validateForm();
  });
}

// -------------------- VALIDATION --------------------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

function isValidFarmerId(id) {
  return /^[A-Z0-9-]{6,15}$/.test(id);
}

function validateForm() {
  let isValid = true;

  // Email validation
  if (!isValidEmail(emailInput.value.trim())) {
    emailError.textContent = "Enter a valid email address.";
    isValid = false;
  } else {
    emailError.textContent = "";
  }

  // Password validation
  if (!isValidPassword(passwordInput.value)) {
    passwordError.textContent = "Password must be at least 6 characters.";
    isValid = false;
  } else {
    passwordError.textContent = "";
  }

  // Farmer ID validation (only if farmer selected)
  if (isFarmer) {
    if (!isValidFarmerId(farmerIdInput.value.trim())) {
      farmerIdError.textContent = "Enter a valid Farmer ID (A-Z, 0-9, -).";
      isValid = false;
    } else {
      farmerIdError.textContent = "";
    }
  } else {
    farmerIdError.textContent = "";
  }

  loginBtn.disabled = !isValid;
  loginBtn.style.opacity = isValid ? 1 : 0.6;
  loginBtn.style.cursor = isValid ? "pointer" : "not-allowed";

  return isValid;
}

[emailInput, passwordInput, farmerIdInput].forEach((input) => {
  if (input) input.addEventListener("input", validateForm);
});

// -------------------- LOGIN HANDLER --------------------
loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateForm()) {
    showSnackbar("Please fix the errors and try again.", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const farmerId = farmerIdInput?.value.trim();

  const existingUser = users.find((u) => u.email === email);
  if (!existingUser) {
    showSnackbar("User not found. Please sign up first.", "error");
    return;
  }

  const matchedUser = users.find(
    (u) =>
      u.email === email &&
      u.password === password &&
      u.role === (isFarmer ? "farmer" : "customer") &&
      (!isFarmer || u.farmerId === farmerId)
  );

  if (matchedUser) {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        farmerId: matchedUser.farmerId || null,
      })
    );

    showSnackbar(`Welcome back, ${matchedUser.name}!`, "success");
    setTimeout(() => (window.location.href = "index.html"), 1000);
  } else {
    showSnackbar("Invalid credentials or role. Please try again.", "error");
  }
});

// -------------------- SNACKBAR --------------------
function showSnackbar(message, type = "info") {
  const snackbar = document.getElementById("snackbar");
  if (!snackbar) return;

  snackbar.textContent = message;
  snackbar.style.backgroundColor =
    type === "success" ? "#66bb6a" : type === "error" ? "#e74c3c" : "#333";

  snackbar.classList.add("show");
  setTimeout(() => snackbar.classList.remove("show"), 3000);
}

// -------------------- SHARED NAVIGATION --------------------
const currentUser = localStorage.getItem("currentUser");
const user = currentUser ? JSON.parse(currentUser) : null;

function setupDynamicLinks() {
  const containers = document.querySelectorAll(".dynamic-links");
  containers.forEach((container) => {
    container.innerHTML = "";

    const productsLink = document.createElement("a");
    productsLink.href = "/products.html";
    productsLink.className = "nav-link";
    productsLink.textContent = "Products";
    container.appendChild(productsLink);

    if (user?.role === "farmer") {
      const sellLink = document.createElement("a");
      sellLink.href = "/sell.html";
      sellLink.className = "nav-link";
      sellLink.textContent = "Sell";
      container.appendChild(sellLink);
    }
  });
}

function updateCartCount() {
  const cartCountElem = document.getElementById("cartCount");
  const mobileCartCountElem = document.getElementById("mobileCartCount");
  if (!cartCountElem || !mobileCartCountElem) return;

  const savedCart = JSON.parse(localStorage.getItem("agrimart_cart")) || [];
  const totalItems = savedCart.reduce((sum, item) => sum + item.quantity, 0);

  cartCountElem.textContent = totalItems;
  mobileCartCountElem.textContent = totalItems;
}

function updateProfileUI() {
  const desktopProfile = document.querySelector(".profile-link img");
  const mobileUserName = document.getElementById("mobileUserName");
  const mobileUserEmail = document.getElementById("mobileUserEmail");

  if (user) {
    if (desktopProfile) {
      desktopProfile.src = user.image || "/Images/Profile.png";
      desktopProfile.alt = user.name || "Profile";
    }
    if (mobileUserName) mobileUserName.textContent = user.name || "User";
    if (mobileUserEmail) mobileUserEmail.textContent = user.email || "No email";
  } else {
    if (desktopProfile) {
      desktopProfile.src = "/Images/Profile.png";
      desktopProfile.alt = "Guest";
    }
    if (mobileUserName) mobileUserName.textContent = "Guest User";
    if (mobileUserEmail) mobileUserEmail.textContent = "Login or Sign Up";
  }
}

function setupNavigationEventListeners() {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = toggle.closest(".dropdown");
      document.querySelectorAll(".dropdown.active").forEach((open) => {
        if (open !== dropdown) open.classList.remove("active");
      });
      dropdown.classList.toggle("active");
    });
  });

  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const category = item.getAttribute("data-filter");
      if (category)
        window.location.href = `products.html?category=${encodeURIComponent(
          category
        )}`;
    });
  });

  document.addEventListener("click", () =>
    document
      .querySelectorAll(".dropdown.active")
      .forEach((d) => d.classList.remove("active"))
  );

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

// -------------------- INIT --------------------
document.addEventListener("DOMContentLoaded", () => {
  setupDynamicLinks();
  updateCartCount();
  updateProfileUI();
  setupNavigationEventListeners();
  validateForm();
});
