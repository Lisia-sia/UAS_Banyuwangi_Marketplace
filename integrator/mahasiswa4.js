const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Deteksi URL Host (Supaya jalan di Localhost maupun Vercel)
        const protocol = req.protocol;
        const host = req.get('host');
        const baseURL = `${protocol}://${host}`;

        // 1. CONSUME: Ambil data dari 3 Vendor sekaligus [cite: 74]
        const [respA, respB, respC] = await Promise.all([
            axios.get(`${baseURL}/api/vendor-a`),
            axios.get(`${baseURL}/api/vendor-b`),
            axios.get(`${baseURL}/api/vendor-c`)
        ]);

        const dataA = respA.data;
        const dataB = respB.data;
        const dataC = respC.data;

        // 2. NORMALISASI & MAPPING

        // --- Vendor A (Warung) ---
        const cleanA = dataA.map(item => {
            // Syarat: Ubah string "15000" jadi integer [cite: 79]
            let hargaInt = parseInt(item.hrg);
            
            // Syarat: Diskon 10% khusus Vendor A [cite: 83]
            let hargaFinal = hargaInt - (hargaInt * 0.10); 

            return {
                id: item.kd_produk,
                nama_produk: item.nm_brg,
                harga: hargaFinal,
                // Syarat: "ada" tetap, "habis" jadi konsisten [cite: 80]
                status: (item.ket_stok === 'ada') ? 'Tersedia' : 'Habis',
                sumber: "Vendor A (Warung)"
            };
        });

        // --- Vendor B (Distro) ---
        const cleanB = dataB.map(item => {
            // Syarat: Produk Vendor B tidak ada perubahan harga [cite: 86]
            return {
                id: item.sku,
                nama_produk: item.productName,
                harga: item.price, 
                // Syarat: true diubah jadi "Tersedia" [cite: 81]
                status: (item.isAvailable) ? 'Tersedia' : 'Habis',
                sumber: "Vendor B (Distro)"
            };
        });

        // --- Vendor C (Resto) ---
        const cleanC = dataC.map(item => {
            // Syarat: Harga base + tax [cite: 82]
            let hargaFinal = item.pricing.base_price + item.pricing.tax;
            
            // Syarat: Jika kategori Food, tambah label (Recommended) [cite: 84-85]
            let namaFinal = item.details.name;
            if(item.details.category === 'Food') {
                namaFinal = namaFinal + " (Recommended)";
            }

            return {
                id: item.id.toString(),
                nama_produk: namaFinal,
                harga: hargaFinal,
                status: (item.stock > 0) ? 'Tersedia' : 'Habis',
                sumber: "Vendor C (Resto)"
            };
        });

        // 3. OUTPUT AKHIR (Merge) [cite: 76-77]
        const hasilAkhir = [...cleanA, ...cleanB, ...cleanC];

        res.json({
            status: "success",
            total_data: hasilAkhir.length,
            data: hasilAkhir
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Gagal mengambil data", 
            detail: error.message 
        });
    }
});

module.exports = router;