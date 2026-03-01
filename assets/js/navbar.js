document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll(".section");

  function checkSection() {
    let currentSection = null;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section;
      }
    });

    if (currentSection) {
      if (currentSection.classList.contains("dark-section")) {
        navbar.classList.add("nav-dark");
      } else {
        navbar.classList.remove("nav-dark");
      }
    }
  }

  window.addEventListener("scroll", checkSection);
  checkSection();
});
