const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const countUp = (el) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduced) { el.textContent = target.toLocaleString() + suffix; return; }
  const start = performance.now();
  const dur = 1200;
  const tick = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased).toLocaleString() + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("in");
    if (entry.target.classList.contains("stat")) entry.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

const links = [...document.querySelectorAll(".nav nav a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => s && spy.observe(s));
