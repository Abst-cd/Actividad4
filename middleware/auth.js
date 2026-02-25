const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send('Acceso denegado: No hay header');
  }

  const token = authHeader.split(' ')[1] || authHeader;

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
        return res.status(403).json({error: 'token invalido'});
    }
    req.user = user;
    next();
  });
}

module.exports = autenticarToken;