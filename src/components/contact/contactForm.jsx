import { useState } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    // For now this is UI-only.
    // Next step: we’ll connect this to Formspree or your backend endpoint.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("sent");
    e.currentTarget.reset();
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.kicker}>Brooklyn SnackMate</p>
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.subtitle}>
            Tell us your location details and we’ll respond quickly about vending placement.
          </p>
        </header>

        <div className={styles.grid}>
          {/* LEFT: info card */}
          <aside className={styles.infoCard}>
            <h2 className={styles.cardTitle}>What to include</h2>
            <ul className={styles.list}>
              <li>Business name & address</li>
              <li>Type of location (office, hotel, clinic, etc.)</li>
              <li>Approx. daily foot traffic (if known)</li>
              <li>Best contact person + phone</li>
            </ul>

            <div className={styles.divider} />

            <div className={styles.quick}>
              <a className={styles.quickLink} href="tel:+19297776229">
                Call: +1 (929) 777-6229
              </a>
              <a className={styles.quickLink} href="mailto:brooklynsnackmate@gmail.com">
                Email: info@brooklynsnackmate.com
              </a>
              <p className={styles.note}>
                No spam. We only use your info to respond to this request.
              </p>
            </div>
          </aside>

          {/* RIGHT: form card */}
          <section className={styles.formCard}>
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.row}>
                <label className={styles.label}>
                  Full name
                  <input
                    className={styles.input}
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                  />
                </label>

                <label className={styles.label}>
                  Phone
                  <input
                    className={styles.input}
                    name="phone"
                    autoComplete="tel"
                    placeholder="(929) 000-0000"
                    required
                  />
                </label>
              </div>

              <div className={styles.row}>
                <label className={styles.label}>
                  Email
                  <input
                    className={styles.input}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    required
                  />
                </label>

                <label className={styles.label}>
                  Location type
                  <select className={styles.input} name="locationType" required defaultValue="">
                    <option value="" disabled>
                      Select one
                    </option>
                    <option>Office</option>
                    <option>Clinic</option>
                    <option>Laundromat</option>
                    <option>Warehouse</option>
                    <option>Hotel</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <label className={styles.label}>
                Address (optional)
                <input
                  className={styles.input}
                  name="address"
                  autoComplete="street-address"
                  placeholder="Street, City, State"
                />
              </label>

              <label className={styles.label}>
                Message
                <textarea
                  className={styles.textarea}
                  name="message"
                  placeholder="Tell us what you need (snacks + drinks combo machine, number of employees/guests, etc.)"
                  rows={6}
                  required
                />
              </label>

              <button
                className={styles.button}
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>

              {status === "sent" && (
                <p className={styles.success}>
                  ✅ Message sent. We’ll get back to you shortly.
                </p>
              )}

              {status === "error" && (
                <p className={styles.error}>
                  Something went wrong. Please call or email us instead.
                </p>
              )}
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
