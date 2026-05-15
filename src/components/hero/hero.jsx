import styles from "./hero.module.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Machine from "../../assets/Smart_Vending_Machine_2.png";

const fadeUp = {
  initial: { y: 26, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.content}>
          <motion.p
            className={styles.eyebrow}
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Office • Medical Office • Laundromat Vending Service
          </motion.p>

          <motion.h1
            className={styles.title}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 62,
              damping: 18,
              mass: 1.1,
            }}
          >
            <span className={styles.vending}>Vending</span>
            <br />
            <span className={styles.you}>You Can</span>
            <br />
            <span className={styles.rely}>Rely On</span>
          </motion.h1>

          <motion.div
            className={styles.mobileMachineWrap}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <img
              src={Machine}
              alt="Smart vending machine"
              className={styles.mobileMachineImage}
            />
          </motion.div>

          <motion.p
            className={styles.subtitle}
            {...fadeUp}
            transition={{
              duration: 0.95,
              delay: 0.16,
              ease: [0.12, 0.95, 0.2, 1],
            }}
          >
            We install, stock, and maintain modern vending machines for offices,
            medical locations, and high-traffic businesses.
          </motion.p>

          <motion.p
            className={styles.support}
            {...fadeUp}
            transition={{
              duration: 1,
              delay: 0.28,
              ease: [0.12, 0.95, 0.2, 1],
            }}
          >
            Brand-new machines, dependable local service, and snack and drink
            selections tailored to your location — while we handle everything
            for you.
          </motion.p>

          <motion.div
            className={styles.ctaRow}
            {...fadeUp}
            transition={{
              duration: 0.95,
              delay: 0.4,
              ease: [0.12, 0.95, 0.2, 1],
            }}
          >
            <Link to="/get-a-machine" className={styles.primaryBtn}>
              Get a Machine
            </Link>

            <Link to="/products" className={styles.secondaryBtn}>
              View Products
            </Link>
          </motion.div>

          <motion.ul
            className={styles.highlights}
            {...fadeUp}
            transition={{
              duration: 0.95,
              delay: 0.5,
              ease: [0.12, 0.95, 0.2, 1],
            }}
          >
            <li>Fully managed vending service</li>
            <li>Restocking and maintenance handled for you</li>
            <li>
              Modern vending machines with products tailored to your location
            </li>
          </motion.ul>
        </div>

        <motion.div
          className={styles.machineWrap}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1.3,
            delay: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <img
            src={Machine}
            alt="Smart vending machine"
            className={styles.machineImage}
          />
        </motion.div>
      </div>
    </section>
  );
}