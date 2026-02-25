function verificarRol(rolPermitido) {
  return (req, res, next) => {
  
    if (!req.user || req.user.role !== rolPermitido) {
      return res.status(403).json({ 
        message: 'No autorizado', 
        detalles: `Se requiere rol ${rolPermitido} y recibimos ${req.user?.role}` 
      });
    }
    
    next();
  };
}

module.exports = verificarRol;