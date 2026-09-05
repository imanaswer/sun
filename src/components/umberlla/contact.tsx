import { useState } from "react";
import { toast } from "sonner";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react";
import { submitContact } from "@/lib/api/contact.functions";
import { contactSchema } from "@/lib/contact";

/**
 * Contact page presentation and the form's own submit state. The address block
 * mirrors what the old storefront showed, so a customer comparing the two sees
 * the same company details.
 */

const ADDRESS_LINES = [
  "M/S. Sun Umbrella Pvt. Ltd.",
  "# 211, Ground Floor,",
  "JCK Industrial Park, Phase–2,",
  "Belagola Industrial Area,",
  "Mysuru – 570 016, Karnataka.",
];

const PHONES = [
  { label: "+91 821 2514578", href: "tel:+918212514578" },
  { label: "+91 63649 13526", href: "tel:+916364913526" },
];

export function ContactAddress() {
  return (
    <div
      className="rounded-[28px] p-7 md:p-9"
      style={{ border: "1px solid var(--u-slate)", background: "var(--u-card)" }}
    >
      <div className="flex gap-3">
        <MapPin size={18} weight="bold" style={{ color: "var(--u-accent-text)" }} className="mt-0.5 shrink-0" />
        <address className="text-sm leading-[1.9] not-italic" style={{ color: "var(--u-bone)" }}>
          {ADDRESS_LINES.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      </div>

      <div className="mt-6 flex gap-3">
        <Phone size={18} weight="bold" style={{ color: "var(--u-accent-text)" }} className="mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1 text-sm">
          {PHONES.map((phone) => (
            <a
              key={phone.href}
              href={phone.href}
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--u-bone)" }}
            >
              {phone.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <EnvelopeSimple size={18} weight="bold" style={{ color: "var(--u-accent-text)" }} className="mt-0.5 shrink-0" />
        <a
          href="mailto:info@sunumbrellas.in"
          className="text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--u-bone)" }}
        >
          info@sunumbrellas.in
        </a>
      </div>

      <p
        className="u-mono mt-8 border-t pt-6 text-xs uppercase tracking-[0.14em]"
        style={{ borderColor: "var(--u-slate)", color: "var(--u-muted)" }}
      >
        Timings 10 am – 6 pm · Mon to Sat
      </p>
    </div>
  );
}

const FIELD_CLASS =
  "mt-2 w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--u-accent-text)]";

function fieldStyle() {
  return {
    border: "1px solid var(--u-slate)",
    background: "var(--u-well)",
    color: "var(--u-bone)",
  } as const;
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className="u-mono text-xs uppercase tracking-[0.14em]"
      style={{ color: "var(--u-muted)" }}
    >
      {children}
      {required && <span style={{ color: "var(--u-accent-text)" }}> *</span>}
    </label>
  );
}

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;

    // Validate with the same schema the server uses, so a mistyped phone is
    // caught here instead of costing a round-trip.
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setSending(true);
    try {
      await submitContact({ data: parsed.data });
      setSent(true);
      form.reset();
      toast.success("Thanks — we've got your message", {
        description: "Someone from the Mysuru office will get back to you.",
      });
    } catch (e) {
      toast.error("We couldn't send that", {
        description:
          e instanceof Error && e.message ? e.message : "Please try again, or email info@sunumbrellas.in.",
      });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div
        className="rounded-[28px] p-7 md:p-9"
        style={{ border: "1px solid var(--u-slate)", background: "var(--u-card)" }}
      >
        <h2 className="u-fun-head text-2xl" style={{ color: "var(--u-bone)" }}>
          Message received
        </h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--u-muted)" }}>
          We reply within one working day. For anything urgent, call +91 821 2514578.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="u-mono mt-6 cursor-pointer rounded-full px-5 py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-ink)" }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[28px] p-7 md:p-9"
      style={{ border: "1px solid var(--u-slate)", background: "var(--u-card)" }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            Name
          </Label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            className={FIELD_CLASS}
            style={fieldStyle()}
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <Label htmlFor="phone" required>
            Phone number
          </Label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className={FIELD_CLASS}
            style={fieldStyle()}
            aria-invalid={Boolean(errors.phone)}
          />
          <FieldError message={errors.phone} />
        </div>
      </div>

      <div className="mt-5">
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={FIELD_CLASS}
          style={fieldStyle()}
          aria-invalid={Boolean(errors.email)}
        />
        <FieldError message={errors.email} />
      </div>

      <div className="mt-5">
        <Label htmlFor="city">Address / City</Label>
        <input
          id="city"
          name="city"
          autoComplete="address-level2"
          className={FIELD_CLASS}
          style={fieldStyle()}
          aria-invalid={Boolean(errors.city)}
        />
        <FieldError message={errors.city} />
      </div>

      <div className="mt-5">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={FIELD_CLASS}
          style={fieldStyle()}
          aria-invalid={Boolean(errors.message)}
        />
        <FieldError message={errors.message} />
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <button
        type="submit"
        disabled={sending}
        className="u-mono mt-8 w-full cursor-pointer rounded-full py-4 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10"
        style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-ink)" }}
      >
        {sending ? "Sending…" : "Send"}
      </button>

      <p className="mt-4 text-xs" style={{ color: "var(--u-muted)" }}>
        We use these details only to answer your enquiry.
      </p>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 text-xs" style={{ color: "var(--u-accent-text)" }}>
      {message}
    </p>
  );
}
