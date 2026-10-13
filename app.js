import {
  SERVICE_LABELS,
  readInquiry,
  validateInquiry,
  formatInquiry,
  draftUrl,
} from "./inquiry.js";

document.documentElement.classList.add("js");
document.getElementById("year").textContent = new Date().getFullYear();
const menu = document.getElementById("mobile-menu");
const menuToggle = document.querySelector(".menu-toggle");
const canDialog = typeof menu.showModal === "function";
function openDialog(dialog) {
  if (canDialog) {
    dialog.showModal();
    document.body.classList.add("modal-open");
  } else {
    dialog.setAttribute("open", "");
    dialog.scrollIntoView({ block: "center" });
  }
}
function closeDialog(dialog) {
  if (canDialog) dialog.close();
  else dialog.removeAttribute("open");
}
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (dialog === menu) menuToggle.setAttribute("aria-expanded", "false");
  });
  dialog
    .querySelectorAll("[data-close-dialog]")
    .forEach((button) =>
      button.addEventListener("click", () => closeDialog(dialog)),
    );
});
if (canDialog) {
  menuToggle.hidden = false;
  menuToggle.addEventListener("click", () => {
    openDialog(menu);
    menuToggle.setAttribute("aria-expanded", "true");
    menu.querySelector(".menu-close").focus();
  });
  menu
    .querySelector(".menu-close")
    .addEventListener("click", () => closeDialog(menu));
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      closeDialog(menu);
      const target = document.querySelector(link.hash);
      if (target) {
        target.setAttribute("tabindex", "-1");
        requestAnimationFrame(() => target.focus({ preventScroll: true }));
      }
    }),
  );
  matchMedia("(min-width:761px)").addEventListener("change", (event) => {
    if (event.matches && menu.open) closeDialog(menu);
  });
} else document.documentElement.classList.remove("js");

const form = document.getElementById("inquiry-form");
const options = document.getElementById("request-options");
const productFields = document.getElementById("product-fields");
const selectionLabel = document.getElementById("selection-label");
const formStatus = document.getElementById("form-status");
const preview = document.getElementById("inquiry-preview");
const previewSummary = document.getElementById("inquiry-summary");
const previewStatus = document.getElementById("preview-status");
const draft = document.getElementById("email-draft");
const submit = document.getElementById("inquiry-submit");
let transport = null,
  widgetId = null,
  widgetToken = "";
let requestId = crypto.randomUUID(),
  submittedFingerprint = "";
form.hidden = false;
function clearError(name) {
  form.elements[name]?.removeAttribute("aria-invalid");
  const error = document.getElementById(name + "-error");
  if (error) {
    error.textContent = "";
    error.hidden = true;
  }
}
function updateSelection() {
  const selected = [...form.querySelectorAll('[name="services"]:checked')].map(
    (input) => input.value,
  );
  selectionLabel.textContent = selected.length
    ? selected.map((key) => SERVICE_LABELS[key]).join(" · ")
    : "Vybrať službu a doplniť podrobnosti";
  const product =
    selected.includes("textile") || selected.includes("promotional");
  productFields.hidden = !product;
  productFields.querySelectorAll("input").forEach((input) => {
    input.disabled = !product;
  });
  if (!product) {
    clearError("quantity");
    clearError("deadline");
  }
}
form
  .querySelectorAll('[name="services"]')
  .forEach((input) => input.addEventListener("change", updateSelection));
document.querySelectorAll("[data-service]").forEach((link) =>
  link.addEventListener("click", () => {
    const input = form.querySelector(
      '[name="services"][value="' + link.dataset.service + '"]',
    );
    if (input) input.checked = true;
    options.open = true;
    updateSelection();
    formStatus.textContent = "";
    requestAnimationFrame(() => form.elements.name.focus({ preventScroll: true }));
  }),
);
["name", "email", "description", "quantity", "deadline"].forEach((name) =>
  form.elements[name].addEventListener("input", () => clearError(name)),
);
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submit.disabled) return;
  formStatus.textContent = "";
  ["name", "email", "description", "quantity", "deadline"].forEach(clearError);
  const value = readInquiry(new FormData(form)),
    errors = validateInquiry(value);
  for (const [name, message] of Object.entries(errors)) {
    form.elements[name].setAttribute("aria-invalid", "true");
    const error = document.getElementById(name + "-error");
    error.textContent = message;
    error.hidden = false;
    if (name === "quantity" || name === "deadline") options.open = true;
  }
  if (Object.keys(errors).length) {
    formStatus.textContent = "Skontrolujte označené polia.";
    form.elements[Object.keys(errors)[0]].focus();
    return;
  }
  if (!transport) {
    previewSummary.textContent = formatInquiry(value);
    previewStatus.textContent = "";
    const url = draftUrl(value);
    draft.hidden = url.length > 6500;
    if (!draft.hidden) draft.href = url;
    else
      previewStatus.textContent =
        "Zadanie je príliš dlhé pre niektoré e-mailové aplikácie. Skopírujte zhrnutie do správy pre libic.oliver@gmail.com.";
    openDialog(preview);
    return;
  }
  if (!widgetToken) {
    formStatus.textContent =
      "Dokončite overenie proti spamu, alebo mi napíšte priamo e-mail.";
    return;
  }
  const fingerprint = JSON.stringify(value);
  if (submittedFingerprint && submittedFingerprint !== fingerprint)
    requestId = crypto.randomUUID();
  submittedFingerprint = fingerprint;
  submit.disabled = true;
  submit.querySelector("span").textContent = "Odosielam…";
  try {
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...value, requestId, token: widgetToken }),
      signal: AbortSignal.timeout(18000),
    });
    const result = await response.json();
    if (!response.ok || result.accepted !== true)
      formStatus.textContent =
        response.status === 429
          ? "Formulár bol odoslaný príliš často. Skúste to o chvíľu alebo použite e-mail."
          : "Dopyt sa nepodarilo odoslať. Údaje zostávajú vyplnené. Skúste to znova alebo napíšte na libic.oliver@gmail.com.";
    else {
      formStatus.textContent =
        "Ďakujem, váš dopyt bol prijatý na odoslanie. Ďalší postup dohodneme e-mailom.";
      form.reset();
      requestId = crypto.randomUUID();
      submittedFingerprint = "";
      updateSelection();
    }
  } catch {
    formStatus.textContent =
      "Prijatie dopytu sa nepodarilo potvrdiť. Údaje zostávajú vyplnené. Skúste to znova alebo napíšte na libic.oliver@gmail.com.";
  } finally {
    submit.disabled = false;
    submit.querySelector("span").textContent = "Poslať nezáväzný dopyt";
    widgetToken = "";
    if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
  }
});
document.getElementById("copy-inquiry").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(previewSummary.textContent);
    previewStatus.textContent =
      "Zhrnutie je skopírované. Vložte ho do správy pre libic.oliver@gmail.com.";
  } catch {
    const selection = window.getSelection(),
      range = document.createRange();
    range.selectNodeContents(previewSummary);
    selection.removeAllRanges();
    selection.addRange(range);
    previewStatus.textContent =
      "Text je označený. Skopírujte ho a vložte do svojho e-mailu.";
  }
});
draft.addEventListener("click", () => {
  previewStatus.textContent =
    "Ak sa e-mailová aplikácia neotvorila, skopírujte zhrnutie a pošlite ho na libic.oliver@gmail.com. Správu odošlite vo svojej aplikácii.";
});
document
  .getElementById("privacy-open")
  .addEventListener("click", () =>
    openDialog(document.getElementById("privacy-dialog")),
  );

// No success simulation: a static host keeps the honest email-draft flow.
async function configureDelivery() {
  try {
    const response = await fetch("/api/inquiry-config", {
      signal: AbortSignal.timeout(4000),
    });
    if (
      !response.ok ||
      !(response.headers.get("content-type") || "").includes("application/json")
    )
      return;
    const config = await response.json();
    if (config.mode !== "direct" || !config.siteKey) return;
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => {
      const container = document.getElementById("turnstile-container");
      container.hidden = false;
      widgetId = window.turnstile.render(container, {
        sitekey: config.siteKey,
        action: "inquiry",
        theme: "dark",
        callback: (token) => {
          widgetToken = token;
        },
        "expired-callback": () => {
          widgetToken = "";
        },
        "error-callback": () => {
          widgetToken = "";
          formStatus.textContent =
            "Overenie sa nenačítalo. Môžete mi napísať priamo e-mail.";
        },
      });
      transport = config;
      submit.querySelector("span").textContent = "Poslať nezáväzný dopyt";
      document.getElementById("delivery-note").textContent =
        "Dopyt je nezáväzný. Podklady a cenu dohodneme následne.";
      document.getElementById("privacy-transport").textContent =
        "Odoslaný dopyt spracujú Cloudflare a e-mailová služba Resend a odošle sa na libic.oliver@gmail.com. Overenie proti spamu zabezpečuje Cloudflare Turnstile. Rozpracované údaje sa automaticky neukladajú do vášho prehliadača.";
    };
    document.head.append(script);
  } catch {
    /* The direct contact and email-draft flow stay available. */
  }
}
configureDelivery();
const navLinks = [...document.querySelectorAll(".desktop-nav a")];
let scheduled = false;
function updateNavigation() {
  let current = 0;
  navLinks.forEach((link, index) => {
    const section = document.querySelector(link.hash);
    if (section && section.getBoundingClientRect().top <= 200) current = index;
  });
  navLinks.forEach((link, index) => {
    if (index === current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  scheduled = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateNavigation);
    }
  },
  { passive: true },
);
updateSelection();
updateNavigation();
