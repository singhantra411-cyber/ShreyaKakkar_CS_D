const themeToggle = document.getElementById("themeToggle");
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const messageInput = document.getElementById("messageInput");
const formFeedback = document.getElementById("formFeedback");
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll("main section[id]");

// 1. Dark / Light Theme Toggle with saved preference
const savedTheme = localStorage.getItem("portfolio_theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "Light Mode";
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("portfolio_theme", isDark ? "dark" : "light");
});

// 2. Highlight active section in navbar on scroll
window.addEventListener("scroll", () => {
  let currentId = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 130;
    if (window.scrollY >= top) {
      currentId = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
});

// 3. JavaScript Contact Form Validation
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message) {
    formFeedback.style.color = "#ef4444";
    formFeedback.textContent = "Please fill out your name, email, and message.";
    return;
  }

  if (!emailPattern.test(email)) {
    formFeedback.style.color = "#ef4444";
    formFeedback.textContent = "Please enter a valid email address.";
    return;
  }

  formFeedback.style.color = "#10b981";
  formFeedback.textContent = `Thank you, ${name}! Your message has been validated and sent.`;
  contactForm.reset();
});