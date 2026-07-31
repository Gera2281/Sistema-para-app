const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

function verificarToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.substring(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Se requiere iniciar sesión.' });
  }

  try {
    req.sesion = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_por_defecto');
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Tu sesión expiró. Inicia sesión nuevamente.' });
  }
}

// No incluye la contraseña: este es el listado seguro para el dashboard.
router.get('/', verificarToken, async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      'SELECT id, nombre, correo FROM usuarios ORDER BY id DESC'
    );
    res.json(usuarios);
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ error: 'No se pudieron obtener los usuarios.' });
  }
});

module.exports = router;
