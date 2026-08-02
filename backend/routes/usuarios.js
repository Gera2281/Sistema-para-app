const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
      'SELECT id, nombre, correo, telefono, rol FROM usuarios ORDER BY id DESC'
    );
    res.json(usuarios);
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ error: 'No se pudieron obtener los usuarios.' });
  }
});

router.post('/', verificarToken, async (req, res) => {
  const { nombre, correo, telefono, rol, contrasena } = req.body;

  if (!nombre || !correo || !rol || !contrasena) {
    return res.status(400).json({ error: 'Nombre, correo, rol y contraseña son obligatorios.' });
  }

  if (contrasena.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
  }

  try {
    const contrasenaCifrada = await bcrypt.hash(contrasena, 10);
    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, telefono, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, contrasenaCifrada, telefono || null, rol]
    );

    res.status(201).json({
      id: resultado.insertId,
      nombre,
      correo,
      telefono: telefono || null,
      rol
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
    }

    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'No se pudo crear el usuario.' });
  }
});

router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error al borrar usuario:', error);
    res.status(500).json({ error: 'No se pudo borrar el usuario.' });
  }
});

module.exports = router;
