// Shared between client (early UX) + server (defense in depth — never trust client alone).

export type ContactFormInput = {
  name: string;
  email: string;
  message: string;
};

export type ValidationResult = { ok: true } | { ok: false; error: string };

// `.` required after `@` — kills "test@test" / "a@b". Not RFC-perfect; pragmatic spam floor.
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(input: ContactFormInput): ValidationResult {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (name.length < 2) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!EMAIL_OK.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (message.length < 10) {
    return { ok: false, error: "Tell us a bit more about what you need." };
  }

  return { ok: true };
}
