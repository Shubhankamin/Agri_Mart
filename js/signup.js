const customerTab = document.getElementById("customerTab");
const farmerTab = document.getElementById("farmerTab");
const farmerField = document.querySelector(".farmer-field");

const signupForm = document.getElementById("signupForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const phoneInput = document.getElementById("phone");
const genderInputs = document.querySelectorAll('input[name="gender"]'); // Male/Female only
const farmerIdInput = document.getElementById("farmerId");
const signupBtn = document.querySelector(".signup-btn");

let isFarmer = false;

// Tab logic
customerTab.addEventListener("click", () => {
  isFarmer = false;
  customerTab.classList.add("active");
  farmerTab.classList.remove("active");
  farmerField.classList.add("hidden");
  validateForm();
});

farmerTab.addEventListener("click", () => {
  isFarmer = true;
  farmerTab.classList.add("active");
  customerTab.classList.remove("active");
  farmerField.classList.remove("hidden");
  validateForm();
});

// Auto-uppercase Farmer ID
if (farmerIdInput) {
  farmerIdInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
    validateForm();
  });
}

// Validation functions
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

function isValidName(name) {
  return name.trim().length > 0;
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

function isGenderSelected() {
  return [...genderInputs].some((input) => input.checked);
}

function isValidFarmerId(id) {
  return /^[A-Z0-9-]{6,15}$/.test(id);
}

// Validate form
function validateForm() {
  const firstNameValid = isValidName(firstNameInput.value);
  const lastNameValid = isValidName(lastNameInput.value);
  const emailValid = isValidEmail(emailInput.value);
  const passwordValid = isValidPassword(passwordInput.value);
  const phoneValid = isValidPhone(phoneInput.value);
  const genderValid = isGenderSelected();
  const farmerIdValid = isFarmer ? isValidFarmerId(farmerIdInput.value) : true;

  if (
    firstNameValid &&
    lastNameValid &&
    emailValid &&
    passwordValid &&
    phoneValid &&
    genderValid &&
    farmerIdValid
  ) {
    signupBtn.disabled = false;
    signupBtn.style.opacity = 1;
    signupBtn.style.cursor = "pointer";
  } else {
    signupBtn.disabled = true;
    signupBtn.style.opacity = 0.6;
    signupBtn.style.cursor = "not-allowed";
  }
}

// Listen to inputs
[
  firstNameInput,
  lastNameInput,
  emailInput,
  passwordInput,
  phoneInput,
  farmerIdInput,
].forEach((input) => {
  if (input) input.addEventListener("input", validateForm);
});
genderInputs.forEach((input) => input.addEventListener("change", validateForm));

// Snackbar function
function showSnackbar(message, type = "info") {
  const snackbar = document.getElementById("snackbar");
  snackbar.textContent = message;

  if (type === "success") snackbar.style.backgroundColor = "#66bb6a";
  else if (type === "error") snackbar.style.backgroundColor = "#e74c3c";
  else snackbar.style.backgroundColor = "#333";

  snackbar.classList.add("show");
  setTimeout(() => snackbar.classList.remove("show"), 3000);
}

// Signup form submission
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const emailExists = users.some((u) => u.email === emailInput.value.trim());
  if (emailExists) {
    showSnackbar("Email already registered. Try logging in.", "error");
    return;
  }

  const selectedGender = [...genderInputs].find(
    (input) => input.checked
  )?.value;

  const newUser = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    phone: phoneInput.value,
    gender: selectedGender,
    role: isFarmer ? "farmer" : "customer",
    farmerId: isFarmer ? farmerIdInput.value.trim() : null,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  console.log("Registered Users:", users);
  showSnackbar("Signup successful! Redirecting to login page...", "success");
  window.location.href = "login.html";
});

// Initial validation
validateForm();
// --- SHARED NAVIGATION & CART LOGIC ---

// Get current user from localStorage
const currentUser = localStorage.getItem("currentUser");
const user = currentUser ? JSON.parse(currentUser) : null;

// Add dynamic navbar links
function setupDynamicLinks() {
  const containers = document.querySelectorAll(".dynamic-links");
  if (containers.length === 0) return;

  containers.forEach((container) => {
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

  // ✅ CATEGORY CLICK HANDLER (for dropdown items)
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // prevent dropdown from closing before click registers
      const category = item.getAttribute("data-filter");
      if (category) {
        window.location.href = `products.html?category=${encodeURIComponent(
          category
        )}`;
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".dropdown.active")
      .forEach((dropdown) => dropdown.classList.remove("active"));
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
