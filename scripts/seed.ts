import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
    try {
        console.log("🌱 Iniciando población de la base de datos...");

        // Crear categorías específicas para programas técnicos
        const categories = [
            { name: "Técnico en Computación" },
            { name: "Técnico en Electrónica" },
            { name: "Técnico en Mecánica" },
            { name: "Técnico en Electricidad" },
            { name: "Técnico en Soldadura" },
            { name: "Técnico en Refrigeración" },
            { name: "Técnico en Automotriz" },
            { name: "Técnico en Construcción" }
        ];

        console.log("📚 Creando categorías técnicas...");
        for (const category of categories) {
            await database.category.upsert({
                where: { name: category.name },
                update: {},
                create: category
            });
        }

        console.log("✅ Categorías técnicas creadas exitosamente");

        // Obtener categorías creadas
        const computacionCategory = await database.category.findFirst({ where: { name: "Técnico en Computación" } });
        const electronicaCategory = await database.category.findFirst({ where: { name: "Técnico en Electrónica" } });
        const mecanicaCategory = await database.category.findFirst({ where: { name: "Técnico en Mecánica" } });
        const electricidadCategory = await database.category.findFirst({ where: { name: "Técnico en Electricidad" } });

        // Crear programas técnicos reales
        console.log("🎓 Creando programas técnicos...");
        
        const technicalPrograms = [
            {
                userId: "instructor_tech_1",
                title: "Técnico en Reparación de Computadoras",
                description: "Programa técnico de 18 meses para formar especialistas en diagnóstico, reparación y mantenimiento de equipos de cómputo. Incluye hardware, software y redes básicas.",
                imageUrl: "/programs/computacion.jpg",
                price: 0, // Sin precio para programas técnicos
                isPublished: true,
                categoryId: computacionCategory?.id,
                chapters: [
                    {
                        title: "Introducción a los Componentes de Hardware",
                        description: "Conoce los componentes básicos de una computadora: motherboard, procesador, memoria RAM, disco duro, fuente de poder. Aprende a identificar cada componente y su función específica en el sistema.",
                        videoUrl: "https://www.youtube.com/watch?v=hardware-basics",
                        position: 1,
                        isPublished: true,
                        isFree: true
                    },
                    {
                        title: "Herramientas y Técnicas de Diagnóstico",
                        description: "Manejo de herramientas básicas para diagnóstico: multímetro, destornilladores especializados, pulseras antiestáticas. Técnicas de diagnóstico paso a paso para identificar fallas comunes.",
                        videoUrl: "https://www.youtube.com/watch?v=diagnostic-tools",
                        position: 2,
                        isPublished: true,
                        isFree: true
                    },
                    {
                        title: "Instalación y Configuración de Sistemas Operativos",
                        description: "Proceso completo de instalación de Windows y Linux. Configuración básica, drivers, actualizaciones y optimización del sistema para mejor rendimiento.",
                        videoUrl: "https://www.youtube.com/watch?v=os-installation",
                        position: 3,
                        isPublished: true,
                        isFree: true
                    },
                    {
                        title: "Mantenimiento Preventivo y Correctivo",
                        description: "Rutinas de mantenimiento preventivo: limpieza interna, verificación de conexiones, monitoreo de temperaturas. Procedimientos de mantenimiento correctivo para fallas específicas.",
                        videoUrl: "https://www.youtube.com/watch?v=maintenance",
                        position: 4,
                        isPublished: true,
                        isFree: true
                    }
                ]
            },
            {
                userId: "instructor_tech_2",
                title: "Técnico en Electrónica Industrial",
                description: "Programa técnico especializado en electrónica aplicada a la industria. Duración de 18 meses con enfoque práctico en circuitos, automatización y control de procesos.",
                imageUrl: "/programs/electronica.jpg",
                price: 0,
                isPublished: true,
                categoryId: electronicaCategory?.id,
                chapters: [
                    {
                        title: "Fundamentos de Electricidad y Electrónica",
                        description: "Conceptos básicos de voltaje, corriente, resistencia y potencia. Ley de Ohm, circuitos serie y paralelo. Uso del multímetro y osciloscopio básico.",
                        videoUrl: "https://www.youtube.com/watch?v=electronics-basics",
                        position: 1,
                        isPublished: true,
                        isFree: true
                    },
                    {
                        title: "Componentes Electrónicos Pasivos y Activos",
                        description: "Resistencias, capacitores, inductores, diodos, transistores. Identificación, pruebas y aplicaciones prácticas de cada componente en circuitos reales.",
                        videoUrl: "https://www.youtube.com/watch?v=electronic-components",
                        position: 2,
                        isPublished: true,
                        isFree: true
                    },
                    {
                        title: "Circuitos Integrados y Microcontroladores",
                        description: "Introducción a los circuitos integrados. Conceptos básicos de microcontroladores, programación simple y aplicaciones en automatización industrial.",
                        videoUrl: "https://www.youtube.com/watch?v=microcontrollers",
                        position: 3,
                        isPublished: true,
                        isFree: true
                    }
                ]
            },
            {
                userId: "instructor_tech_3",
                title: "Técnico en Mecánica Automotriz",
                description: "Formación técnica integral en mecánica automotriz. Programa de 18 meses que cubre motor, transmisión, frenos, suspensión y sistemas eléctricos del automóvil.",
                imageUrl: "/programs/automotriz.jpg",
                price: 0,
                isPublished: true,
                categoryId: mecanicaCategory?.id,
                chapters: [
                    {
                        title: "Sistemas del Motor de Combustión Interna",
                        description: "Funcionamiento del motor de 4 tiempos, sistemas de lubricación, refrigeración y combustible. Diagnóstico básico de fallas comunes del motor.",
                        videoUrl: "https://www.youtube.com/watch?v=engine-systems",
                        position: 1,
                        isPublished: true,
                        isFree: true
                    },
                    {
                        title: "Sistema de Transmisión y Embrague",
                        description: "Funcionamiento de transmisiones manuales y automáticas. Diagnóstico y reparación del sistema de embrague. Mantenimiento preventivo de la transmisión.",
                        videoUrl: "https://www.youtube.com/watch?v=transmission",
                        position: 2,
                        isPublished: true,
                        isFree: true
                    }
                ]
            },
            {
                userId: "instructor_tech_4",
                title: "Técnico en Instalaciones Eléctricas",
                description: "Programa técnico para formar especialistas en instalaciones eléctricas residenciales e industriales. 18 meses de formación teórica y práctica con certificación.",
                imageUrl: "/programs/electricidad.jpg",
                price: 0,
                isPublished: true,
                categoryId: electricidadCategory?.id,
                chapters: [
                    {
                        title: "Fundamentos de Electricidad y Seguridad",
                        description: "Conceptos básicos de electricidad, voltaje, corriente alterna y continua. Normas de seguridad eléctrica, uso de EPP y procedimientos seguros de trabajo.",
                        videoUrl: "https://www.youtube.com/watch?v=electrical-safety",
                        position: 1,
                        isPublished: true,
                        isFree: true
                    },
                    {
                        title: "Instalaciones Eléctricas Residenciales",
                        description: "Diseño e instalación de circuitos residenciales. Cálculo de cargas, selección de conductores, instalación de tableros y protecciones eléctricas.",
                        videoUrl: "https://www.youtube.com/watch?v=residential-wiring",
                        position: 2,
                        isPublished: true,
                        isFree: true
                    },
                    {
                        title: "Motores Eléctricos y Control Industrial",
                        description: "Tipos de motores eléctricos, conexiones, arranque y control. Contactores, relés térmicos y sistemas básicos de automatización industrial.",
                        videoUrl: "https://www.youtube.com/watch?v=motor-control",
                        position: 3,
                        isPublished: true,
                        isFree: true
                    }
                ]
            }
        ];

        // Crear programas técnicos con sus clases
        for (const programData of technicalPrograms) {
            const { chapters, ...programInfo } = programData;
            
            console.log(`📖 Creando programa: ${programInfo.title}`);
            
            const program = await database.course.create({
                data: programInfo
            });

            // Crear clases semanales para cada programa
            if (chapters) {
                console.log(`  📝 Creando ${chapters.length} clases semanales...`);
                for (const chapterData of chapters) {
                    await database.chapter.create({
                        data: {
                            ...chapterData,
                            courseId: program.id
                        }
                    });
                }
            }

            // Crear material técnico de apoyo
            await database.attachment.create({
                data: {
                    name: `Manual técnico - ${programInfo.title}.pdf`,
                    url: `/attachments/manual-${program.id}.pdf`,
                    courseId: program.id
                }
            });

            await database.attachment.create({
                data: {
                    name: "Guía de prácticas de laboratorio.pdf",
                    url: `/attachments/practicas-${program.id}.pdf`,
                    courseId: program.id
                }
            });

            await database.attachment.create({
                data: {
                    name: "Normas de seguridad técnica.pdf",
                    url: `/attachments/seguridad-${program.id}.pdf`,
                    courseId: program.id
                }
            });
        }

        console.log("✅ Programas técnicos creados exitosamente");
        console.log("🎉 Base de datos poblada con contenido técnico real");
        
        // Mostrar resumen
        const totalPrograms = await database.course.count();
        const totalClasses = await database.chapter.count();
        const totalCategories = await database.category.count();
        
        console.log("\n📊 RESUMEN:");
        console.log(`   📚 Especialidades técnicas: ${totalCategories}`);
        console.log(`   🎓 Programas técnicos: ${totalPrograms}`);
        console.log(`   📝 Clases semanales: ${totalClasses}`);
        console.log("\n🏭 ¡Tu plataforma de formación técnica está lista!");
        
    } catch (error) {
        console.error("❌ Error poblando la base de datos:", error);
    } finally {
        await database.$disconnect();
    }
}

// Ejecutar la función main
main()
    .then(() => console.log("\n✨ Seeding técnico completado exitosamente"))
    .catch((e) => {
        console.error("💥 Error durante el seeding:", e);
        process.exit(1);
    });