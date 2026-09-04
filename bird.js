(function () {
  const bird = document.getElementById('bird');
  if (!bird) return;

  const NAV_HEIGHT = 90;
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let timer = null;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function bounds() {
    const margin = 50;
    return {
      minX: margin,
      maxX: Math.max(margin + 1, window.innerWidth - margin),
      minY: NAV_HEIGHT,
      maxY: Math.max(NAV_HEIGHT + 1, window.innerHeight - margin),
    };
  }

  function place(px, py) {
    bird.style.left = px + 'px';
    bird.style.top = py + 'px';
    x = px;
    y = py;
  }

  function fly() {
    clearTimeout(timer);
    bird.classList.remove('resting');
    bird.classList.add('flying');

    const b = bounds();
    const targetX = rand(b.minX, b.maxX);
    const targetY = rand(b.minY, b.maxY);
    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy);
    const duration = Math.min(4.5, Math.max(1.4, dist / 260));

    bird.style.transition = `left ${duration}s cubic-bezier(.45,.05,.55,.95), top ${duration}s cubic-bezier(.45,.05,.55,.95)`;

    requestAnimationFrame(() => place(targetX, targetY));

    timer = setTimeout(() => {
      if (Math.random() < 0.45) {
        fly();
      } else {
        rest();
      }
    }, duration * 1000);
  }

  function rest() {
    clearTimeout(timer);
    bird.classList.remove('flying');
    bird.classList.add('resting');
    const restDuration = rand(2500, 6500);
    timer = setTimeout(fly, restDuration);
  }

  function reactToPageChange() {
    fly();
  }

  // initial position + kickoff
  place(rand(bounds().minX, bounds().maxX), rand(bounds().minY, bounds().maxY));
  fly();

  window.addEventListener('resize', () => {
    const b = bounds();
    x = Math.min(Math.max(x, b.minX), b.maxX);
    y = Math.min(Math.max(y, b.minY), b.maxY);
  });

  const sections = document.querySelectorAll('.hero, .teacher-slide, footer');
  if (sections.length) {
    const pageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reactToPageChange();
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => pageObserver.observe(s));
  }
})();
