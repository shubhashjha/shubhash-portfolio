const roles = [
  "Full Stack Software Engineer",
  ".NET Backend Specialist",
  "Azure Workflow Builder",
  "Angular Product Engineer"
];

const body = document.body;
const typingText = document.getElementById("typingText");
const year = document.getElementById("year");
const themeToggle = document.getElementById("themeToggle");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const scrollTopButton = document.getElementById("scrollTop");
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRoles() {
  const currentRole = roles[roleIndex];
  const displayed = deleting
    ? currentRole.slice(0, charIndex--)
    : currentRole.slice(0, charIndex++);

  typingText.textContent = displayed;

  let delay = deleting ? 45 : 95;

  if (!deleting && charIndex === currentRole.length + 1) {
    deleting = true;
    delay = 1400;
  } else if (deleting && charIndex < 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    charIndex = 0;
    delay = 250;
  }

  window.setTimeout(typeRoles, delay);
}

function setTheme(theme) {
  body.classList.toggle("light-theme", theme === "light");
  localStorage.setItem("portfolio-theme", theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme");
  setTheme(savedTheme || "light");
}

function toggleMenu() {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

function updateScrollState() {
  scrollTopButton.classList.toggle("visible", window.scrollY > 520);
}

function activateSectionLink() {
  let activeId = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 140;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("active", isActive);
  });
}

function validateForm() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 2) {
    formStatus.textContent = "Please enter a valid name.";
    formStatus.style.color = "#ff8e72";
    return false;
  }

  if (!emailPattern.test(email)) {
    formStatus.textContent = "Please enter a valid email address.";
    formStatus.style.color = "#ff8e72";
    return false;
  }

  if (message.length < 12) {
    formStatus.textContent = "Message should be at least 12 characters.";
    formStatus.style.color = "#ff8e72";
    return false;
  }

  return { name, email, message };
}

function openMailClient({ name, email, message }) {
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );
  window.location.href = `mailto:shubhash.career@gmail.com?subject=${subject}&body=${body}`;
}

year.textContent = new Date().getFullYear();
initTheme();
typeRoles();
updateScrollState();
activateSectionLink();

themeToggle.addEventListener("click", () => {
  const nextTheme = body.classList.contains("light-theme") ? "dark" : "light";
  setTheme(nextTheme);
});

navToggle.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  updateScrollState();
  activateSectionLink();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = validateForm();
  if (result) {
    formStatus.textContent = "Opening your email app to send the message.";
    formStatus.style.color = "#1d7d87";
    openMailClient(result);
    form.reset();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));
