// Controlador de autenticación
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Muestra el formulario de login
 */
export function showLogin(req, res) {
  res.render("login");
}

/**
 * Muestra el formulario de registro
 */
export function showRegister(req, res) {
  res.render("register");
}

/**
 * Registra un nuevo usuario en el sistema
 */
export async function registerUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).send("Email y contraseña son requeridos");
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Formato de email inválido");
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).send("La contraseña debe tener al menos 6 caracteres");
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).send("El email ya está registrado");
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "user" // Por defecto, los nuevos usuarios tienen rol "user"
      }
    });

    console.log(`Usuario registrado: ${email}`);
    
    // Redirigir al login
    res.redirect("/login");
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).send("Error al registrar usuario");
  }
}

/**
 * Autentica un usuario y crea su sesión
 */
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).send("Email y contraseña son requeridos");
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).send("Credenciales inválidas");
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).send("Credenciales inválidas");
    }

    // Crear sesión (no incluir password en la sesión)
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    console.log(`Usuario autenticado: ${email} (${user.role})`);

    // Redirigir según el rol
    if (user.role === "admin") {
      res.redirect("/admin");
    } else {
      res.redirect("/user");
    }
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).send("Error al iniciar sesión");
  }
}

/**
 * Cierra la sesión del usuario
 */
export function logoutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect("/login");
  });
}

/**
 * Muestra la página de usuario (requiere autenticación)
 */
export function userPage(req, res) {
  // Verificar si hay sesión activa
  if (!req.session.user) {
    return res.redirect("/login");
  }
  
  res.render("user", { user: req.session.user });
}
