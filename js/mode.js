// === Initialize theme on page load ===
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  updateThemeButtons();
}

// === Toggle theme function ===
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const theme = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  localStorage.setItem("theme", theme);
  updateThemeButtons();
}

// === Update button icon/texts ===
function updateThemeButtons() {
  const icon = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";

  // Update all theme toggle buttons
  const buttons = document.querySelectorAll(
    "#themeToggleBtn, #themeToggleBtnMobile"
  );
  buttons.forEach((btn) => (btn.textContent = icon));
}

// === Attach event listeners ===
function attachThemeButtonEvents() {
  const buttons = document.querySelectorAll(
    "#themeToggleBtn, #themeToggleBtnMobile"
  );
  buttons.forEach((btn) => btn.addEventListener("click", toggleTheme));
}

// Initialize after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  attachThemeButtonEvents();
  initializeTheme();
});
