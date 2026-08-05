
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sendPasswordResetEmail } = require('../auth');

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date(Date.now() + 3600000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' '); // MySQL DATETIME format

  try {
    const [result] = await db.query(
      'UPDATE usuarios SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE correo = ?',
      [token, expires, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No user with that email address.' });
    }

    sendPasswordResetEmail(email, token);
    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error on the server.' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const [users] = await db.query(
      'SELECT * FROM usuarios WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW()',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    const user = users[0];
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await db.query(
      'UPDATE usuarios SET contrasena = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
      [hash, user.id]
    );

    res.status(200).json({ message: 'Password has been updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error on the server.' });
  }
});

module.exports = router;
