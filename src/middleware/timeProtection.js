// Almacén en memoria para rastrear peticiones por IP
const requestTracker = new Map();

export function timeProtection(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  const lastTime = requestTracker.get(clientIP) || 0;
  const now = Date.now();
  const elapsed = now - lastTime;

  // Actualizar tiempo de última petición para esta IP
  requestTracker.set(clientIP, now);

  // Limpiar entradas antiguas para evitar memory Leak 
  if (requestTracker.size > 1000) {
    const firstKey = requestTracker.keys().next().value;
    requestTracker.delete(firstKey);
  }

  if (elapsed < 1000) {
    console.log(`Acción sospechosa desde IP ${clientIP}: solicitud demasiado rápida (${elapsed}ms)`);
    return res.status(403).send("Acción sospechosa detectada.");
  }

  next();
}
