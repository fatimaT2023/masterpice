/* A single, once-only entrance sequence; content stays visible without JS. */
(() => {
  const section = document.getElementById('studio');
  if (!section) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const copy = [...section.querySelectorAll('.solution-copy .solution-reveal')];
  const bubbles = [...section.querySelectorAll('.solution-bubble')];
  copy.forEach((item, i) => item.style.setProperty('--solution-delay', `${i * 80}ms`));
  bubbles.forEach((item, i) => item.style.setProperty('--solution-delay', `${1400 + i * 150}ms`));
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      section.classList.add('solution-resolved');
      observer.disconnect();
    }
  }, {threshold: 0, rootMargin: '0px 0px -12% 0px'});
  section.classList.add('solution-animated');
  observer.observe(section);
  reduced.addEventListener('change', event => {
    if (event.matches) {
      section.classList.add('solution-resolved');
      observer.disconnect();
    }
  });
})();

/* Locally authored examples. No parent input or child data is collected. */
(() => {
  const section = document.getElementById('studio');
  if (!section) return;
  const examples = {
    play: {
      question: '“I want a simple way to connect with my child today.”',
      steps: [
        ['Find a little moment', 'Explore a shared-play idea for your child’s age group.'],
        ['Follow their interest', 'Try it at their pace. You don’t have to finish an activity.'],
        ['Keep what matters', 'Save a personal observation about what you enjoyed together.']
      ],
      link: '#parents', label: 'Explore the parent preview'
    },
    notice: {
      question: '“I noticed something new. I want to organize my questions.”',
      steps: [
        ['Describe the moment', 'Write down what happened and when you first noticed it.'],
        ['Keep the context', 'Collect your own observations without an automatic score or diagnosis.'],
        ['Prepare your questions', 'Review what you want to discuss with a qualified professional.']
      ],
      link: '#parents', label: 'Explore the observation journey'
    },
    support: {
      question: '“I’d like to talk this through with a specialist.”',
      steps: [
        ['Explore your options', 'Preview specialist profiles, areas of practice and session formats.'],
        ['Choose what to share', 'Review the exact note you want to include with a booking.'],
        ['Understand the next step', 'Explore booking and follow-up. This demo creates no real appointment.']
      ],
      link: '#booking', label: 'See the booking preview'
    }
  };
  const buttons = [...section.querySelectorAll('[data-solution]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const example = examples[button.dataset.solution];
    if (!example) return;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    section.querySelector('#solution-parent-voice').textContent = example.question;
    example.steps.forEach(([title, text], index) => {
      section.querySelector(`#solution-step-${index+1}-title`).textContent = title;
      section.querySelector(`#solution-step-${index+1}-text`).textContent = text;
    });
    const link = section.querySelector('#solution-next');
    link.href = example.link;
    link.textContent = `${example.label} ↗`;
  }));
})();
