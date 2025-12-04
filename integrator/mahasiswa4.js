const db = require("../db.js");

function normalize(dataA, dataB, dataC) {
  const normA = dataA.map(item => {
    let harga = Math.floor(parseInt(item.hrg) * 0.9);

    return {
      original_id: item.kd_produk,
      product_name: item.nm_brg,
      price_final: harga,
      stock_status: item.ket_stok === "habis" ? "Habis" : "Tersedia",
      vendor: "A"
    };
  });

  const normB = dataB.map(item => ({
    original_id: item.sku,
    product_name: item.product_name,
    price_final: item.price,
    stock_status: item.is_available ? "Tersedia" : "Habis",
    vendor: "B"
  }));

  const normC = dataC.map(item => ({
    original_id: item.product_code.toString(),
    product_name: item.name,
    price_final: item.base_price + item.tax,
    stock_status: item.stock > 0 ? "Tersedia" : "Habis",
    vendor: "C"
  }));

  return [...normA, ...normB, ...normC];
}

async function saveIntegrated(data) {
  await db.query("DELETE FROM integrated_products");

  for (const item of data) {
    await db.query(
      `INSERT INTO integrated_products 
      (original_id, product_name, price_final, stock_status, vendor)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        item.original_id,
        item.product_name,
        item.price_final,
        item.stock_status,
        item.vendor
      ]
    );
  }

  return { message: "Integrated data saved!" };
}

module.exports = { normalize, saveIntegrated };
