// Controlador de administración
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Muestra el panel de administración con la lista de usuarios
 */
export async function adminPage(req, res) {
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Renderizar la vista admin pasando la lista de usuarios
    res.render("admin", { 
      users,
      currentUser: req.session.user 
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send("Error al cargar el panel de administración");
  }
}
