import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addAuthorizedDocument() {
  try {
    const document = await prisma.authorizedDocument.create({
      data: {
        documentNumber: '1137061744',
        documentType: 'TI', // Tarjeta de Identidad
        fullName: 'Usuario de Prueba',
        email: 'usuario@ejemplo.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });

    console.log('✅ Documento autorizado creado exitosamente:');
    console.log(document);
  } catch (error) {
    console.error('❌ Error al crear el documento autorizado:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
addAuthorizedDocument();
