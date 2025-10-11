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
