import { clamp, scrollProgress, approach, workArrival } from "./motion.js";

const root = document.documentElement;
const hero = document.querySelector(".hero");
const heroCopy = document.querySelector(".hero-copy");
const viewport = document.querySelector(".hero-viewport");
const scene = document.querySelector(".scene-depth");
const work = document.querySelector("#work");
const services = document.querySelector("#services");
const contact = document.querySelector("#contact");
const header = document.querySelector(".site-header");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const forcedStill =
  new URLSearchParams(window.location.search).get("motion") === "off";
const motionDisabled = () => reduced.matches || forcedStill;
const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
root.classList.add("js");
root.classList.toggle("motion-ready", !motionDisabled());
root.dataset.motion = motionDisabled() ? "off" : "on";
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Native dialog keeps keyboard focus inside the mobile navigation.
const menu = document.getElementById("mobile-menu");
const toggle = document.querySelector(".menu-toggle");
toggle.hidden = false;
toggle.addEventListener("click", () => {
  menu.showModal();
  toggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
});
document
  .querySelector(".menu-close")
  .addEventListener("click", () => menu.close());
menu.addEventListener("close", () => {
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  toggle.focus({ preventScroll: true });
});
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.close();
    const target = link.hash && document.getElementById(link.hash.slice(1));
    if (target)
      requestAnimationFrame(() => target.focus({ preventScroll: true }));
  });
});
window.matchMedia("(min-width: 561px)").addEventListener("change", (event) => {
  if (event.matches && menu.open) menu.close();
});

document.querySelectorAll('a[href="#archive"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const archive = document.getElementById("archive");
    archive.open = true;
    archive.querySelector("summary").focus({ preventScroll: true });
    archive.scrollIntoView({
      behavior: motionDisabled() ? "instant" : "smooth",
      block: "start",
    });
    history.pushState(null, "", "#archive");
  });
});

const reveals = [...document.querySelectorAll(".reveal")];
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -30px 0px", threshold: 0.06 },
);
reveals.forEach((element) => observer.observe(element));

let start = 0,
  sectionHeight = 0,
  viewportHeight = 0;
let progress = 0,
  target = 0,
  arrival = 0,
  arrivalTarget = 0,
  servicesProgress = 0,
  servicesTarget = 0,
  contactProgress = 0,
  contactTarget = 0,
  tiltX = 0,
  tiltY = 0,
  targetX = 0,
  targetY = 0;
let frame = 0,
  lastTime = 0;
let workStart = 0, servicesStart = 0, servicesHeight = 0, contactStart = 0;
let liquidEffect, servicesEffect, contactEffect;
const nav = [...document.querySelectorAll(".desktop-nav a")];
function measure() {
  start = hero.getBoundingClientRect().top + window.scrollY;
  sectionHeight = hero.offsetHeight;
  viewportHeight = viewport.offsetHeight;
  workStart = work.getBoundingClientRect().top + window.scrollY;
  servicesStart = services.getBoundingClientRect().top + window.scrollY;
  servicesHeight = services.offsetHeight;
  contactStart = contact.getBoundingClientRect().top + window.scrollY;
  update();
}
function render(now) {
  const elapsed = lastTime ? Math.min(now - lastTime, 64) : 16;
  lastTime = now;
  progress = motionDisabled() ? 0 : approach(progress, target, elapsed);
  arrival = motionDisabled() ? 1 : approach(arrival, arrivalTarget, elapsed);
  servicesProgress = motionDisabled() ? 0 : approach(servicesProgress, servicesTarget, elapsed);
  contactProgress = motionDisabled() ? 1 : approach(contactProgress, contactTarget, elapsed);
  tiltX = approach(tiltX, targetX, elapsed);
  tiltY = approach(tiltY, targetY, elapsed);
  root.style.setProperty("--hero-progress", progress.toFixed(5));
  root.style.setProperty("--work-arrival", arrival.toFixed(5));
  root.style.setProperty("--services-progress", servicesProgress.toFixed(5));
  root.style.setProperty("--contact-progress", contactProgress.toFixed(5));
  const heroHidden = !motionDisabled() && arrival >= 0.2;
  if (heroCopy.inert !== heroHidden) heroCopy.inert = heroHidden;
  liquidEffect?.setScrollProgress(arrival);
  servicesEffect?.setScrollProgress(servicesProgress);
  contactEffect?.setScrollProgress(contactProgress);
  const stage =
    progress < 0.05 ? "0" : progress < 0.35 ? "1" : progress < 0.72 ? "2" : "3";
  if (root.dataset.stage !== stage) root.dataset.stage = stage;
  scene.style.setProperty("--scene-tilt-x", tiltX.toFixed(3) + "deg");
  scene.style.setProperty("--scene-tilt-y", tiltY.toFixed(3) + "deg");
  if (progress !== target || arrival !== arrivalTarget || servicesProgress !== servicesTarget || contactProgress !== contactTarget || tiltX !== targetX || tiltY !== targetY) {
    frame = requestAnimationFrame(render);
  } else {
    frame = 0;
    lastTime = 0;
  }
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(render);
}
function update() {
  target = motionDisabled()
    ? 0
    : scrollProgress(window.scrollY, start, sectionHeight, viewportHeight);
  arrivalTarget = motionDisabled() ? 1 : workArrival(window.scrollY, workStart, Math.min(window.innerHeight, viewportHeight));
  servicesTarget = motionDisabled() ? 0 : scrollProgress(window.scrollY, servicesStart - window.innerHeight, servicesHeight + window.innerHeight * 2, window.innerHeight);
  contactTarget = motionDisabled() ? 1 : workArrival(window.scrollY, contactStart, Math.min(window.innerHeight, viewportHeight));
  header.classList.toggle("is-scrolled", window.scrollY > 80);
  const length = root.scrollHeight - window.innerHeight;
  root.style.setProperty(
    "--page-progress",
    length > 0 ? clamp(window.scrollY / length).toFixed(5) : "0",
  );
  let active = "";
  nav.forEach((link) => {
    if (document.querySelector(link.hash).getBoundingClientRect().top <= 190)
      active = link.hash;
  });
  if (window.scrollY + window.innerHeight >= root.scrollHeight - 3)
    active = "#contact";
  nav.forEach((link) => {
    if (link.hash === active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  schedule();
}
hero.addEventListener("pointermove", (event) => {
  if (motionDisabled() || !pointer.matches || event.pointerType !== "mouse")
    return;
  const rect = hero.getBoundingClientRect();
  targetY = clamp((event.clientX / window.innerWidth - 0.5) * 4, -2, 2);
  targetX =
    clamp((event.clientY - rect.top) / viewportHeight - 0.5, -0.5, 0.5) * -1.5;
  schedule();
});
hero.addEventListener("pointerleave", () => {
  targetX = targetY = 0;
  schedule();
});
reduced.addEventListener("change", () => {
  root.classList.toggle("motion-ready", !motionDisabled());
  root.dataset.motion = motionDisabled() ? "off" : "on";
  targetX = targetY = 0;
  measure();
});
window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", measure, { passive: true });
new ResizeObserver(measure).observe(hero);
// Archive and automation expansion move the services without resizing the hero.
const contentResize = new ResizeObserver(measure);
contentResize.observe(work);
contentResize.observe(services);
contentResize.observe(contact);
document.fonts.ready.then(measure);
measure();

// The page shares one material and pause preference, loaded near each section.
const effects = [];
let liquidPaused = false;
for (const config of [
  { scene: document.querySelector(".work-scene"), control: document.querySelector(".work-motion-toggle"), fallback: ".work-aura-fallback", kind: "work" },
  { scene: document.querySelector(".services-flow"), control: document.querySelector(".services-motion-toggle"), fallback: ".services-aura-fallback", kind: "services" },
  { scene: document.querySelector(".contact-flow"), control: document.querySelector(".contact-motion-toggle"), fallback: ".contact-aura-fallback", kind: "contact" },
]) {
  const { scene: liquidScene, control } = config;
  const loader = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    loader.disconnect();
    import("./liquid-aura.js").then(({ createLiquidAura }) => {
      const effect = createLiquidAura(liquidScene.querySelector("canvas"), liquidScene.querySelector(config.fallback), { disabled: forcedStill });
      effects.push(effect);
      if (config.kind === "work") liquidEffect = effect;
      else if (config.kind === "services") servicesEffect = effect;
      else contactEffect = effect;
      effect.setPlaying(!liquidPaused);
      effect.setScrollProgress(config.kind === "work" ? arrival : config.kind === "services" ? servicesProgress : contactProgress);
      const syncControl = () => {
        control.hidden = !effect.ready || motionDisabled();
        control.setAttribute("aria-pressed", String(Boolean(effect.playing)));
        control.textContent = effect.playing ? "Pozastaviť pohyb" : "Spustiť pohyb";
      };
      liquidScene.addEventListener("liquidstatechange", syncControl);
      control.addEventListener("click", () => {
        liquidPaused = effect.playing;
        effects.forEach((item) => item.setPlaying(!liquidPaused));
        liquidEffect?.setScrollProgress(arrival);
        servicesEffect?.setScrollProgress(servicesProgress);
        contactEffect?.setScrollProgress(contactProgress);
      });
      syncControl();
      window.addEventListener("pagehide", (event) => { if (!event.persisted) effect.destroy(); });
    }).catch(() => { control.hidden = true; });
  }, { rootMargin: "400px" });
  loader.observe(liquidScene);
}

// Small pointer responses belong to the object being explored, never the cursor.
document.querySelectorAll(".magnetic, .project-image").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    if (motionDisabled() || !pointer.matches || event.pointerType !== "mouse")
      return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.transform = element.classList.contains("magnetic")
      ? `translate3d(${(x * 7).toFixed(2)}px, ${(y * 7).toFixed(2)}px, 0)`
      : `perspective(1000px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg)`;
  });
  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
  reduced.addEventListener("change", () => {
    element.style.transform = "";
  });
});
