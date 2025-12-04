function normalizeFromDB(dataA, dataB, dataC) {
  // Vendor A: Warung Klontong
  const normA = dataA.map(item => {
    let harga = parseInt(item.hrg); // string → number
    harga = Math.floor(harga * 0.9); // diskon 10%
    const stockStatus = item.ket_stok === "habis" ? "Habis" : "Tersedia";
    return {
      id: item.kd_produk,
      product_name: item.nm_brg,
      price_final: harga,
      stock_status: stockStatus,
      vendor: "A"
    };
  });

  // Vendor B: Distro Fashion
  const normB = dataB.map(item => ({
    id: item.sku,
    product_name: item.product_name,
    price_final: item.price,
    stock_status: item.is_available ? "Tersedia" : "Habis",
    vendor: "B"
  }));

  // Vendor C: Resto Kuliner
  const normC = dataC.map(item => {
    let name = item.name;
    if (item.category === "Food") {
      name += " (Recommended)";
    }
    return {
      id: item.product_code.toString(),
      product_name: name,
      price_final: item.base_price + item.tax,
      stock_status: item.stock > 0 ? "Tersedia" : "Habis",
      vendor: "C"
    };
  });

  return [...normA, ...normB, ...normC];
}

module.exports = { normalizeFromDB };