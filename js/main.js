/* =========================================================
   MÉRIDIEN — interactions
   Vanilla JS, no dependencies
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* -------- Preloader -------- */
  function preloader() {
    const el = $("#preloader");
    const count = $("#preloaderCount");
    const fill = $("#preloaderFill");
    if (!el) return;

    let n = 0;
    const dur = prefersReduced ? 200 : 1500;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      n = Math.floor(p * 100);
      if (count) count.textContent = String(n).padStart(2, "0");
      if (fill) fill.style.width = p * 100 + "%";
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.add("is-done");
        document.body.classList.add("is-loaded");
        startHero();
        setTimeout(() => { el.style.display = "none"; }, 1100);
      }
    }
    requestAnimationFrame(tick);
  }

  /* -------- Hero intro -------- */
  function startHero() {
    const lines = $$(".hero__line-inner");
    lines.forEach((l, i) => {
      l.style.transition = "transform 1.1s cubic-bezier(0.16,1,0.3,1)";
      l.style.transitionDelay = (prefersReduced ? 0 : 0.15 + i * 0.12) + "s";
      requestAnimationFrame(() => { l.style.transform = "translateY(0)"; });
    });
    // reveal hero eyebrow / lede
    $$(".hero [data-reveal]").forEach((el, i) => {
      setTimeout(() => el.classList.add("is-in"), prefersReduced ? 0 : 500 + i * 120);
    });
  }

  /* -------- Custom cursor -------- */
  function cursor() {
    if (isTouch) return;
    const ring = $("#cursor");
    const dot = $("#cursorDot");
    if (!ring || !dot) return;

    let rx = innerWidth / 2, ry = innerHeight / 2;
    let dx = rx, dy = ry;
    let tx = rx, ty = ry;

    window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });

    (function loop() {
      rx += (tx - rx) * 0.15;
      ry += (ty - ry) * 0.15;
      dx += (tx - dx) * 0.35;
      dy += (ty - dy) * 0.35;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      ring.classList.remove("is-hover", "is-view");
      if (t) {
        ring.classList.add(t.dataset.cursor === "view" ? "is-view" : "is-hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) { ring.style.opacity = "0"; dot.style.opacity = "0"; }
    });
    document.addEventListener("mouseover", () => { ring.style.opacity = "1"; dot.style.opacity = "1"; });
  }

  /* -------- Reveal on scroll -------- */
  function reveals() {
    const items = $$("[data-reveal]").filter((el) => !el.closest(".hero"));
    if (!("IntersectionObserver" in window) || prefersReduced) {
      items.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target;
            const sibs = Array.from(el.parentElement.children).filter((c) => c.hasAttribute("data-reveal"));
            const idx = sibs.indexOf(el);
            el.style.transitionDelay = Math.max(0, idx) * 0.08 + "s";
            el.classList.add("is-in");
            io.unobserve(el);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
      items.forEach((el) => io.observe(el));
    }
  }

  /* -------- Word-by-word statement -------- */
  function statement() {
    const words = $$("[data-reveal-word]");
    if (!words.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const idx = words.indexOf(e.target);
          e.target.style.transitionDelay = (idx % 10) * 0.04 + "s";
          e.target.classList.add("is-lit");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.9 });
    words.forEach((w) => io.observe(w));
  }

  /* -------- Animated counters -------- */
  function counters() {
    const nums = $$("[data-count]");
    if (!nums.length) return;
    const run = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const dur = prefersReduced ? 0 : 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.35, rootMargin: "0px 0px -10% 0px" });
    nums.forEach((n) => io.observe(n));
  }

  /* -------- Nav: hide on scroll down, progress, solid -------- */
  function navBehavior() {
    const nav = $("#nav");
    const prog = $("#scrollProgress");
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - innerHeight;
      if (prog) prog.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      if (nav) {
        nav.classList.toggle("is-solid", y > 40);
        if (y > last && y > 300) nav.classList.add("is-hidden");
        else nav.classList.remove("is-hidden");
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* -------- Hero parallax -------- */
  function heroParallax() {
    if (prefersReduced) return;
    const img = $("#heroImg");
    if (!img) return;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < innerHeight) img.style.transform = `scale(1.12) translateY(${y * 0.12}px)`;
    }, { passive: true });
  }

  /* -------- Mobile menu -------- */
  function mobileMenu() {
    const burger = $("#burger");
    const overlay = $("#menuOverlay");
    if (!burger || !overlay) return;
    const toggle = (open) => {
      burger.classList.toggle("is-open", open);
      overlay.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      overlay.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle(!overlay.classList.contains("is-open")));
    $$(".menu-overlay__links a").forEach((a) => a.addEventListener("click", () => toggle(false)));
  }

  /* -------- Smooth anchor + back to top -------- */
  function anchors() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" }); }
      });
    });
    const top = $("#backTop");
    if (top) top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));
  }

  /* -------- Magnetic buttons -------- */
  function magnetic() {
    if (isTouch || prefersReduced) return;
    $$(".nav__cta, .work__more, .hero__scroll").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* -------- Init -------- */
  function init() {
    preloader();
    cursor();
    reveals();
    statement();
    counters();
    navBehavior();
    heroParallax();
    mobileMenu();
    anchors();
    magnetic();
    // current year already set in markup (2026)
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
