import { useEffect, useState } from "react";
import styles from "./header.module.css";
import Logo from "../../assets/Brkln_logo.png";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1200) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className={styles.header}>
      <img src={Logo} alt="Brooklyn Snack Mate Logo" className={styles.logo} />

      <div className={styles.rightGroup}>
        <nav className={styles.desktopNav}>
          <a href="tel:+11234567890">Call</a>
          <a href="#survey">Survey</a>
          <a href="#contact">Contact</a>
          <a href="#test">Test</a>
        </nav>

        <a href="#contact" className={styles.contactButton}>
          <span className={styles.btnText}>CONTACT</span>
        </a>
      </div>

      {/* ✅ Mobile hamburger */}
       <div className={styles.mobileRight}>
        <a href="#contact" className={styles.contactButton}>
          <span className={styles.btnText}>CONTACT</span>
        </a>

      <button
        className={styles.iconButton}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
            >
              <X size={28} strokeWidth={2.8} />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
            >
              <Menu size={28} strokeWidth={2.8} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.menuPanel}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <a className={styles.menuItem} href="tel:+11234567890">Call</a>
            <a className={styles.menuItem} href="#contact">Contact</a>
            <a className={styles.menuItem} href="#survey">Survey</a>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
}
