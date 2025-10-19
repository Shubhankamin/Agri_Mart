// --- SHARED NAVIGATION & CART LOGIC ---

// Get current user from localStorage
const currentUser = localStorage.getItem("currentUser");
const user = currentUser ? JSON.parse(currentUser) : null;

// Add dynamic navbar links to both desktop and mobile menus
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

// Update cart count in both desktop and mobile headers
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

// Setup all navigation event listeners
function setupNavigationEventListeners() {
  // Dropdown logic for both desktop and mobile
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

  // Global click listener to close dropdowns when clicking outside
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.active").forEach(dropdown => {
      dropdown.classList.remove("active");
    });
  });

  // --- MOBILE MENU TOGGLE LOGIC ---
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileCloseBtn = document.querySelector(".mobile-close-btn"); 
  const body = document.body;

  if (mobileMenuToggle && navLinks && mobileOverlay) {
    const toggleMenu = () => {
      mobileMenuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
      body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
    };
    mobileMenuToggle.addEventListener("click", toggleMenu);
    mobileOverlay.addEventListener("click", toggleMenu);
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener("click", toggleMenu);
    }
  }
}

// --- MAIN INITIALIZATION SCRIPT ---
document.addEventListener("DOMContentLoaded", () => {
  // Initialize shared components on the page
  setupDynamicLinks();
  updateCartCount();
  updateProfileUI(); // ✅ update profile details
  setupNavigationEventListeners();

  // --- BLOG PAGE SPECIFIC LOGIC ---
  const blogContainer = document.getElementById('blog-container');

  if (blogContainer) {
    // UPDATED: Now contains all 6 blog posts
    const posts = [
      {
        title: "Sustainable Farming Practices",
        description: "Discover how eco-friendly farming methods can protect our planet while improving crop yields for future generations, ensuring soil fertility and biodiversity.",
        image: "/Images/blog1.jpg",
        altLayout: false
      },
      {
        title: "The Future of Organic Agriculture",
        description: "Organic farming is reshaping global agriculture by emphasizing soil health and chemical-free produce. Explore the growing consumer demand and market opportunities.",
        image: "/Images/blog2.jpg",
        altLayout: true
      },
      {
        title: "Smart Irrigation Systems",
        description: "Explore how AI and IoT-driven irrigation technologies conserve precious water while ensuring optimal crop hydration, empowering farmers to manage resources effectively.",
        image: "/Images/blog3.jpg",
        altLayout: false
      },
      {
        title: "Seed Selection for High Yield",
        description: "Choosing the right seeds is crucial. Learn how modern research helps farmers boost productivity, resist pests, and adapt to changing climate conditions.",
        image: "/Images/blog4.jpg",
        altLayout: true
      },
      {
        title: "The Farm-to-Table Revolution",
        description: "Connecting farmers directly with consumers ensures transparency, freshness, and fair pricing. Discover how this model supports sustainable food systems.",
        image: "/Images/blog5.jpg",
        altLayout: false
      },
      {
        title: "Evolution of Agricultural Machinery",
        description: "From autonomous tractors to drone surveillance, modern machines are transforming agriculture. See how advanced machinery enables precision farming and better yields.",
        image: "/Images/blog6.jpg",
        altLayout: true
      }
    ];

    blogContainer.innerHTML = '';
    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = `blog-card ${post.altLayout ? 'alt' : ''}`;
      
      card.innerHTML = `
        <div class="blog-image">
          <img src="${post.image}" alt="${post.title}">
        </div>
        <div class="blog-content">
          <h3>${post.title}</h3>
          <p>${post.description}</p>
        </div>
      `;
      
      blogContainer.appendChild(card);
    });
  }
});
