"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./about.module.css";
import { Link } from "react-router-dom";

function isMobileNow() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 700px)").matches;
}

export default function AboutPage() {
  const reduceMotion = useReducedMotion();
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
          <div className={styles.headerHero}>
            <p className={styles.eyebrow}>Brooklyn Snack Mate</p>
            <h1 className={styles.title}>About Us</h1>
            <p className={styles.subtitle}>
              We provide full-service vending for offices, medical spaces,
              laundromats, and other high-traffic locations — with reliable
              support and a product mix tailored to the people who use it.
            </p>
          </div>
        </header>

        <motion.section
          className={styles.card}
          initial={disableMotion ? false : { opacity: 0, y: 24 }}
          animate={disableMotion ? false : { opacity: 1, y: 0 }}
          transition={
            disableMotion
              ? { duration: 0 }
              : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What makes our service different</h2>

            <p className={styles.paragraph}>
              We believe vending should be more than simply placing a machine.
              Every location is approached individually, with close attention to
              the people who use it. From machine placement to product selection,
              we take a hands-on approach to make sure each setup fits the space
              and the customers it serves.
            </p>

            <p className={styles.paragraph}>
              We work closely with our clients to choose products that make sense
              for their location and audience. We don’t restock on autopilot —
              we review usage, listen to feedback, and make thoughtful
              adjustments to keep service consistent and relevant.
            </p>

            <p className={styles.paragraph}>
              As a business owner or property manager, you don’t need to worry
              about restocking, cleaning, maintenance, or day-to-day service.
              We handle every aspect of the operation so the machine stays
              stocked, clean, and dependable.
            </p>
          </section>

          <div className={styles.divider} />

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How It Works</h2>

            <ol className={styles.steps}>
              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>1</span>
                  <h3 className={styles.stepTitle}>Initial Review</h3>
                </div>
                <p className={styles.stepText}>
                  We review your location to understand foot traffic, available
                  space, and the type of setup that makes the most sense.
                </p>
              </li>

              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>2</span>
                  <h3 className={styles.stepTitle}>Placement Recommendation</h3>
                </div>
                <p className={styles.stepText}>
                  We recommend a practical, visible location for the machine so
                  it is easy to access and makes sense for your space.
                </p>
              </li>

              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>3</span>
                  <h3 className={styles.stepTitle}>Product Selection</h3>
                </div>
                <p className={styles.stepText}>
                  We choose snacks and drinks based on your audience and the kind
                  of traffic your location gets.
                </p>
              </li>

              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>4</span>
                  <h3 className={styles.stepTitle}>Installation</h3>
                </div>
                <p className={styles.stepText}>
                  We deliver, install, and prepare the machine so it is ready to
                  use without creating extra work for your team.
                </p>
              </li>

              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>5</span>
                  <h3 className={styles.stepTitle}>Ongoing Service</h3>
                </div>
                <p className={styles.stepText}>
                  We handle restocking, cleaning, and service support to keep the
                  machine operating properly.
                </p>
              </li>

              <li className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>6</span>
                  <h3 className={styles.stepTitle}>Adjustments Over Time</h3>
                </div>
                <p className={styles.stepText}>
                  We monitor what works, refine the product mix, and make
                  improvements as your location’s needs evolve.
                </p>
              </li>
            </ol>
          </section>

          <div className={styles.divider} />

          <section className={styles.ctaWrap}>
            <div className={styles.ctaText}>
              <p className={styles.ctaLead}>
                Thinking about vending for your location?
              </p>
              <p className={styles.ctaSub}>
                Tell us about your space and we’ll help you figure out the right
                machine and setup.
              </p>
            </div>

            <Link to="/get-a-machine" className={styles.contactButton}>
              Get a Machine
            </Link>
          </section>
        </motion.section>
      </section>
    </main>
  );
}