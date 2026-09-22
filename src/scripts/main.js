/* Progressive enhancements. Every feature checks for its DOM first, so any
 * page can omit any component. No framework, no dependencies. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ------------------------------------------------------------------ */
/* Header: opaque on scroll                                            */
/* ------------------------------------------------------------------ */
(() => {
  const header = $('#site-header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

/* ------------------------------------------------------------------ */
/* Mobile menu                                                         */
/* ------------------------------------------------------------------ */
(() => {
  const toggle = $('.menu-toggle');
  const menu = $('#mobile-menu');
  if (!toggle || !menu) return;
  const closeBtn = $('.menu-close', menu);
  const focusables = () =>
    $$('a[href], button:not([disabled])', menu).filter((el) => el.offsetParent !== null);

  const open = () => {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('scroll-lock', 'menu-open');
    (closeBtn || focusables()[0])?.focus();
  };
  const close = () => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('scroll-lock', 'menu-open');
    toggle.focus();
  };

  toggle.addEventListener('click', () => (menu.hidden ? open() : close()));
  closeBtn?.addEventListener('click', close);
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
    if (e.matches && !menu.hidden) close();
  });
})();

/* ------------------------------------------------------------------ */
/* Mobile ticket bar                                                   */
/* ------------------------------------------------------------------ */
(() => {
  const bar = $('.ticket-bar');
  const sentinel = $('#primary-cta');
  if (!bar || !sentinel || !('IntersectionObserver' in window)) return;
  let scrolledPast = false;
  let blocked = 0;

  const apply = () => {
    const show = scrolledPast && blocked === 0;
    bar.classList.toggle('is-visible', show);
    // `inert` keeps the hidden bar out of the tab order and accessibility tree.
    bar.inert = !show;
    document.documentElement.style.setProperty('--ticket-bar-h', show ? `${bar.offsetHeight}px` : '0px');
  };

  new IntersectionObserver(
    ([entry]) => {
      scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      apply();
    },
    { threshold: 0 }
  ).observe(sentinel);

  // Anything marked data-hide-ticket-bar (trailer player) or the footer hides the bar while visible.
  const blockers = $$('[data-hide-ticket-bar], #site-footer');
  if (blockers.length) {
    const seen = new Set();
    const blockerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
        blocked = seen.size;
        apply();
      },
      { threshold: 0.05 }
    );
    blockers.forEach((el) => blockerObserver.observe(el));
  }

  window.addEventListener('resize', apply, { passive: true });
})();

/* ------------------------------------------------------------------ */
/* Hero background video                                               */
/* ------------------------------------------------------------------ */
(() => {
  const hero = $('.hero-video');
  if (!hero) return;
  const video = $('video', hero);
  const btn = $('.video-toggle', hero); // optional control (not rendered by default)
  if (!video) return;

  const conn = navigator.connection;
  const constrained = !!(conn && (conn.saveData || /(^|\D)(slow-)?2g|3g/.test(conn.effectiveType || '')));
  let loaded = false;
  let userPaused = false;
  let suspended = false; // paused by the trailer modal
  let inView = true;

  const setState = (state) => {
    hero.dataset.state = state; // 'still' | 'loading' | 'playing' | 'paused'
    if (!btn) return;
    const playing = state === 'playing';
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
    btn.classList.toggle('is-playing', playing);
  };

  const load = () => {
    if (loaded) return;
    loaded = true;
    const wide = window.matchMedia('(min-width: 768px)').matches;
    video.src = wide ? video.dataset.src720 : video.dataset.src480;
    video.load();
  };

  const play = async () => {
    load();
    setState('loading');
    try {
      await video.play();
      setState('playing');
    } catch {
      setState('still');
    }
  };

  const pause = () => {
    if (!loaded) return;
    video.pause();
    setState(hero.dataset.state === 'still' ? 'still' : 'paused');
  };

  if (reduceMotion.matches || constrained) {
    setState('still');
  } else {
    play();
  }

  video.addEventListener('error', () => setState('still'));
  video.addEventListener('playing', () => setState('playing'));

  btn?.addEventListener('click', () => {
    if (video.paused || !loaded) {
      userPaused = false;
      play();
    } else {
      userPaused = true;
      pause();
    }
  });

  const shouldRun = () => loaded && !userPaused && !suspended && inView && !document.hidden;
  const sync = () => (shouldRun() ? video.play().catch(() => {}) : loaded && video.pause());

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 }
    ).observe(hero);
  }
  document.addEventListener('visibilitychange', sync);

  window.__hero = {
    suspend() {
      suspended = true;
      sync();
    },
    resume() {
      suspended = false;
      sync();
    },
  };
})();

/* ------------------------------------------------------------------ */
/* Trailer modal                                                       */
/* ------------------------------------------------------------------ */
(() => {
  const dialog = $('#trailer-modal');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const video = $('video', dialog);
  const closeBtn = $('.dialog-close', dialog);
  let opener = null;

  const open = () => {
    if (video && !video.getAttribute('src')) {
      video.src = video.dataset.src;
      video.load();
    }
    dialog.showModal();
    document.body.classList.add('scroll-lock', 'dialog-open');
    window.__hero?.suspend();
    video?.play().catch(() => {});
    closeBtn?.focus();
  };

  const close = () => dialog.close();

  $$('[data-trailer-open]').forEach((el) =>
    el.addEventListener('click', (e) => {
      e.preventDefault();
      opener = el;
      open();
    })
  );

  closeBtn?.addEventListener('click', close);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  dialog.addEventListener('close', () => {
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    document.body.classList.remove('scroll-lock', 'dialog-open');
    window.__hero?.resume();
    opener?.focus();
  });
})();

/* ------------------------------------------------------------------ */
/* Image lightbox                                                      */
/* ------------------------------------------------------------------ */
(() => {
  const dialog = $('#lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const img = $('img', dialog);
  const caption = $('.lightbox__caption', dialog);
  const closeBtn = $('.dialog-close', dialog);
  const prevBtn = $('.lightbox__prev', dialog);
  const nextBtn = $('.lightbox__next', dialog);
  const triggers = $$('[data-lightbox]');
  if (!triggers.length) return;
  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + triggers.length) % triggers.length;
    const t = triggers[index];
    img.src = t.dataset.lightbox;
    img.alt = t.dataset.alt || '';
    if (caption) caption.textContent = t.dataset.caption || t.dataset.alt || '';
    const many = triggers.length > 1;
    if (prevBtn) prevBtn.hidden = !many;
    if (nextBtn) nextBtn.hidden = !many;
  };

  triggers.forEach((t, i) =>
    t.addEventListener('click', (e) => {
      e.preventDefault();
      opener = t;
      show(i);
      dialog.showModal();
      document.body.classList.add('scroll-lock', 'dialog-open');
      closeBtn?.focus();
    })
  );

  prevBtn?.addEventListener('click', () => show(index - 1));
  nextBtn?.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  closeBtn?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    img.removeAttribute('src');
    document.body.classList.remove('scroll-lock', 'dialog-open');
    opener?.focus();
  });
})();

/* ------------------------------------------------------------------ */
/* FAQ deep links: open the <details> a hash points to                 */
/* ------------------------------------------------------------------ */
(() => {
  const openFromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const details = target.closest('details') || (target.tagName === 'DETAILS' ? target : null);
    if (details) {
      details.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  };
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();

/* ------------------------------------------------------------------ */
/* Scroll reveals                                                      */
/* ------------------------------------------------------------------ */
(() => {
  const items = $$('.reveal');
  if (!items.length) return;
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );
  items.forEach((el) => io.observe(el));
  // Safety: never leave content hidden.
  setTimeout(() => items.forEach((el) => el.classList.add('in')), 4000);
})();
