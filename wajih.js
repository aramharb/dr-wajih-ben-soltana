const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');
const form = document.getElementById('appointmentForm');
const formFeedback = document.querySelector('.form-feedback');
const modeToggle = document.querySelector('.mode-toggle');
const header = document.querySelector('.site-header');
const heroButtons = document.querySelectorAll('[data-target]');

const sections = [...document.querySelectorAll('main section[id]')];

window.addEventListener('load', () => {
  document.querySelector('.page-loader').classList.add('hide');
  revealSections();
  animateCounters();
});

window.addEventListener('scroll', () => {
  updateProgress();
  updateNavHighlight();
  toggleBackToTop();
});

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  siteNav.classList.toggle('open');
});

heroButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = event.currentTarget.dataset.target;
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

modeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  modeToggle.textContent = isDark ? '☀️' : '🌙';
});

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function toggleBackToTop() {
  backToTop.style.display = window.scrollY > 500 ? 'flex' : 'none';
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function updateNavHighlight() {
  const threshold = window.innerHeight / 2;
  let currentId = sections[0]?.id;

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top;
    if (top <= threshold) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('stat-card') || entry.target.classList.contains('stat-number')) {
          animateCounters();
        }
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.fade-up').forEach((section) => observer.observe(section));

document.querySelectorAll('.stat-card').forEach((card) => observer.observe(card));

function revealSections() {
  document.querySelectorAll('.fade-up').forEach((section) => {
    if (section.getBoundingClientRect().top < window.innerHeight * 0.9) {
      section.classList.add('visible');
    }
  });
}

function animateCounters() {
  document.querySelectorAll('.stat-number').forEach((counter) => {
    const target = parseFloat(counter.dataset.target);
    const isFloat = String(target).includes('.');
    const duration = 1800;
    const stepTime = 24;
    const steps = Math.ceil(duration / stepTime);
    let currentStep = 0;
    const initial = 0;
    const increment = target / steps;

    if (counter.dataset.running) return;
    counter.dataset.running = 'true';

    const timer = setInterval(() => {
      currentStep += 1;
      const value = initial + increment * currentStep;
      counter.textContent = isFloat ? value.toFixed(1) : Math.round(value);
      if (currentStep >= steps) {
        counter.textContent = isFloat ? target.toFixed(1) : target.toFixed(0);
        clearInterval(timer);
      }
    }, stepTime);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, textarea')];
  let valid = true;

  fields.forEach((field) => {
    const error = field.parentElement.querySelector('.error-message');
    error.textContent = '';
    if (!field.checkValidity()) {
      valid = false;
      if (field.validity.valueMissing) {
        error.textContent = 'Ce champ est requis.';
      } else if (field.validity.typeMismatch) {
        error.textContent = 'Veuillez renseigner une adresse email valide.';
      } else if (field.validity.patternMismatch) {
        error.textContent = 'Veuillez entrer un numéro de téléphone valide à 8 chiffres.';
      }
    }
  });

  if (!valid) {
    formFeedback.textContent = 'Veuillez corriger les champs en rouge avant d’envoyer.';
    return;
  }

  formFeedback.textContent = 'Merci ! Votre demande a bien été envoyée.';
  form.reset();
  setTimeout(() => {
    formFeedback.textContent = '';
  }, 5000);
});
