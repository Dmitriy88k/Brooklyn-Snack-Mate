import styles from "./hero.module.css";
import { motion } from "framer-motion";
import Machine from "../../assets/Smart_Vending_Machine_2.png"

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.content}>
          <motion.h1
            className={styles.title}
            initial={{ y: -44, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 65, // lower = slower
              damping: 18, // higher = less bounce
              mass: 1.1,
            }}
          >
            <span className={styles.vending}>Vending</span>
            <br />
            <span className={styles.you}>You Can</span>
            <br />
            <span className={styles.rely}>Rely On</span>
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ y: -22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1.1,
              delay: 0.18,
              ease: [0.12, 0.95, 0.2, 1],
            }}
          >
            Better than traditional vending. Easier than managing it yourself.
          </motion.p>

          <motion.p
            className={styles.support}
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            transition={{
              duration: 1.05,
              delay: 0.32,
              ease: [0.12, 0.95, 0.2, 1],
            }}
          >
            From installation to restocking and maintenance, our local team
            handles everything — with brand-new machines and consistent service
            across Brooklyn and NYC.
          </motion.p>
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
      <img src={Machine} alt="Smart vending machine" />
    </motion.div>
    </div>
    </section>
  );
}
