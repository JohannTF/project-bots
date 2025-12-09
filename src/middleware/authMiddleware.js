// Middleware de autenticación y autorización

/**
 * Verifica si el usuario está autenticado
 * Comprueba si existe una sesión activa con usuario
 */
export function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    console.log("Acceso denegado: usuario no autenticado");
    return res.redirect("/login");
  }
  next();
}

/**
 * Verifica si el usuario tiene rol de administrador
 * Debe usarse después de isAuthenticated
 */
export function isAdmin(req, res, next) {
  if (req.session.user.role !== "admin") {
    console.log("Acceso denegado: se requieren permisos de administrador");
    return res.status(403).send("Acceso prohibido: Se requieren permisos de administrador");
  }
  next();
}
