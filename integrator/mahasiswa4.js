const vendorA = require("../vendor/mahasiswa1");
const vendorB = require("../vendor/mahasiswa2");
const vendorC = require("../vendor/mahasiswa3");

function normalizeAllVendors() {
    
    // VENDOR A
    const A = vendorA.map(item => {
        const harga = parseInt(item.hrg);
        const harga_final = harga - harga * 0.10; // Diskon 10%

        return {
            vendor: "Vendor A",
            kode_produk: item.kd_produk,
            nama_produk: item.nm_brg,
            harga_final: harga_final,
            stok: item.ket_stok === "ada" ? "Tersedia" : "Habis"
        };
    });

    // VENDOR B
    const B = vendorB.map(item => {
        return {
            vendor: "Vendor B",
            kode_produk: item.sku,
            nama_produk: item.productName,
            harga_final: item.price,
            stok: item.isAvailable ? "Tersedia" : "Habis"
        };
    });

    // VENDOR C
    const C = vendorC.map(item => {
        const harga_final = item.pricing.base_price + item.pricing.tax;

        let nama = item.details.name;
        if (item.details.category === "Food") {
            nama += " (Recommended)";
        }

        return {
            vendor: "Vendor C",
            kode_produk: item.id,
            nama_produk: nama,
            harga_final: harga_final,
            stok: item.stock > 0 ? "Tersedia" : "Habis"
        };
    });

    // GABUNGKAN SEMUA
    return [...A, ...B, ...C];
}

module.exports = normalizeAllVendors;
