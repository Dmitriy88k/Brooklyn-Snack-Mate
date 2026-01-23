"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./about.module.css";

/* Detect mobile BEFORE first render */
function isMobileNow() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 700px)").matches;
}

export default function AboutPage() {
  const reduceMotion = useReducedMotion();

  // Critical: initialize correctly so desktop is NOT treated as mobile
  const [isMobile, setIsMobile] = useState(isMobileNow);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const handler = () => setIsMobile(mq.matches);

    handler();

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const disableMotion = reduceMotion || isMobile;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <h1 className={styles.title}>About Us</h1>
        </header>

        {/* CARD — animated ONLY on desktop */}
        <motion.section
          className={styles.card}
          initial={
            disableMotion
              ? false
              : { opacity: 0, y: 24 }
          }
          animate={
            disableMotion
              ? false
              : { opacity: 1, y: 0 }
          }
          transition={
            disableMotion
              ? { duration: 0 }
              : {
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1], // your original easing
                }
          }
        >
          {/* ABOUT */}
          <section className={styles.section}>
            <p className={styles.paragraph}>
              We believe vending should be more than simply placing a machine.
              Every location is approached individually, with close attention to
              the people who use it. From machine placement to product selection,
              we take a hands-on approach to ensure each setup fits the space and
              the customers it serves.
            </p>

            <p className={styles.paragraph}>
              We work closely with our clients to choose products that make sense
              for their location and audience. Each machine includes a simple
              online feedback option, allowing users to share suggestions or
              service needs at any time. We don’t restock on autopilot — we review
              feedback, monitor usage, and make thoughtful adjustments to keep
              service consistent and relevant.
            </p>

            <p className={styles.paragraph}>
              As a business owner or property manager, you don’t need to worry
              about restocking, cleaning, maintenance, or insurance. We handle
              every aspect of the service at no cost to you, keeping each machine
              clean, stocked, and fully operational. Our goal is to be a
              dependable, straightforward partner you can rely on.
            </p>
          </section>

          <div className={styles.divider} />

          {/* HOW IT WORKS */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How It Works</h2>

            <ol className={styles.steps}>
              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>1</span>
                  <h3 className={styles.stepTitle}>
                    Initial Review of the Space
                  </h3>
                </div>
                <p className={styles.stepText}>
                  We start by reviewing your location to understand foot traffic,
                  available space, and electrical access.
                </p>
              </li>

              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>2</span>
                  <h3 className={styles.stepTitle}>
                    Placement Recommendation
                  </h3>
                </div>
                <p className={styles.stepText}>
                  We recommend a visible, accessible, and practical placement.
                </p>
              </li>

              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>3</span>
                  <h3 className={styles.stepTitle}>Product Selection</h3>
                </div>
                <p className={styles.stepText}>
                  We select snacks and drinks based on your audience.
                </p>
              </li>

              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>4</span>
                  <h3 className={styles.stepTitle}>Installation</h3>
                </div>
                <p className={styles.stepText}>
                  We deliver, install, and stock the machine.
                </p>
              </li>

              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>5</span>
                  <h3 className={styles.stepTitle}>Ongoing Service</h3>
                </div>
                <p className={styles.stepText}>
                  We handle restocking, cleaning, maintenance, and insurance.
                </p>
              </li>

              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>6</span>
                  <h3 className={styles.stepTitle}>
                    Monitoring and Adjustments
                  </h3>
                </div>
                <p className={styles.stepText}>
                  We adjust products and service based on usage and feedback.
                </p>
              </li>
            </ol>
          </section>

          <div className={styles.divider} />

          {/* CTA */}
          <section className={styles.ctaWrap}>
            <div className={styles.ctaText}>
              <p className={styles.ctaLead}>
                Considering vending for your location?
              </p>
              <p className={styles.ctaSub}>
                Get in touch and we’ll walk you through how it works.
              </p>
            </div>

            <a className={styles.contactButton} href="/contact">
              Contact Us
            </a>
          </section>
        </motion.section>
      </section>
    </main>
  );
}
