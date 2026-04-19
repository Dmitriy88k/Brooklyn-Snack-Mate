const admin = require("firebase-admin");
const fs = require("fs");
const csv = require("csv-parser");
const serviceAccount = require("./keys/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const products = [];

fs.createReadStream("./products.csv")
  .pipe(csv())
  .on("data", (row) => {
    products.push({
      name: row.name?.trim() || "",
      category: row.category?.trim() || "",
      imagePath: row.imagePath?.trim() || "",
      sortOrder: Number(row.sortOrder) || 0,
    });
  })
  .on("end", async () => {
    try {
      if (products.length === 0) {
        console.log("No products found in CSV.");
        return;
      }

      const batchSize = 500;

      for (let i = 0; i < products.length; i += batchSize) {
        const batch = db.batch();
        const chunk = products.slice(i, i + batchSize);

        chunk.forEach((product) => {
          const docRef = db.collection("products").doc();
          batch.set(docRef, product);
        });

        await batch.commit();
        console.log(
          `Uploaded batch ${Math.floor(i / batchSize) + 1} (${chunk.length} products)`
        );
      }

      console.log("All products uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  });