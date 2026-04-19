"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./contactForm.module.css";

function isMobileNow() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 700px)").matches;
}

const MACHINE_OPTIONS = [
  {
    label: "Combo",
    value: "Snacks & Drinks (Combo)",
  },
  {
    label: "Drinks Only",
    value: "Drinks only",
  },
  {
    label: "Snacks Only",
    value: "Snacks only",
  },
  {
    label: "Laundromat",
    value: "Laundromat machine",
  },
];

export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(isMobileNow);
  const [selectedMachineType, setSelectedMachineType] = useState("Not sure");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const handler = () => setIsMobile(mq.matches);

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const disableMotion = reduceMotion || isMobile;

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const form = e.currentTarget;
      const data = new FormData(form);

      data.append("_subject", "New Vending Placement Inquiry (Brooklyn Snack Mate)");
      data.append("_format", "plain");

      const res = await fetch("https://formspree.io/f/xaqndryw", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
        setSelectedMachineType("Not sure");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <motion.header
          className={styles.header}
          initial={disableMotion ? false : { y: -40, opacity: 0 }}
          animate={disableMotion ? false : { y: 0, opacity: 1 }}
          transition={
            disableMotion
              ? { duration: 0 }
              : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
          }
        >
          <p className={styles.eyebrow}>Brooklyn Snack Mate</p>
          <h1 className={styles.title}>Get a Vending Machine</h1>
        </motion.header>

        <div className={styles.grid}>
          <motion.aside
            className={styles.infoCard}
            initial={disableMotion ? false : { x: -40, opacity: 0 }}
            animate={disableMotion ? false : { x: 0, opacity: 1 }}
            transition={
              disableMotion
                ? { duration: 0 }
                : { duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <h2 className={styles.cardTitle}>What we provide</h2>
            <ul className={styles.list}>
              <li>Machine installation</li>
              <li>Regular restocking</li>
              <li>Maintenance and support</li>
              <li>Customized product selection</li>
            </ul>

            <div className={styles.divider} />

            <h2 className={styles.cardTitle}>Machine options</h2>
            <div className={styles.machineTypes}>
              {MACHINE_OPTIONS.map((option) => {
                const isSelected = selectedMachineType === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`${styles.machineOption} ${
                      isSelected ? styles.machineOptionActive : ""
                    }`}
                    onClick={() => setSelectedMachineType(option.value)}
                    aria-pressed={isSelected}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

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
                We only use your information to respond to this inquiry.
              </p>
            </div>
          </motion.aside>

          <motion.section
            className={styles.formCard}
            initial={disableMotion ? false : { x: 40, opacity: 0 }}
            animate={disableMotion ? false : { x: 0, opacity: 1 }}
            transition={
              disableMotion
                ? { duration: 0 }
                : { duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.row}>
                <label className={styles.label}>
                  Contact name
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
                  Business name
                  <input
                    className={styles.input}
                    name="businessName"
                    placeholder="Company / clinic / laundromat"
                    required
                  />
                </label>
              </div>

              <div className={styles.row}>
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
                    <option>Medical Office / Clinic</option>
                    <option>Laundromat</option>
                    <option>Warehouse</option>
                    <option>Hotel</option>
                    <option>Retail / Customer Space</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className={styles.label}>
                  Machine type
                  <select
                    className={styles.input}
                    name="machineType"
                    value={selectedMachineType}
                    onChange={(e) => setSelectedMachineType(e.target.value)}
                  >
                    <option>Not sure</option>
                    <option>Snacks & Drinks (Combo)</option>
                    <option>Drinks only</option>
                    <option>Snacks only</option>
                    <option>Laundromat machine</option>
                  </select>
                </label>
              </div>

              <label className={styles.label}>
                Message
                <textarea
                  className={styles.textarea}
                  name="message"
                  placeholder="Tell us about your location, traffic, and what kind of machine you need."
                  rows={4}
                  required
                />
              </label>

              <button
                className={styles.button}
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Request Machine"}
              </button>

              {status === "sent" && (
                <p className={styles.success}>
                  ✅ Inquiry sent. We’ll get back to you shortly.
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