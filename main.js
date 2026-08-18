const timeNode = document.querySelector('#bat-countdown');
const daysNode = document.querySelector('#cd-days');
const hoursNode = document.querySelector('#cd-hours');
const minsNode = document.querySelector('#cd-mins');
const secsNode = document.querySelector('#cd-secs');

if (timeNode && daysNode && hoursNode && minsNode && secsNode) {
  const target = new Date(timeNode.dataset.target).getTime();

  const tick = () => {
    const diff = Math.max(target - Date.now(), 0);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    [daysNode, hoursNode, minsNode, secsNode].forEach((node, index) => {
      const values = [days, hours, minutes, seconds];
      node.textContent = String(values[index]).padStart(2, '0');
    });

    if (diff === 0) {
      clearInterval(timer);
    }
  };

  const timer = setInterval(tick, 1000);
  tick();
}

const navLinks = [...document.querySelectorAll('header nav a')];
const sections = [...document.querySelectorAll('main section')];

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

if ('IntersectionObserver' in window && navLinks.length && sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    });
  }, { threshold: 0.5 });

  sections.forEach((section) => observer.observe(section));
}

const form = document.querySelector('#mission-form');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const requiredFields = [...form.querySelectorAll('input[required], textarea[required], select[required]')];
    const invalid = requiredFields.some((field) => {
      if (field.type === 'checkbox') return !field.checked;
      return !field.value.trim();
    });

    if (invalid) {
      const msg = document.createElement('p');
      msg.textContent = '[GCPD TERMINAL]: INVALID TRANSMISSION. COMPLETE ALL REQUIRED FIELDS.';
      msg.style.color = '#ff6b6b';
      msg.style.fontFamily = 'Fira Code, monospace';
      msg.style.marginTop = '1rem';
      const old = form.parentElement.querySelector('.terminal-status');
      if (old) old.remove();
      msg.className = 'terminal-status';
      form.parentElement.appendChild(msg);
      return;
    }

    const msg = document.createElement('p');
    msg.textContent = '[GCPD TERMINAL]: TRANSMISSION RECEIVED. MISSION ACCEPTED.';
    msg.style.color = '#4ade80';
    msg.style.fontFamily = 'Fira Code, monospace';
    msg.style.marginTop = '1rem';
    const old = form.parentElement.querySelector('.terminal-status');
    if (old) old.remove();
    msg.className = 'terminal-status';
    form.parentElement.appendChild(msg);
    form.reset();
  });
}
