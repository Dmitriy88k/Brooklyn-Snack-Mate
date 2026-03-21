import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../lib/firebase.jsx";
import styles from "./products.module.css";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, orderBy("sortOrder", "asc"));
        const snapshot = await getDocs(q);

        const items = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = "";

            if (data.imagePath) {
              try {
                const storageRef = ref(storage, `products/${data.imagePath}`);
                imageUrl = await getDownloadURL(storageRef);
              } catch (imgError) {
                console.error(`Failed to load image for ${data.name}:`, imgError);
              }
            }

            return {
              id: doc.id,
              ...data,
              imageUrl,
            };
          })
        );

        if (isMounted) {
          setProducts(items);
        }
      } catch (err) {
        console.error("Failed to load products:", err);

        if (isMounted) {
          setError("Unable to load products right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(products.map((item) => item.category).filter(Boolean)),
    ];
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((item) => item.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Brooklyn Snack Mate</p>
          <h1 className={styles.title}>Our Products</h1>
          <p className={styles.subtitle}>
            Browse our selection of snacks and drinks available for vending
            machines and workplace locations.
          </p>
        </header>

        {!loading && categories.length > 1 && (
          <section className={styles.toolbar}>
            <div className={styles.toolbarTop}>
              <h2 className={styles.toolbarTitle}>Browse by category</h2>
              <p className={styles.resultCount}>
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
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

        {!loading && !error && filteredProducts.length === 0 && (
          <p className={styles.messageBox}>No products found yet.</p>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <section className={styles.grid}>
            {filteredProducts.map((product) => (
              <article key={product.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={styles.image}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.imageFallback}>No image available</div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.productName}>{product.name}</h3>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}