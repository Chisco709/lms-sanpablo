const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addAuthorizedDocument() {
  try {
    console.log('🆔 Agregando documento autorizado...\n');

    // Documento autorizado
    const authorizedDocument = {
      documentNumber: '1137061744',
      documentType: 'TI', // Tarjeta de Identidad
      fullName: 'Estudiante Autorizado',
      isActive: true,
      notes: 'Documento agregado por solicitud del administrador'
    };

    console.log('📋 Datos del documento:');
    console.log(`   Número: ${authorizedDocument.documentNumber}`);
    console.log(`   Tipo: ${authorizedDocument.documentType}`);
    console.log(`   Nombre: ${authorizedDocument.fullName}`);
    console.log(`   Activo: ${authorizedDocument.isActive}`);
    console.log(`   Notas: ${authorizedDocument.notes}`);
    console.log('');

    // Verificar si ya existe
    const existing = await prisma.authorizedDocument.findUnique({
      where: {
        documentNumber: authorizedDocument.documentNumber
      }
    });

    if (existing) {
      console.log('⚠️  El documento ya existe en la base de datos:');
      console.log(`   ID: ${existing.id}`);
      console.log(`   Creado: ${existing.createdAt}`);
      console.log(`   Activo: ${existing.isActive}`);
      
      // Preguntar si actualizar
      console.log('\n¿Deseas actualizar el documento existente? (s/n)');
      // En un script automático, asumimos que sí
      console.log('Actualizando documento existente...');
      
      const updated = await prisma.authorizedDocument.update({
        where: {
          documentNumber: authorizedDocument.documentNumber
        },
        data: {
          fullName: authorizedDocument.fullName,
          isActive: authorizedDocument.isActive,
          notes: authorizedDocument.notes,
          updatedAt: new Date()
        }
      });
      
      console.log('✅ Documento actualizado exitosamente');
      console.log(`   ID: ${updated.id}`);
      console.log(`   Actualizado: ${updated.updatedAt}`);
    } else {
      // Crear nuevo documento
      const created = await prisma.authorizedDocument.create({
        data: authorizedDocument
      });
      
      console.log('✅ Documento autorizado creado exitosamente');
      console.log(`   ID: ${created.id}`);
      console.log(`   Creado: ${created.createdAt}`);
    }

    // Mostrar todos los documentos autorizados
    console.log('\n📊 Documentos autorizados en la base de datos:');
    const allDocuments = await prisma.authorizedDocument.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (allDocuments.length === 0) {
      console.log('   No hay documentos autorizados');
    } else {
      allDocuments.forEach((doc, index) => {
        console.log(`   ${index + 1}. ${doc.documentType}: ${doc.documentNumber}`);
        console.log(`      Nombre: ${doc.fullName}`);
        console.log(`      Activo: ${doc.isActive}`);
        console.log(`      Creado: ${doc.createdAt}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error agregando documento autorizado:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
addAuthorizedDocument(); 