export function timeProtection(req, res, next) {
  const lastTime = req.session.lastRequestTime || 0;
  const now = Date.now();
  const elapsed = now - lastTime;

  req.session.lastRequestTime = now;

  if (elapsed < 1000) {
    console.log("Acción sospechosa: solicitud demasiado rápida");
    return res.status(403).send("Acción sospechosa detectada.");
  }

  next();
}
