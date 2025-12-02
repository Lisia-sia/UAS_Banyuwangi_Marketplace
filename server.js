const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- INI BAGIAN YANG DISESUAIKAN DENGAN NAMA FOLDERMU ---
// Mengambil file dari folder "vendor" dan "integrator"
app.use('/api/vendor-a', require('./vendor/mahasiswa1'));
app.use('/api/vendor-b', require('./vendor/mahasiswa2'));
app.use('/api/vendor-c', require('./vendor/mahasiswa3'));
app.use('/api/banyuwangi-marketplace', require('./integrator/mahasiswa4'));

app.get('/', (req, res) => res.send('Server Banyuwangi Marketplace Jalan!'));

// Jalankan Server
const port = 3000;
if (require.main === module) {
    app.listen(port, () => console.log(`Server berjalan di http://localhost:${port}`));
}

module.exports = app;