// -------------------- SIGNUP PAGE LOGIC --------------------

const customerTab = document.getElementById("customerTab");
const farmerTab = document.getElementById("farmerTab");
const farmerField = document.querySelector(".farmer-field");

const signupForm = document.getElementById("signupForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const phoneInput = document.getElementById("phone");
const genderInputs = document.querySelectorAll('input[name="gender"]');
const farmerIdInput = document.getElementById("farmerId");
const signupBtn = document.querySelector(".signup-btn");

let isFarmer = false;

// -------------------- ROLE TOGGLE --------------------
if (customerTab && farmerTab) {
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
}

// Auto-uppercase Farmer ID
if (farmerIdInput) {
  farmerIdInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
    validateForm();
  });
}

// -------------------- VALIDATION HELPERS --------------------
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

// -------------------- SHOW ERROR MESSAGES --------------------
function showError(input, message) {
  let errorEl = input.parentElement.querySelector(".error-message");
  if (!errorEl) {
    errorEl = document.createElement("span");
    errorEl.classList.add("error-message");
    input.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearError(input) {
  const errorEl = input.parentElement.querySelector(".error-message");
  if (errorEl) errorEl.textContent = "";
}

// -------------------- MAIN VALIDATION FUNCTION --------------------
function validateForm() {
  let valid = true;

  // First Name
  if (!isValidName(firstNameInput.value)) {
    showError(firstNameInput, "First name is required.");
    valid = false;
  } else clearError(firstNameInput);

  // Last Name
  if (!isValidName(lastNameInput.value)) {
    showError(lastNameInput, "Last name is required.");
    valid = false;
  } else clearError(lastNameInput);

  // Email
  if (!isValidEmail(emailInput.value)) {
    showError(emailInput, "Enter a valid email address.");
    valid = false;
  } else clearError(emailInput);

  // Password
  if (!isValidPassword(passwordInput.value)) {
    showError(passwordInput, "Password must be at least 6 characters.");
    valid = false;
  } else clearError(passwordInput);

  // Phone
  if (!isValidPhone(phoneInput.value)) {
    showError(phoneInput, "Enter a valid 10-digit phone number.");
    valid = false;
  } else clearError(phoneInput);

  // Gender
  if (!isGenderSelected()) {
    const genderGroup = genderInputs[0].closest(".form-group");
    let errorEl = genderGroup.querySelector(".error-message");
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.classList.add("error-message");
      genderGroup.appendChild(errorEl);
    }
    errorEl.textContent = "Please select your gender.";
    valid = false;
  } else {
    const genderGroup = genderInputs[0].closest(".form-group");
    const errorEl = genderGroup.querySelector(".error-message");
    if (errorEl) errorEl.textContent = "";
  }

  // Farmer ID (only if farmer)
  if (isFarmer) {
    if (!isValidFarmerId(farmerIdInput.value)) {
      showError(farmerIdInput, "Enter a valid Farmer ID (A-Z, 0-9, -).");
      valid = false;
    } else clearError(farmerIdInput);
  }

  signupBtn.disabled = !valid;
  signupBtn.style.opacity = valid ? 1 : 0.6;
  signupBtn.style.cursor = valid ? "pointer" : "not-allowed";

  return valid;
}

// Live validation listeners
[
  firstNameInput,
  lastNameInput,
  emailInput,
  passwordInput,
  phoneInput,
  farmerIdInput,
].forEach((input) => input?.addEventListener("input", validateForm));
genderInputs.forEach((input) => input.addEventListener("change", validateForm));

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

// -------------------- FORM SUBMISSION --------------------
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const emailExists = users.some(
    (u) => u.email.toLowerCase() === emailInput.value.trim().toLowerCase()
  );
  if (emailExists) {
    showSnackbar("Email already registered. Try logging in.", "error");
    return;
  }

  const selectedGender = [...genderInputs].find((i) => i.checked)?.value;

  const newUser = {
    name: `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`,
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

  showSnackbar("Signup successful! Redirecting...", "success");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1200);
});

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
