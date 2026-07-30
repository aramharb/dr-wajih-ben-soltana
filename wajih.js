const navToggle = document.querySelector('.nav-toggle');
const navClose = document.querySelector('.nav-close');
const navOverlay = document.querySelector('.nav-overlay');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const tabbarItems = document.querySelectorAll('.tabbar-item');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');
const form = document.getElementById('appointmentForm');
const formFeedback = document.querySelector('.form-feedback');
const modeToggle = document.querySelector('.mode-toggle');
const header = document.querySelector('.site-header');
const heroButtons = document.querySelectorAll('[data-target]');

const sections = [...document.querySelectorAll('main section[id]')];
let ticking = false;

window.addEventListener('load', () => {
  document.querySelector('.page-loader').classList.add('hide');
  revealSections();
  animateCounters();
});

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateProgress();
    updateNavHighlight();
    toggleBackToTop();
    ticking = false;
  });
}, { passive: true });

function openNav() {
  siteNav.classList.add('open');
  navOverlay.classList.add('visible');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-locked');
}

function closeNav() {
  siteNav.classList.remove('open');
  navOverlay.classList.remove('visible');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-locked');
}

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  expanded ? closeNav() : openNav();
});

navClose?.addEventListener('click', closeNav);
navOverlay?.addEventListener('click', closeNav);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNav();
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
    closeNav();
  });
});

modeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  modeToggle.setAttribute('aria-pressed', String(isDark));
  modeToggle.setAttribute('title', isDark ? 'Activer le mode clair' : 'Activer le mode sombre');
  // swap the inline icon for clarity
  modeToggle.innerHTML = isDark
    ? '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM20.24 19.16l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM2 12a1 1 0 011-1h3a1 1 0 010 2H3a1 1 0 01-1-1zM18 11a1 1 0 010 2h3a1 1 0 010-2h-3zM6.76 19.16l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM17.24 4.84l1.79-1.79L17.24 1.26l-1.79 1.79 1.79 1.79zM12 4a1 1 0 011-1v3a1 1 0 01-2 0V3a1 1 0 011 1zM12 17a1 1 0 011 1v3a1 1 0 01-2 0v-3a1 1 0 011-1z"/></svg><span class="sr-only">Activer le mode clair</span>'
    : '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"/></svg><span class="sr-only">Activer le mode sombre</span>';
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
    const isActive = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });

  // sync app-style bottom tab bar (if present)
  tabbarItems.forEach((item) => {
    const href = item.getAttribute('href') || item.dataset.target || '';
    const isActiveTab = href === `#${currentId}`;
    item.classList.toggle('active', isActiveTab);
    if (isActiveTab) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
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
    formFeedback.textContent = 'Veuillez corriger les champs en rouge avant d\'envoyer.';
    return;
  }

  // Initialize EmailJS (free account)
  emailjs.init({
    publicKey: 'GQ_fxyz1234567890ABCD'  // Replace with your actual public key from emailjs.com
  });

  const formData = {
    to_email: 'dr.bensoltanawajih@gmail.com',
    from_name: form.name.value,
    from_email: form.email.value,
    phone: form.phone.value,
    appointment_date: form.date.value,
    message: form.message.value,
    reply_to: form.email.value
  };

  formFeedback.textContent = 'Envoi en cours...';

  emailjs.send('service_appointment', 'template_appointment', formData)
    .then(() => {
      formFeedback.textContent = 'Merci ! Votre demande a bien été envoyée au Dr Ben Soltana Wajih. Vous recevrez un appel de confirmation sous peu.';
      formFeedback.style.color = '#0b6397';
      form.reset();
      setTimeout(() => {
        formFeedback.textContent = '';
        formFeedback.style.color = '';
      }, 8000);
    })
    .catch((error) => {
      formFeedback.textContent = 'Erreur lors de l\'envoi. Veuillez réessayer ou appeler directement: 55 740 439';
      formFeedback.style.color = '#c0392b';
      console.error('EmailJS error:', error);
    });
});

/* Close the mobile drawer automatically if the viewport grows back to desktop size */
window.addEventListener('resize', () => {
  if (window.innerWidth > 780) {
    closeNav();
  }
});
