// Controlador de autenticación (pendiente de implementar)

export function showLogin(req, res) {
  res.render("login");
}

export function showRegister(req, res) {
  res.render("register");
}

export function registerUser(req, res) {
  // Lógica de registro pendiente
  res.send("Registro pendiente de implementar");
}

export function loginUser(req, res) {
  // Lógica de login pendiente
  res.send("Login pendiente de implementar");
}

export function logoutUser(req, res) {
  req.session.destroy();
  res.redirect("/login");
}

export function userPage(req, res) {
  res.render("user");
}
