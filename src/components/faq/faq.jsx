"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./faq.module.css";

function isMobileNow() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 700px)").matches;
}

const faqs = [
  {
    question: "Is vending machine installation free?",
    answer:
      "Yes. For qualifying locations, the vending machine, installation, stocking, and ongoing maintenance are provided at no cost.",
  },
  {
    question: "What types of businesses qualify?",
    answer:
      "Offices, medical offices, laundromats, warehouses, gyms, apartment buildings, and other commercial locations with sufficient foot traffic may qualify.",
  },
  {
    question: "Do we need to buy the vending machine?",
    answer:
      "No. The machine is provided as part of the service. There is no equipment purchase required.",
  },
  {
    question: "Who stocks and maintains the machine?",
    answer:
      "Brooklyn Snack Mate handles restocking, maintenance, and service so your staff does not have to manage inventory or machine issues.",
  },
  {
    question: "Can we choose the snacks and drinks?",
    answer:
      "Yes. Product selections can be customized based on the preferences of your employees, customers, tenants, or visitors.",
  },
  {
    question: "How much space is required?",
    answer:
      "Most locations only need a suitable space and access to a standard electrical outlet. We can help determine the best placement during the assessment process.",
  },
  {
    question: "What happens if the machine stops working?",
    answer:
      "If a machine issue occurs, simply contact us and we will arrange service as quickly as possible.",
  },
  {
    question: "How do I request a vending machine?",
    answer:
      "Contact us through our website or by phone and we will review your location to determine whether it qualifies for a vending machine installation.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Installation time depends on the location, machine type, and access to the space. In most cases, once the location is approved and prepared, the installation can be completed quickly.",
  },
];

export default function FAQPage() {
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
            <h1 className={styles.title}>FAQ</h1>
            <p className={styles.subtitle}>
              Answers to common questions about free vending machine placement,
              installation, stocking, maintenance, and ongoing service for
              qualifying locations.
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
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>

            <div className={styles.faqList}>
              {faqs.map((item, index) => (
                <article className={styles.faqItem} key={item.question}>
                  <div className={styles.faqHeader}>
                    <span className={styles.faqNumber}>{index + 1}</span>
                    <h3 className={styles.faqQuestion}>{item.question}</h3>
                  </div>

                  <p className={styles.faqAnswer}>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <div className={styles.divider} />

          <section className={styles.ctaWrap}>
            <div className={styles.ctaText}>
              <p className={styles.ctaLead}>
                Still have questions about vending service?
              </p>
              <p className={styles.ctaSub}>
                Tell us about your location and we’ll help you understand
                whether your space may qualify for a vending machine.
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