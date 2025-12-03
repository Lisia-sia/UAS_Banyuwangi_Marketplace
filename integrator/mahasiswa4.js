const vendorA = require("../vendor/mahasiswa1");
const vendorB = require("../vendor/mahasiswa2");
const vendorC = require("../vendor/mahasiswa3");

function normalize() {
    const dataA = vendorA().map(item => ({
        id: item.kd_produk,
        product_name: item.nm_brg,
        // ubah string harga → integer
        price_final: parseInt(item.hrg),

        // stok: "ada" / "habis" tetap dipakai
        stock_status: item.ket_stok,

        vendor: "A"
    }));

    const dataB = vendorB().map(item => ({
        id: item.sku,
        product_name: item.productName,
        price_final: item.price,

        // true → "Tersedia", false → "Habis"
        stock_status: item.isAvailable ? "Tersedia" : "Habis",

        vendor: "B"
    }));

    const dataC = vendorC().map(item => {
        let name = item.details.name;

        // jika kategori Food → tambahkan (Recommended)
        if (item.details.category === "Food") {
            name += " (Recommended)";
        }

        return {
            id: item.id,
            product_name: name,
            // harga = base_price + tax
            price_final: item.pricing.base_price + item.pricing.tax,
            stock_status: item.stock > 0 ? "Tersedia" : "Habis",
            vendor: "C"
        };
    });

    // Terapkan aturan diskon vendor A
    dataA.forEach(item => {
        item.price_final = Math.floor(item.price_final * 0.9); // diskon 10%
    });

    // Gabungkan semua data
    return [...dataA, ...dataB, ...dataC];
}

module.exports = { normalize };
