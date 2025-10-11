document.addEventListener('DOMContentLoaded', function() {
  // Insert current year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Intersection Observer to animate sections and headings
  const sections = document.querySelectorAll('.section');
  const headings = document.querySelectorAll('.section .animate-heading');

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, options);

  sections.forEach(sec => {
    observer.observe(sec);
  });
  headings.forEach(h => {
    observer.observe(h);
  });
});
