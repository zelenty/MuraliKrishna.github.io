// Reveal timeline elements on scroll
const items = document.querySelectorAll(".timeline-item");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.3 }
);

items.forEach(item => observer.observe(item));
