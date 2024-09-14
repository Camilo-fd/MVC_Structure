const sessionExpirationMiddleware = (req, res, next) => {
  if (req.session && req.session.userName) {
    // La sesión existe y el usuario está autenticado
    if (req.session.cookie.maxAge <= 0) {
      // La sesión ha caducado
      req.session.destroy((err) => {
        if (err) {
          console.error('Error al destruir la sesión:', err);
        }
        return res.status(401).json({ message: "Sesión expirada. Por favor, inicie sesión nuevamente." });
      });
    } else {
      // La sesión es válida, permitir el acceso
      next();
    }
  } else {
    res.redirect("/");
  }
};

module.exports = sessionExpirationMiddleware;