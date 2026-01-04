import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./contactForm.module.css";

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const form = e.currentTarget;
      const data = new FormData(form);

      data.append(
        "_subject",
        "New Vending Placement Inquiry (Brooklyn SnackMate)"
      );
      data.append("_format", "plain");

      const res = await fetch("https://formspree.io/f/xaqndryw", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        {/* TITLE: comes from top */}
        <motion.header
          className={styles.header}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <h1 className={styles.title}>Contact Us</h1>
        </motion.header>

        <div className={styles.grid}>
          {/* LEFT: info card (from left) */}
          <motion.aside
            className={styles.infoCard}
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 1.25,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <h2 className={styles.cardTitle}>What to include</h2>
            <ul className={styles.list}>
              <li>Business name & address</li>
              <li>Type of location (office, hotel, clinic, etc.)</li>
              <li>Approx. daily foot traffic (if known)</li>
              <li>Best contact person + phone</li>
            </ul>

            <div className={styles.divider} />

            <div className={styles.quick}>
            <a
  className={`${styles.quickLink} ${styles.phoneLink}`}
  href="tel:+19297776229"
>
  Call: +1 (929) 777-6229
</a>

<a
  className={`${styles.quickLink} ${styles.emailLink}`}
  href="mailto:info@brooklynsnackmate.com"
>
  Email: info@brooklynsnackmate.com
</a>


              <p className={styles.note}>
                No spam. We only use your info to respond to this request.
              </p>
            </div>
          </motion.aside>

          {/* RIGHT: form card (from right) */}
          <motion.section
            className={styles.formCard}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 1.25,
              delay: 0.38,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.row}>
                <label className={styles.label}>
                  Name
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
                    placeholder="(718) 888-8888"
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
                  <select
                    className={styles.input}
                    name="locationType"
                    required
                    defaultValue=""
                  >
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
                  placeholder="Street, City, State, Zip."
                />
              </label>

              <label className={styles.label}>
                Message
                <textarea
                  className={styles.textarea}
                  name="message"
                  placeholder="We’d love to learn more about your location — please share a few details such as the type of machine you’re interested in and the number of employees or guests."
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
          </motion.section>
        </div>
      </section>
    </main>
  );
}
