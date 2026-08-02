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
    const [clientes] = await pool.query(
      'SELECT nombre, correo, telefono, rol FROM clientes ORDER BY id DESC'
    );
    res.json(clientes);
  } catch (error) {
    console.error('Error al consultar clientes:', error);
    res.status(500).json({ error: 'No se pudieron obtener los clientes.' });
  }
});

// Ruta para CREAR un nuevo cliente desde el modal
router.post('/', verificarToken, async (req, res) => {
  const { nombre, correo, telefono, rol } = req.body;

  // Validación básica
  if (!nombre || !correo || !rol) {
    return res.status(400).json({ error: 'Nombre, correo y rol son campos requeridos.' });
  }

  try {

    const [resultado] = await pool.query(
      'INSERT INTO clientes (nombre, correo, telefono, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, telefono, rol]
    );

    const nuevoCliente = {
      id: resultado.insertId,
      nombre,
      correo,
      telefono,
      rol
    };

    res.status(201).json(nuevoCliente); // Devuelve el nuevo cliente creado
  } catch (error) {
    console.error('Error al crear cliente:', error);
    // Error de entrada duplicada (correo ya existe)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
    }
    res.status(500).json({ error: 'No se pudo crear el cliente.' });
  }
});


module.exports = router;
