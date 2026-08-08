const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Importar conexión a la BD

const router = express.Router();

// RUTA DE REGISTRO
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar en la base de datos (contrasena)
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword]
    );

    res.status(201).json({ id: result.insertId, nombre, email });

  } catch (error) {
    // Manejar error de correo duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al registrar el usuario.' });
  }
});


// RUTA DE LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
  }

  try {
    // Buscar usuario por correo
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
    const usuario = rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' }); // No decir si es usuario o pass
    }

    // Comparar la contraseña enviada con la hasheada en la BD
    const esCorrecta = await bcrypt.compare(password, usuario.contrasena);

    if (!esCorrecta) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Si todo es correcto, crear el token JWT
    const payload = { 
      usuario: { 
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      } 
    };
    
    // Usar clave secreta del archivo .env
    const secretKey = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // El token expira en 1 hora

    // Enviar respuesta al frontend
    res.json({
      token,
      usuario: payload.usuario
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al iniciar sesión.' });
  }
});

module.exports = router;

