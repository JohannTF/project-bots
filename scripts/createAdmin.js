// Script para crear un usuario administrador
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = "admin@ejemplo.com";
    const password = "admin123";

    // Verificar si ya existe
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log("❌ El usuario administrador ya existe");
      console.log(`Email: ${email}`);
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear administrador
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "admin"
      }
    });

    console.log("✅ Usuario administrador creado exitosamente");
    console.log(`Email: ${email}`);
    console.log(`Contraseña: ${password}`);
    console.log(`ID: ${admin.id}`);
  } catch (error) {
    console.error("Error al crear administrador:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
