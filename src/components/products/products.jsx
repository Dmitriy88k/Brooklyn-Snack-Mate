import { useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../lib/firebase";
import styles from "./products.module.css";

const PAGE_SIZE = 25;
const SCROLL_TOP_THRESHOLD_INDEX = 19;

const CATEGORY_GROUPS = {
  Drinks: [
    "Energy Drinks",
    "Sports Drinks",
    "Protein Shakes",
    "Refreshing Beverages",
    "Soda",
  ],
  Snacks: ["Chips", "Snacks", "Sweets"],
};

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sentinelRef = useRef(null);
  const loadObserverRef = useRef(null);
  const thresholdObserverRef = useRef(null);
  const thresholdProductRef = useRef(null);
  const isFetchingRef = useRef(false);

  const categories = ["All", "Drinks", "Snacks"];

  const getMainCategory = (product) => {
    const productCategory = product.category?.trim();

    if (CATEGORY_GROUPS.Drinks.includes(productCategory)) return "Drinks";
    if (CATEGORY_GROUPS.Snacks.includes(productCategory)) return "Snacks";

    return "Other";
  };

  const productMatchesCategory = (product, category) => {
    if (category === "All") return true;
    return getMainCategory(product) === category;
  };

  const loadProducts = async ({
    initial = false,
    category = activeCategory,
    cursor = lastDoc,
  } = {}) => {
    if (isFetchingRef.current) return;
    if (!initial && !cursor) return;

    isFetchingRef.current = true;

    if (initial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    setError("");

    try {
      const productsRef = collection(db, "products");

      let collectedItems = [];
      let currentCursor = cursor;
      let newLastDoc = cursor;
      let moreAvailable = true;

      while (collectedItems.length < PAGE_SIZE && moreAvailable) {
        const q = currentCursor
          ? query(
              productsRef,
              orderBy("sortOrder", "asc"),
              startAfter(currentCursor),
              limit(PAGE_SIZE)
            )
          : query(productsRef, orderBy("sortOrder", "asc"), limit(PAGE_SIZE));

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          moreAvailable = false;
          break;
        }

        newLastDoc = snapshot.docs[snapshot.docs.length - 1];
        currentCursor = newLastDoc;

        const batchItems = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = "";

            if (data.imagePath) {
              try {
                const storageRef = ref(storage, `products/${data.imagePath}`);
                imageUrl = await getDownloadURL(storageRef);
              } catch (imgError) {
                console.error(
                  `Failed to load image for ${data.name}:`,
                  imgError
                );
              }
            }

            return {
              id: doc.id,
              ...data,
              imageUrl,
            };
          })
        );

        const matchingItems = batchItems.filter((item) =>
          productMatchesCategory(item, category)
        );

        collectedItems = [...collectedItems, ...matchingItems];

        if (snapshot.docs.length < PAGE_SIZE) {
          moreAvailable = false;
        }
      }

      const visibleItems = collectedItems.slice(0, PAGE_SIZE);

      setProducts((prev) => (initial ? visibleItems : [...prev, ...visibleItems]));
      setLastDoc(newLastDoc);
      setHasMore(moreAvailable);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Unable to load products right now.");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setLastDoc(null);
    setHasMore(true);
    setShowScrollTop(false);

    loadProducts({
      initial: true,
      category: activeCategory,
      cursor: null,
    });
  }, [activeCategory]);

  useEffect(() => {
    if (loading) return;
    if (loadingMore) return;
    if (!hasMore) return;
    if (!sentinelRef.current) return;

    if (loadObserverRef.current) {
      loadObserverRef.current.disconnect();
    }

    loadObserverRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && !isFetchingRef.current) {
          loadProducts({
            initial: false,
            category: activeCategory,
            cursor: lastDoc,
          });
        }
      },
      {
        root: null,
        rootMargin: "300px 0px",
        threshold: 0,
      }
    );

    loadObserverRef.current.observe(sentinelRef.current);

    return () => {
      if (loadObserverRef.current) {
        loadObserverRef.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore, lastDoc, products.length, activeCategory]);

  useEffect(() => {
    if (thresholdObserverRef.current) {
      thresholdObserverRef.current.disconnect();
    }

    if (products.length <= 30) {
      setShowScrollTop(false);
      return;
    }

    const targetNode = thresholdProductRef.current;

    if (!targetNode) {
      setShowScrollTop(false);
      return;
    }

    thresholdObserverRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        const passedThresholdProduct =
          entry.boundingClientRect.top < 0 && !entry.isIntersecting;

        setShowScrollTop(passedThresholdProduct);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    thresholdObserverRef.current.observe(targetNode);

    return () => {
      if (thresholdObserverRef.current) {
        thresholdObserverRef.current.disconnect();
      }
    };
  }, [products, activeCategory]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerHero}>
            <p className={styles.eyebrow}>Brooklyn Snack Mate</p>
            <h1 className={styles.title}>Our Products</h1>
            <p className={styles.subtitle}>
              Browse our selection of snacks and drinks available for vending
              machines and workplace locations.
            </p>
          </div>
        </header>

        {!loading && (
          <section className={styles.toolbar}>
            <div className={styles.toolbarTop}>
              <h2 className={styles.toolbarTitle}>Browse by category</h2>
              <p className={styles.resultCount}>
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className={styles.filters}>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`${styles.filterBtn} ${
                    activeCategory === category ? styles.filterBtnActive : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        )}

        {loading && <p className={styles.messageBox}>Loading products...</p>}

        {!loading && error && (
          <p className={`${styles.messageBox} ${styles.messageError}`}>
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className={styles.messageBox}>No products found yet.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <section className={styles.grid}>
              {products.map((product, index) => (
                <article
                  key={product.id}
                  ref={
                    index === SCROLL_TOP_THRESHOLD_INDEX
                      ? thresholdProductRef
                      : null
                  }
                  className={styles.card}
                >
                  <div className={styles.imageWrap}>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className={styles.image}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.imageFallback}>
                        No image available
                      </div>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.productName}>{product.name}</h3>
                  </div>
                </article>
              ))}
            </section>

            {loadingMore && (
              <p className={styles.messageBox}>Loading more products...</p>
            )}

            {hasMore && (
              <div
                ref={sentinelRef}
                className={styles.loadSentinel}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </section>

      <button
        type="button"
        onClick={scrollToTop}
        className={`${styles.scrollTopBtn} ${
          showScrollTop ? styles.scrollTopBtnVisible : ""
        }`}
        aria-label="Scroll to top"
      >
        <svg
          className={styles.scrollTopIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6.5 14.5L12 9l5.5 5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </main>
  );
}