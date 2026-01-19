// FeedbackPage.jsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./feedback.module.css";

const FORMSPREE_URL = "https://formspree.io/f/xaqndryw";
const ease = [0.22, 1, 0.36, 1];

/**
 * MACHINE DIRECTORY
 * - Each QR should point to: https://www.brooklynsnackmate.com/feedback?m=machine-01
 * - Add your real locations here.
 */
const MACHINES = {
  "machine-01": {
    label: "Lenox Hill Radiology",
    address: "2095 Flatbush Ave, Brooklyn, NY 11234",
  },
  "machine-02": {
    label: "Family Medical Supply",
    address: "441 Kings Highway, Brooklyn, NY 11223",
  },
  "machine-03": {
    label: "Barber Shop",
    address: "1555 Cropsey Ave, Brooklyn, NY 11204",
  },
  
};

function getMachineFromUrl() {
  if (typeof window === "undefined") return { id: "", info: null };

  const params = new URLSearchParams(window.location.search);
  const idFromUrl = (params.get("m") || "").trim();

  // 1. If URL has machine → store it
  if (idFromUrl) {
    sessionStorage.setItem("activeMachine", idFromUrl);
  }

  // 2. Otherwise try restoring from session
  const storedId = idFromUrl || sessionStorage.getItem("activeMachine") || "";

  return {
    id: storedId,
    info: storedId ? MACHINES[storedId] || null : null,
  };
}


function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);

    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, [breakpoint]);

  return isMobile;
}

/* Professional inline SVG icons */
function IconAlert(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 9v4m0 4h.01M10.29 3.86 2.82 17.5A2 2 0 0 0 4.57 20h14.86a2 2 0 0 0 1.75-2.5L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBoxPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21 8.5V16a2 2 0 0 1-1.2 1.84L12 21l-7.8-3.16A2 2 0 0 1 3 16V8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 8.5 12 4l9 4.5L12 13 3 8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v-3m-1.5 1.5h3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSpark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2l1.2 4.2L17.4 7.4l-4.2 1.2L12 12.8l-1.2-4.2L6.6 7.4l4.2-1.2L12 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 12l.8 2.8 2.8.8-2.8.8L19 19l-.8-2.8-2.8-.8 2.8-.8L19 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

function IconMessage(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21 14a4 4 0 0 1-4 4H9l-4 3v-3a4 4 0 0 1-2-3.5V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h8M8 12h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

const CATEGORIES = [
  {
    key: "issue",
    title: "Report an Issue",
    desc: "Stuck item, payment problem, refund, screen not working.",
    icon: <IconAlert className={styles.iconSvg} />,
  },
  {
    key: "product",
    title: "Request a Product",
    desc: "Tell us what you want stocked next.",
    icon: <IconBoxPlus className={styles.iconSvg} />,
  },
  {
    key: "improve",
    title: "Suggest Improvement",
    desc: "Ideas to improve service & selection.",
    icon: <IconSpark className={styles.iconSvg} />,
  },
  {
    key: "other",
    title: "Other",
    desc: "Anything we didn’t cover.",
    icon: <IconMessage className={styles.iconSvg} />,
  },
];

function DrawerForm({
  cat,
  setCat,
  machine,

  // status
  status,
  setStatus,

  // shared
  contact,
  setContact,
  msg,
  setMsg,

  // issue
  issueType,
  setIssueType,
  lostMoney,
  setLostMoney,
  amount,
  setAmount,
  payment,
  setPayment,
  slot,
  setSlot,

  // product
  productName,
  setProductName,
  productNotes,
  setProductNotes,
}) {
  const canSubmit = useMemo(() => {
    if (!cat) return false;
    if (cat === "product") return productName.trim().length >= 2;
    if (cat === "issue") return msg.trim().length >= 10;
    return msg.trim().length >= 5;
  }, [cat, msg, productName]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit || status === "sending") return;

    setStatus("sending");

    try {
      const data = new FormData();

      // Meta
      data.append("_format", "plain");
      data.append(
        "_subject",
        `New Customer Feedback (${cat.toUpperCase()}) — Brooklyn SnackMate`
      );

      // Core fields
      data.append("category", cat);

      // Machine fields (id + friendly label/address)
      data.append("machineId", machine?.id || "Not provided");
      data.append("machineLabel", machine?.info?.label || "");
      data.append("machineAddress", machine?.info?.address || "");

      data.append("contact", contact || "");
      data.append("message", msg || "");

      // Category-specific
      if (cat === "issue") {
        data.append("issueType", issueType);
        data.append("lostMoney", lostMoney);
        data.append("amount", amount || "");
        data.append("paymentMethod", payment);
        data.append("slot", slot || "");
      }

      if (cat === "product") {
        data.append("requestedProduct", productName || "");
        data.append("productNotes", productNotes || "");
      }

      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setStatus("sent");

        // reset fields (keep category open so user sees success)
        setMsg("");
        setContact("");
        setAmount("");
        setSlot("");
        setProductName("");
        setProductNotes("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  const machineDisplay =
    machine?.info?.label || (machine?.id ? machine.id : "Not provided");

  return (
    <motion.form
      key={cat}
      className={styles.drawer}
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease }}
    >
      <div className={styles.drawerHeader}>
        <div>
          <div className={styles.drawerKicker}>Selected</div>
          <div className={styles.drawerTitle}>
            {CATEGORIES.find((x) => x.key === cat)?.title}
          </div>
          <div className={styles.drawerMeta}>
            Machine: <span>{machineDisplay}</span>
          </div>

          {machine?.info?.address && (
            <div className={styles.drawerMeta}>
              Location: <span>{machine.info.address}</span>
            </div>
          )}
        </div>

        {/* X close */}
        <button
          type="button"
          className={styles.closeX}
          onClick={() => {
            setCat(null);
            setStatus("idle");
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* ISSUE */}
      {cat === "issue" && (
        <div className={styles.formGrid}>
          <div className={styles.quickRow}>
            <button
              type="button"
              className={`${styles.quick} ${
                issueType === "stuck" ? styles.quickOn : ""
              }`}
              onClick={() => setIssueType("stuck")}
            >
              Stuck item
            </button>
            <button
              type="button"
              className={`${styles.quick} ${
                issueType === "payment" ? styles.quickOn : ""
              }`}
              onClick={() => setIssueType("payment")}
            >
              Payment issue
            </button>
            <button
              type="button"
              className={`${styles.quick} ${
                issueType === "screen" ? styles.quickOn : ""
              }`}
              onClick={() => setIssueType("screen")}
            >
              Screen/buttons
            </button>
            <button
              type="button"
              className={`${styles.quick} ${
                issueType === "other" ? styles.quickOn : ""
              }`}
              onClick={() => setIssueType("other")}
            >
              Other
            </button>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Did you lose money?</span>
            <select
              className={styles.input}
              value={lostMoney}
              onChange={(e) => setLostMoney(e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Payment method</span>
            <select
              className={styles.input}
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              <option value="card">Card</option>
              <option value="applepay">Apple Pay</option>
              <option value="googlepay">Google Pay</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
          </label>

          {lostMoney === "yes" && (
            <label className={styles.field}>
              <span className={styles.label}>Amount (approx.)</span>
              <input
                className={styles.input}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="$2.50"
              />
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Slot (optional)</span>
            <input
              className={styles.input}
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              placeholder="A3 / B7 / etc."
            />
          </label>

          <label className={`${styles.field} ${styles.full}`}>
            <span className={styles.label}>Describe the problem</span>
            <textarea
              className={styles.textarea}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Example: paid, no product dropped..."
              rows={6}
              required
            />
            <span className={styles.hint}>
              Include time + what you bought if you remember.
            </span>
          </label>
        </div>
      )}

      {/* PRODUCT */}
      {cat === "product" && (
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.label}>Product name</span>
            <input
              className={styles.input}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Coke Zero / Snickers / etc."
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Notes (optional)</span>
            <input
              className={styles.input}
              value={productNotes}
              onChange={(e) => setProductNotes(e.target.value)}
              placeholder="Flavor, size, brand..."
            />
          </label>

          <label className={`${styles.field} ${styles.full}`}>
            <span className={styles.label}>Why this product? (optional)</span>
            <textarea
              className={styles.textarea}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Optional — helps us pick winners."
              rows={5}
            />
          </label>
        </div>
      )}

      {/* IMPROVE */}
      {cat === "improve" && (
        <div className={styles.formGrid}>
          <label className={`${styles.field} ${styles.full}`}>
            <span className={styles.label}>Your idea</span>
            <textarea
              className={styles.textarea}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Example: more water, better mix, lower price..."
              rows={6}
              required
            />
          </label>
        </div>
      )}

      {/* OTHER */}
      {cat === "other" && (
        <div className={styles.formGrid}>
          <label className={`${styles.field} ${styles.full}`}>
            <span className={styles.label}>Message</span>
            <textarea
              className={styles.textarea}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Write anything..."
              rows={6}
              required
            />
          </label>
        </div>
      )}

      <div className={styles.divider} />

      <div className={styles.bottomRow}>
        <label className={styles.field}>
          <span className={styles.label}>Phone or email (optional)</span>
          <input
            className={styles.input}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Only if you want a response"
          />
        </label>

        <button
          className={styles.submit}
          type="submit"
          disabled={!canSubmit || status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Submit"}
        </button>
      </div>

      {status === "sent" && (
        <p className={styles.success}>✅ Sent. Thanks — we review feedback regularly.</p>
      )}

      {status === "error" && (
        <p className={styles.error}>
          Something went wrong. Please call or email us instead.
        </p>
      )}
    </motion.form>
  );
}

export default function FeedbackPage() {
  const machine = useMemo(() => getMachineFromUrl(), []);
  const isMobile = useIsMobile(900);

  const [cat, setCat] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  // shared
  const [contact, setContact] = useState("");
  const [msg, setMsg] = useState("");

  // issue
  const [issueType, setIssueType] = useState("stuck");
  const [lostMoney, setLostMoney] = useState("no");
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState("card");
  const [slot, setSlot] = useState("");

  // product
  const [productName, setProductName] = useState("");
  const [productNotes, setProductNotes] = useState("");

  function toggleCategory(key) {
    setStatus("idle");
    setCat((prev) => (prev === key ? null : key));
  }

  const machineDisplay =
    machine.info?.label || (machine.id ? machine.id : "Not provided");

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.heroTop}>
            <h1 className={styles.title}>Feedback Center</h1>

            <div className={styles.hud}>
              <div className={styles.hudItem}>
                <span className={styles.hudLabel}>Machine</span>
                <span className={styles.hudValue}>{machineDisplay}</span>
              </div>
              <div className={styles.hudItem}>
                <span className={styles.hudLabel}>Response</span>
                <span className={styles.hudValue}>Usually within 24h</span>
              </div>
            </div>
          </div>

          <div className={styles.flow}>
            <div className={styles.flowNode}>
              <span className={styles.flowDot} />
              <span className={styles.flowText}>Scan QR</span>
            </div>
            <div className={styles.flowLine} />
            <div className={styles.flowNode}>
              <span className={styles.flowDotActive} />
              <span className={styles.flowText}>Choose</span>
            </div>
            <div className={styles.flowLine} />
            <div className={styles.flowNode}>
              <span className={styles.flowDot} />
              <span className={styles.flowText}>Send</span>
            </div>
          </div>
        </header>

        <section className={styles.board}>
          <div className={styles.panelLeft}>
            <div className={styles.panelTitle}>Choose a category</div>

            <div className={styles.tiles}>
              {CATEGORIES.map((c) => {
                const active = cat === c.key;

                return (
                  <div key={c.key} className={styles.tileBlock}>
                    <motion.button
                      type="button"
                      className={`${styles.tile} ${active ? styles.tileActive : ""}`}
                      onClick={() => toggleCategory(c.key)}
                      whileHover={!isMobile ? { y: -2 } : undefined}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.18, ease }}
                    >
                      <div className={styles.tileIcon} aria-hidden="true">
                        {c.icon}
                      </div>
                      <div className={styles.tileBody}>
                        <div className={styles.tileTop}>
                          <div className={styles.tileTitle}>{c.title}</div>
                        </div>
                        <div className={styles.tileDesc}>{c.desc}</div>
                      </div>
                      <div className={styles.tileArrow} aria-hidden="true">
                        →
                      </div>
                    </motion.button>

                    {/* MOBILE INLINE FORM */}
                    {isMobile && (
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.div
                            className={styles.inlineFormWrap}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease }}
                          >
                            <div className={styles.inlineFormInner}>
                              <DrawerForm
                                cat={cat}
                                setCat={setCat}
                                machine={machine}
                                status={status}
                                setStatus={setStatus}
                                contact={contact}
                                setContact={setContact}
                                msg={msg}
                                setMsg={setMsg}
                                issueType={issueType}
                                setIssueType={setIssueType}
                                lostMoney={lostMoney}
                                setLostMoney={setLostMoney}
                                amount={amount}
                                setAmount={setAmount}
                                payment={payment}
                                setPayment={setPayment}
                                slot={slot}
                                setSlot={setSlot}
                                productName={productName}
                                setProductName={setProductName}
                                productNotes={productNotes}
                                setProductNotes={setProductNotes}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.smallNote}>
              Tip: If you want a reply, leave a phone/email at the end.
            </div>
          </div>

          {/* DESKTOP RIGHT PANEL ONLY */}
          {!isMobile && (
            <div className={styles.panelRight}>
              <AnimatePresence mode="wait">
                {!cat ? (
                  <motion.div
                    key="idle"
                    className={styles.idle}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={styles.idleCard}>
                      <div className={styles.idleTitle}>
                        Let us know how we can improve your experience.
                      </div>
                      <div className={styles.idleMini}>
                        <span className={styles.idleMiniDot} />
                        <span>
                          This message goes directly to the person who operates this machine.
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <DrawerForm
                    cat={cat}
                    setCat={setCat}
                    machine={machine}
                    status={status}
                    setStatus={setStatus}
                    contact={contact}
                    setContact={setContact}
                    msg={msg}
                    setMsg={setMsg}
                    issueType={issueType}
                    setIssueType={setIssueType}
                    lostMoney={lostMoney}
                    setLostMoney={setLostMoney}
                    amount={amount}
                    setAmount={setAmount}
                    payment={payment}
                    setPayment={setPayment}
                    slot={slot}
                    setSlot={setSlot}
                    productName={productName}
                    setProductName={setProductName}
                    productNotes={productNotes}
                    setProductNotes={setProductNotes}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
