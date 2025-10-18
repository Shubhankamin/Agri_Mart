// ===== USER + NAVIGATION SETUP =====
const currentUser = localStorage.getItem("currentUser");
const user = currentUser ? JSON.parse(currentUser) : null;

// --- SHARED NAVIGATION & CART LOGIC ---

// Get current user from localStorage
// const currentUser = localStorage.getItem("currentUser");
// const user = currentUser ? JSON.parse(currentUser) : null;

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

// function setupDynamicLinks() {
//   const containers = document.querySelectorAll(".dynamic-links");
//   if (containers.length === 0) return;
//   containers.forEach(container => {
//     container.innerHTML = "";
//     const productsLink = document.createElement("a");
//     productsLink.href = "/products.html";
//     productsLink.className = "nav-link";
//     productsLink.textContent = "Products";
//     container.appendChild(productsLink);

//     if (user && user.role === "farmer") {
//       const sellLink = document.createElement("a");
//       sellLink.href = "/sell.html";
//       sellLink.className = "nav-link";
//       sellLink.textContent = "Sell";
//       container.appendChild(sellLink);
//     }
//   });
// }

// function updateCartCount() {
//   const cartCountElem = document.getElementById("cartCount");
//   if (!cartCountElem) return;
//   const savedCart = localStorage.getItem("agrimart_cart");
//   const cartData = savedCart ? JSON.parse(savedCart) : [];
//   const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
//   cartCountElem.textContent = totalItems;
// }

// function updateProfileUI() {
//   const desktopProfile = document.querySelector(".profile-link img");
//   if (user) {
//     if (desktopProfile) {
//       desktopProfile.src = user.image || "/Images/Profile.png";
//       desktopProfile.alt = user.name || "Profile";
//     }
//   } else {
//     if (desktopProfile) {
//       desktopProfile.src = "/Images/Profile.png";
//       desktopProfile.alt = "Guest";
//     }
//   }
// }

// function setupNavigationEventListeners() {
//   const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
//   dropdownToggles.forEach(toggle => {
//     toggle.addEventListener("click", (event) => {
//       event.stopPropagation();
//       const dropdown = toggle.closest(".dropdown");
//       if (dropdown) {
//         document.querySelectorAll(".dropdown.active").forEach(openDropdown => {
//           if (openDropdown !== dropdown) openDropdown.classList.remove("active");
//         });
//         dropdown.classList.toggle("active");
//       }
//     });
//   });

//   document.addEventListener("click", () => {
//     document.querySelectorAll(".dropdown.active").forEach(dropdown => {
//       dropdown.classList.remove("active");
//     });
//   });

//   const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
//   const navLinks = document.querySelector(".nav-links");
//   const body = document.body;

//   if (mobileMenuToggle && navLinks) {
//     const toggleMenu = () => {
//       const expanded = mobileMenuToggle.getAttribute("aria-expanded") === "true";
//       mobileMenuToggle.setAttribute("aria-expanded", !expanded);
//       mobileMenuToggle.classList.toggle("active");
//       navLinks.classList.toggle("active");
//       body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
//     };
//     mobileMenuToggle.addEventListener("click", toggleMenu);
//   }
// }

// ===== FORM VALIDATION & SNACKBAR =====
function setupContactFormValidation() {
  const form = document.getElementById("contactForm");
  const sendButton = document.getElementById("sendButton");

  const nameField = form.name;
  const emailField = form.email;
  const phoneField = form.phone;
  const subjectField = form.subject;
  const messageField = form.message;

  const nameError = nameField.nextElementSibling;
  const emailError = emailField.nextElementSibling;
  const phoneError = phoneField.nextElementSibling;
  const subjectError = subjectField.nextElementSibling;
  const messageError = messageField.nextElementSibling;

  const patterns = {
    name: /^[A-Za-z\s]{3,}$/,
    email: /^[a-z0-9._]+@gmail\.com$/i,
    phone: /^[0-9]{10}$/,
  };

  // Restrict invalid input while typing
  nameField.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    validateForm();
  });

  phoneField.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value.length > 10)
      e.target.value = e.target.value.slice(0, 10);
    validateForm();
  });

  emailField.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z0-9._@]/g, "");
    e.target.value = e.target.value.toLowerCase();
    validateForm();
  });

  subjectField.addEventListener("change", validateForm);
  messageField.addEventListener("input", validateForm);

  function showError(elem, msg) {
    elem.textContent = msg;
    elem.style.color = "red";
  }

  function clearError(elem) {
    elem.textContent = "";
  }

  function validateField(field) {
    const value = field.value.trim();
    switch (field.name) {
      case "name":
        if (!value) return "Full name is required.";
        if (!patterns.name.test(value))
          return "Name must be at least 3 letters.";
        break;
      case "email":
        if (!value) return "Email is required.";
        if (!patterns.email.test(value)) return "Enter a valid Gmail address.";
        break;
      case "phone":
        if (value && !patterns.phone.test(value))
          return "Phone must be exactly 10 digits.";
        break;
      case "subject":
        if (!value || value === "none") return "Please select a subject.";
        break;
      case "message":
        if (!value) return "Message cannot be empty.";
        break;
    }
    return "";
  }

  function validateForm() {
    let valid = true;

    const nameMsg = validateField(nameField);
    const emailMsg = validateField(emailField);
    const phoneMsg = validateField(phoneField);
    const subjectMsg = validateField(subjectField);
    const messageMsg = validateField(messageField);

    if (nameMsg) {
      showError(nameError, nameMsg);
      valid = false;
    } else clearError(nameError);
    if (emailMsg) {
      showError(emailError, emailMsg);
      valid = false;
    } else clearError(emailError);
    if (phoneMsg) {
      showError(phoneError, phoneMsg);
      valid = false;
    } else clearError(phoneError);
    if (subjectMsg) {
      showError(subjectError, subjectMsg);
      valid = false;
    } else clearError(subjectError);
    if (messageMsg) {
      showError(messageError, messageMsg);
      valid = false;
    } else clearError(messageError);

    if (valid) {
      sendButton.classList.add("active");
      sendButton.disabled = false;
    } else {
      sendButton.classList.remove("active");
      sendButton.disabled = true;
    }

    sendButton.disabled = !valid;
    return valid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      phone: phoneField.value.trim(),
      subject: subjectField.value,
      message: messageField.value.trim(),
      submittedAt: new Date().toLocaleString(),
    };

    localStorage.setItem("contactFormData", JSON.stringify(data));
    form.reset();
    sendButton.disabled = true;
    showSnackbar("Form submitted successfully!");
  });

  // Initialize button state
  validateForm();
}

// ===== SNACKBAR =====
function showSnackbar(message) {
  let snackbar = document.createElement("div");
  snackbar.className = "snackbar";
  snackbar.textContent = message;
  document.body.appendChild(snackbar);

  snackbar.style.bottom = "-50px";
  snackbar.style.position = "fixed";
  snackbar.style.left = "50%";
  snackbar.style.transform = "translateX(-50%)";
  snackbar.style.backgroundColor = "#4BB543";
  snackbar.style.color = "#fff";
  snackbar.style.padding = "12px 24px";
  snackbar.style.borderRadius = "5px";
  snackbar.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  snackbar.style.transition = "0.5s";

  setTimeout(() => {
    snackbar.style.bottom = "30px";
  }, 50);

  setTimeout(() => {
    snackbar.style.bottom = "-50px";
    setTimeout(() => snackbar.remove(), 500);
  }, 3000);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  // setupDynamicLinks();
  // updateCartCount();
  // updateProfileUI();
  // setupNavigationEventListeners();
  setupContactFormValidation();
});
