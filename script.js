(function () {
  const slides = document.querySelectorAll('.teacher-slide');
  const sideNav = document.getElementById('sideNav');
  if (!slides.length || !sideNav) return;

  slides.forEach((slide, i) => {
    const dot = document.createElement('a');
    dot.href = '#' + slide.id;
    dot.setAttribute('aria-label', 'Jump to faculty ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    sideNav.appendChild(dot);
  });
  const dots = sideNav.querySelectorAll('a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = [...slides].indexOf(entry.target);
        dots.forEach((d) => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  slides.forEach((slide) => observer.observe(slide));

  // draw-in animation for the background doodles
  function drawDoodle(slide) {
    const shapes = slide.querySelectorAll('.doodle path, .doodle circle, .doodle ellipse, .doodle line, .doodle polyline, .doodle rect');
    shapes.forEach((shape, i) => {
      const len = shape.getTotalLength ? shape.getTotalLength() : 300;
      shape.style.strokeDasharray = len;
      shape.style.strokeDashoffset = len;
      shape.getBoundingClientRect(); // force reflow before transition starts
      shape.style.transition = 'stroke-dashoffset 1.4s ease ' + (i * 0.12) + 's';
      requestAnimationFrame(() => {
        shape.style.strokeDashoffset = '0';
      });
    });
  }

  const doodleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.drawn) {
        entry.target.dataset.drawn = 'true';
        entry.target.classList.add('in-view');
        drawDoodle(entry.target);
      }
    });
  }, { threshold: 0.35 });

  slides.forEach((slide) => {
    if (slide.querySelector('.doodle')) doodleObserver.observe(slide);
  });
})();
