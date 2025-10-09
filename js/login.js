const customerTab = document.getElementById("customerTab");
const farmerTab = document.getElementById("farmerTab");
const farmerField = document.querySelector(".farmer-field");

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const farmerIdInput = document.getElementById("loginFarmerId");

let isFarmer = false;

// Theme toggle logic
const themeToggle = document.getElementById("themeToggle");

// Check saved theme in localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

// Toggle on button click
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  }
});

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

// Simple validation functions
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPassword(password) {
  return password.length >= 6;
}
function isValidFarmerId(id) {
  return /^[A-Z0-9]{6,12}$/.test(id); // same format as signup
}

// Enable/disable login button
const loginBtn = document.querySelector(".signup-btn");
function validateForm() {
  const emailValid = isValidEmail(emailInput.value);
  const passwordValid = isValidPassword(passwordInput.value);
  const farmerIdValid = isFarmer ? isValidFarmerId(farmerIdInput.value) : true;

  if (emailValid && passwordValid && farmerIdValid) {
    loginBtn.disabled = false;
    loginBtn.style.opacity = 1;
    loginBtn.style.cursor = "pointer";
  } else {
    loginBtn.disabled = true;
    loginBtn.style.opacity = 0.6;
    loginBtn.style.cursor = "not-allowed";
  }
}

// Listen for input changes
[emailInput, passwordInput, farmerIdInput].forEach((input) => {
  if (input) input.addEventListener("input", validateForm);
});

// Login form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email exists
  const existingUser = users.find((u) => u.email === emailInput.value.trim());

  if (!existingUser) {
    showSnackbar("User not found. Please sign up first.", "error");
    return;
  }

  // Verify credentials
  const user = users.find(
    (u) =>
      u.email === emailInput.value.trim() &&
      u.password === passwordInput.value &&
      u.role === (isFarmer ? "farmer" : "customer") &&
      (!isFarmer || u.farmerId === farmerIdInput.value.trim())
  );

  if (user) {
    // Store current logged-in user separately
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role,
        farmerId: user.farmerId || null,
      })
    );

    showSnackbar(`Welcome back, ${user.name}!`, "success");
    window.location.href = "index.html"; // Redirect to homepage or dashboard
  } else {
    showSnackbar("Invalid credentials or role. Please try again.", "error");
  }
});

// Initial validation
validateForm();
function showSnackbar(message, type = "info") {
  const snackbar = document.getElementById("snackbar");
  snackbar.textContent = message;

  // Different colors based on type
  if (type === "success") snackbar.style.backgroundColor = "#66bb6a";
  else if (type === "error") snackbar.style.backgroundColor = "#e74c3c";
  else snackbar.style.backgroundColor = "#333";

  snackbar.classList.add("show");

  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 3000); // hide after 3 seconds
}
