const Usuario = require('../models/Usuario')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await Usuario.findOne({ username });

    if (user) {
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await Usuario.create({
        username,
        password: hashedPassword
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Acceso concedido',
      token,
      userId: user._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};
