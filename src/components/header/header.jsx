import { useEffect, useState } from "react";
import styles from "./header.module.css";
import Logo from "../../assets/Brkln_logo.png";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

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
    <header className={`${styles.header} ${open ? styles.headerOpen : ""}`}>
      <Link to="/" className={styles.logoLink} onClick={() => setOpen(false)}>
        <img
          src={Logo}
          alt="Brooklyn Snack Mate Logo"
          className={styles.logo}
        />
      </Link>

      <div className={styles.rightGroup}>
        <nav className={styles.desktopNav}>

          {/*<Link to="/survey">Machines</Link> */} 
          <Link to="/products">Products</Link> 
          <Link to="/about-us" >About Us</Link>
          {/* <Link >FAQs</Link> */}
        </nav>

        <Link to="/get-a-machine" className={styles.contactButton}>
          <span className={styles.btnText}>Get a Machine</span>
        </Link>
      </div>

      {/* ✅ Mobile hamburger */}
      <div className={styles.mobileRight}>
        <Link
          to="/get-a-machine"
          className={styles.contactButton}
          onClick={() => setOpen(false)}
        >
          <span className={styles.btnText}>Get a Machine

          </span>
        </Link>

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
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{
                type: "tween",
                duration: 0.28,
                ease: "easeInOut",
              }}
            >
              {/*<Link 
                className={styles.menuItem} 
                to="/"
                onClick={() => setOpen(false)}
              >
                Machines
              </Link> 
              */}

              <Link 
                className={styles.menuItem} 
                to="/products"
                onClick={() => setOpen(false)}
              >
                Products
              </Link>

              <Link
                className={styles.menuItem}
                to="/about-us"
                onClick={() => setOpen(false)}
              >
                About Us
              </Link>
              
              {/* <Link
                className={styles.menuItem}
                to="/contact"
                onClick={() => setOpen(false)}
              >
                FAQs
              </Link> */}
              
              
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
