const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

function generateToken(user) {
  // user berisi: { id, username, role }
  return jwt.sign(
    { user }, 
    JWT_SECRET, 
    { expiresIn: "1d" }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token tidak ditemukan. Silakan login terlebih dahulu.' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      console.error('JWT Verify Error:', err.message);
      return res.status(403).json({ 
        error: 'Token tidak valid atau kedaluwarsa' 
      });
    }

    if (!decodedPayload.user) {
      return res.status(403).json({ 
        error: 'Payload token tidak valid!' 
      });
    }

    // Simpan user di request (id, username, role)
    req.user = decodedPayload.user;
    next();
  });
}
function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Tidak terautentikasi' 
      });
    }

    if (req.user.role === role) {
      return next();
    } else {
      return res.status(403).json({ 
        error: 'Akses ditolak: role tidak memiliki izin' 
      });
    }
  };
}

module.exports = {
  generateToken,
  authenticateToken,
  authorizeRole
};
