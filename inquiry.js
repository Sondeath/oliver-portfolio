export const SERVICE_LABELS = Object.freeze({
  website: "Web alebo e-shop",
  textile: "Reklamný textil",
  promotional: "Reklamné predmety",
  automation: "Automatizácia",
  advice: "Potrebujem poradiť",
});
export const CONTACT_EMAIL = "libic.oliver@gmail.com";
export function readInquiry(data) {
  const text = (key) => String(data.get(key) ?? "").trim();
  const services = [...new Set(data.getAll("services"))].filter((key) =>
    Object.hasOwn(SERVICE_LABELS, key),
  );
  const product = services.some(
    (key) => key === "textile" || key === "promotional",
  );
  return {
    name: text("name"),
    email: text("email"),
    description: text("description"),
    company: text("company"),
    budget: text("budget"),
    services: services.length ? services : ["advice"],
    quantity: product ? text("quantity") : "",
    deadline: product ? text("deadline") : "",
  };
}
export function validateInquiry(value) {
  const errors = {};
  if (!value.name || value.name.length > 120)
    errors.name = "Vyplňte meno, najviac 120 znakov.";
  if (
    !value.email ||
    value.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
  )
    errors.email = "Zadajte platnú e-mailovú adresu.";
  if (!value.description || value.description.length > 5000)
    errors.description = "Opíšte zadanie, najviac 5 000 znakov.";
  if (value.company.length > 160 || value.budget.length > 160)
    errors.description = "Firma a rozpočet môžu mať najviac 160 znakov.";
  if (
    value.quantity &&
    (!/^\d+$/.test(value.quantity) ||
      Number(value.quantity) < 1 ||
      Number(value.quantity) > 1000000)
  )
    errors.quantity =
      "Zadajte celý počet kusov od 1 do 1 000 000, alebo pole nechajte prázdne.";
  if (value.deadline) {
    const parsed = new Date(value.deadline);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value.deadline) ||
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== value.deadline
    )
      errors.deadline = "Skontrolujte želaný termín.";
  }
  return errors;
}
export function formatInquiry(value) {
  return [
    "Dobrý deň, Oliver,",
    "",
    "mám záujem o nezáväznú cenovú ponuku.",
    "",
    "Služby: " + value.services.map((key) => SERVICE_LABELS[key]).join(", "),
    "Meno: " + value.name,
    "E-mail: " + value.email,
    ...(value.company ? ["Firma: " + value.company] : []),
    ...(value.quantity ? ["Približný počet kusov: " + value.quantity] : []),
    ...(value.deadline
      ? ["Želaný termín: " + value.deadline.split("-").reverse().join(".")]
      : []),
    ...(value.budget ? ["Predstava o rozpočte: " + value.budget] : []),
    "",
    "Zadanie:",
    value.description,
    "",
    "Ďakujem.",
  ].join("\n");
}
export function draftUrl(value) {
  return (
    "mailto:" +
    CONTACT_EMAIL +
    "?subject=" +
    encodeURIComponent(
      "Nezáväzný dopyt — " +
        value.services.map((key) => SERVICE_LABELS[key]).join(", "),
    ) +
    "&body=" +
    encodeURIComponent(formatInquiry(value))
  );
}
