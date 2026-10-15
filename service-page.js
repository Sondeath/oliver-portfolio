const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const forcedStill = new URLSearchParams(location.search).get("motion") === "off";
const disabled = () => reduced.matches || forcedStill;
root.classList.add("js");
root.dataset.motion = disabled() ? "off" : "on";
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
const menu = document.querySelector("#mobile-menu");
const toggle = document.querySelector(".menu-toggle");
toggle.hidden = false;
toggle.addEventListener("click", () => {
  menu.showModal(); toggle.setAttribute("aria-expanded", "true"); document.body.classList.add("menu-open");
});
document.querySelector(".menu-close").addEventListener("click", () => menu.close());
menu.addEventListener("close", () => {
  toggle.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-open"); toggle.focus({ preventScroll: true });
});
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menu.close();
  const destination = new URL(link.href);
  if (destination.pathname === location.pathname && destination.hash) {
    const target = document.getElementById(destination.hash.slice(1));
    if (target) requestAnimationFrame(() => target.focus({ preventScroll: true }));
  }
}));
matchMedia("(min-width: 761px)").addEventListener("change", e => { if (e.matches && menu.open) menu.close(); });
document.querySelectorAll("[data-language]").forEach(link => link.addEventListener("click", () => {
  const destination = new URL(link.href);
  destination.search = location.search;
  const readingLine = document.querySelector(".site-header").getBoundingClientRect().bottom + 140;
  destination.hash = location.hash;
  for (const section of document.querySelectorAll("main section[id]")) {
    const box = section.getBoundingClientRect();
    if (box.top <= readingLine && box.bottom > readingLine) destination.hash = section.id === "top" ? "" : section.id;
  }
  link.href = destination.pathname + destination.search + destination.hash;
}));
const header = document.querySelector(".site-header");
let frame;
function update() {
  frame = 0;
  header.classList.toggle("is-scrolled", scrollY > 80);
  root.style.setProperty("--page-progress", Math.min(1, scrollY / Math.max(1, root.scrollHeight - innerHeight)));
  root.style.setProperty("--detail-scroll", disabled() ? 0 : Math.min(1, scrollY / innerHeight));
}
function schedule() { if (!frame) frame = requestAnimationFrame(update); }
addEventListener("scroll", schedule, { passive: true });
addEventListener("resize", schedule);
reduced.addEventListener("change", () => { root.dataset.motion = disabled() ? "off" : "on"; schedule(); });
update();

// Show the static artwork first; compile the ambient field after the page loads.
if (!disabled()) {
  const field = document.querySelector(".detail-flow");
  const start = () => {
    if (disabled()) return;
    const loader = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    loader.disconnect();
    import("./liquid-aura.js").then(({ createLiquidAura }) => {
      const effect = createLiquidAura(field.querySelector("canvas"), field.querySelector("img"));
      if (!effect.supported) return;
      const control = document.querySelector(".detail-motion-toggle");
      const syncControl = () => {
        control.hidden = !effect.ready || disabled();
        control.setAttribute("aria-pressed", String(Boolean(effect.playing)));
        control.textContent = effect.playing ? control.dataset.pauseLabel : control.dataset.resumeLabel;
      };
      field.addEventListener("liquidstatechange", syncControl);
      control.addEventListener("click", () => {
        effect.setPlaying(!effect.playing);
        syncControl();
      });
      reduced.addEventListener("change", syncControl);
      syncControl();
      addEventListener("pagehide", e => { if (!e.persisted) effect.destroy(); });
    }).catch(() => {}); // The image remains available if WebGL is unavailable.
    }, { rootMargin: "200px" });
    loader.observe(field);
  };
  const afterLoad = () => {
    if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 200);
  };
  if (document.readyState === "complete") afterLoad();
  else addEventListener("load", afterLoad, { once: true });
}
