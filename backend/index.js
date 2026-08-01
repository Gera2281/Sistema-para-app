const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');

const app = express();
//importar rutas
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const clientesRoutes = require('./routes/clientes');


// Middlewares
app.use(cors());
app.use(express.json());
// Usar Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clientes', clientesRoutes);

// Ruta de prueba para verificar conexión con MySQL
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    res.json({ mensaje: 'Conexión a MySQL exitosa', resultado: rows[0].resultado });
  } catch (error) {
    console.error('Error al conectar con la BD:', error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
  
  // Probar conexión inicial al levantar el servidor
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado exitosamente a la base de datos MySQL');
    connection.release();
  } catch (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
  }
});
