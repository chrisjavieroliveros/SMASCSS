document.addEventListener('DOMContentLoaded', function () {
  // Code tabs functionality
  const codeTabs = document.querySelectorAll('.code-tabs li');
  if (codeTabs.length) {
    codeTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        // Find the parent tab container
        const tabContainer = this.parentElement;

        // Remove active class from all tabs in this container
        tabContainer.querySelectorAll('li').forEach(t => {
          t.classList.remove('active');
        });

        // Add active class to clicked tab
        this.classList.add('active');

        // Here you could add logic to show/hide corresponding content
        // For example with data attributes
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Optional: Add a class to the header when scrolling
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
});
