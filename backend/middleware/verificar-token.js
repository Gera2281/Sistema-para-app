const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.substring(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Se requiere iniciar sesión.' });
  }

  try {
    req.sesion = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Tu sesión expiró. Inicia sesión nuevamente.' });
  }
}

module.exports = verificarToken;
