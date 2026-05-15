"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import styles from "./contactForm.module.css";

import comboFutura from "../../assets/combo-machine-futura.png";
import haha from "../../assets/haha-machine.png";
import snacksMachine from "../../assets/snacks-machine.png";
import drinksMini from "../../assets/drinks-mini-machine.png";
import largeBeverage from "../../assets/drinks-large-machine.png";
import outdoor from "../../assets/combo-outdoor-machine.png";
import largeCombo from "../../assets/combo-large-machine.png";
import laundry from "../../assets/laundry-machine.png";

const MACHINE_IMAGES = [
  {
    name: "Futura Combo Machine",
    type: "Snacks & Drinks",
    category: "Combo",
    image: comboFutura,
    bestFor: "Offices, schools, clinics",
  },
  {
    name: "AI Smart Machine",
    type: "Smart Vending",
    category: "Combo",
    image: haha,
    bestFor: "Premium locations",
  },
  {
    name: "Snacks Machine",
    type: "Snacks Only",
    category: "Snacks",
    image: snacksMachine,
    bestFor: "Break rooms & warehouses",
  },
  {
    name: "Mini Drinks Machine",
    type: "Mini Beverage",
    category: "Drinks",
    image: drinksMini,
    bestFor: "Small offices",
  },
  {
    name: "Large Drinks Machine",
    type: "Large Beverage",
    category: "Drinks",
    image: largeBeverage,
    bestFor: "High-traffic areas",
  },
  {
    name: "Outdoor Combo Machine",
    type: "Outdoor Combo",
    category: "Combo",
    image: outdoor,
    bestFor: "Outdoor spaces",
  },
  {
    name: "Large Combo Machine",
    type: "Large Combo",
    category: "Combo",
    image: largeCombo,
    bestFor: "Busy locations",
  },
  {
    name: "Laundry Machine",
    type: "Laundry Essentials",
    category: "Laundry",
    image: laundry,
    bestFor: "Laundromats & buildings",
  },
];

function isMobileNow() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 760px)").matches;
}

export default function ContactForm() {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(isMobileNow);
  const [status, setStatus] = useState("idle");
  const [selectedMachine, setSelectedMachine] = useState(MACHINE_IMAGES[0]);
  const [selectedMachineType, setSelectedMachineType] = useState(
    MACHINE_IMAGES[0].name,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const handler = () => setIsMobile(mq.matches);

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    function handleEsc(e) {
      if (e.key === "Escape") setIsModalOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  const disableMotion = reduceMotion || isMobile;

  function handleMachineSelect(machine) {
    setSelectedMachine(machine);
    setSelectedMachineType(machine.name);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const form = e.currentTarget;
      const data = new FormData(form);

      data.append(
        "_subject",
        "New Vending Placement Inquiry (Brooklyn Snack Mate)",
      );
      data.append("_format", "plain");

      if (selectedMachine) {
        data.append("selectedMachineName", selectedMachine.name);
        data.append("selectedMachineType", selectedMachine.type);
        data.append("selectedMachineCategory", selectedMachine.category);
      }

      const res = await fetch("https://formspree.io/f/xaqndryw", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
        setSelectedMachine(MACHINE_IMAGES[0]);
        setSelectedMachineType(MACHINE_IMAGES[0].name);
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
          className={styles.hero}
          initial={disableMotion ? false : { opacity: 0, y: 18 }}
          animate={disableMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.title}>Find the Right Machine</h1>
          <p className={styles.subtitle}>
            Choose a machine and we’ll take care of the rest.
          </p>
        </motion.header>

        <div className={styles.layout}>
          <motion.aside
            className={styles.machineCard}
            initial={disableMotion ? false : { opacity: 0, x: -22 }}
            animate={disableMotion ? false : { opacity: 1, x: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className={styles.cardHeader}>
              <p className={styles.step}>Step 1</p>
              <h2>Choose machine</h2>
            </div>

            <button
              type="button"
              className={styles.preview}
              onClick={() => setIsModalOpen(true)}
              aria-label={`View larger image of ${selectedMachine.name}`}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedMachine.name}
                  src={selectedMachine.image}
                  alt={selectedMachine.name}
                  initial={disableMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={disableMotion ? false : { opacity: 1, scale: 1 }}
                  exit={disableMotion ? undefined : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                />
              </AnimatePresence>
            </button>

            <div className={styles.selectedInfo}>
              <h3>{selectedMachine.name}</h3>
              <p>{selectedMachine.type}</p>
            </div>

            <div className={styles.machineGrid}>
              {MACHINE_IMAGES.map((machine) => {
                const active = selectedMachine.name === machine.name;

                return (
                  <button
                    key={machine.name}
                    type="button"
                    className={`${styles.machineOption} ${
                      active ? styles.machineOptionActive : ""
                    }`}
                    onClick={() => handleMachineSelect(machine)}
                    aria-pressed={active}
                  >
                    <img src={machine.image} alt="" />
                    <span>{machine.name}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.quickContact}>
              <a href="tel:+19297776229">+1 (929) 777-6229</a>
              <a href="mailto:info@brooklynsnackmate.com">
                info@brooklynsnackmate.com
              </a>
            </div>
          </motion.aside>

          <motion.section
            className={styles.formCard}
            initial={disableMotion ? false : { opacity: 0, x: 22 }}
            animate={disableMotion ? false : { opacity: 1, x: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.14,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className={styles.formHeader}>
              <p className={styles.step}>Step 2</p>
              <h2>Send request</h2>
            </div>

            <div className={styles.formBody}>
              <form className={styles.form} onSubmit={onSubmit}>
                <input
                  type="hidden"
                  name="selectedMachine"
                  value={selectedMachineType}
                />

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
                      placeholder="Company / location"
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
                        Select location
                      </option>
                      <option>Office</option>
                      <option>Medical Office / Clinic</option>
                      <option>Laundromat</option>
                      <option>Warehouse</option>
                      <option>Hotel</option>
                      <option>Retail / Customer Space</option>
                      <option>Residential Building</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label className={styles.label}>
                    Machine type
                    <select
                      className={styles.input}
                      name="machineType"
                      value={selectedMachineType}
                      onChange={(e) => {
                        setSelectedMachineType(e.target.value);

                        const match = MACHINE_IMAGES.find(
                          (machine) => machine.name === e.target.value,
                        );

                        setSelectedMachine(match || MACHINE_IMAGES[0]);
                      }}
                    >
                      <option>Not sure</option>
                      {MACHINE_IMAGES.map((machine) => (
                        <option key={machine.name} value={machine.name}>
                          {machine.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className={styles.label}>
                  Message
                  <textarea
                    className={styles.textarea}
                    name="message"
                    placeholder="Tell us about your location, traffic, and what kind of products you want."
                    rows={4}
                    required
                  />
                </label>

                <button
                  className={styles.button}
                  type="submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Request Machine"}
                </button>

                {status === "sent" && (
                  <p className={styles.success}>
                    Thank you for your request. We appreciate your interest and will contact you soon.
                  </p>
                )}

                {status === "error" && (
                  <p className={styles.error}>
                    Something went wrong. Please call or email us instead.
                  </p>
                )}
              </form>
            </div>
          </motion.section>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className={styles.modalOverlay}
            role="dialog"
            aria-modal="true"
            aria-label="Machine preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setIsModalOpen(false)}
          >
            <motion.div
              className={styles.modal}
              initial={
                disableMotion ? false : { opacity: 0, scale: 0.94, y: 18 }
              }
              animate={disableMotion ? false : { opacity: 1, scale: 1, y: 0 }}
              exit={
                disableMotion ? undefined : { opacity: 0, scale: 0.96, y: 10 }
              }
              transition={{ duration: 0.22 }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close preview"
              >
                ×
              </button>

              <div className={styles.modalImageWrap}>
                <img src={selectedMachine.image} alt={selectedMachine.name} />
              </div>

              <div className={styles.modalInfo}>
                <p>{selectedMachine.category}</p>
                <h3>{selectedMachine.name}</h3>
                <span>{selectedMachine.type}</span>
                <small>Best for: {selectedMachine.bestFor}</small>
              </div>

              <div className={styles.modalThumbs}>
                {MACHINE_IMAGES.map((machine) => {
                  const active = selectedMachine.name === machine.name;

                  return (
                    <button
                      key={machine.name}
                      type="button"
                      className={`${styles.modalThumb} ${
                        active ? styles.modalThumbActive : ""
                      }`}
                      onClick={() => handleMachineSelect(machine)}
                      aria-label={`Preview ${machine.name}`}
                    >
                      <img src={machine.image} alt="" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
