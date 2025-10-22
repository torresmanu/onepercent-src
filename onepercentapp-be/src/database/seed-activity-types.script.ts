import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ActivityTypeService } from '../modules/activity-type/activity-type.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const activityTypeService = app.get(ActivityTypeService);

    const activityTypes = [
        // Cardio
        { title: 'Correr', description: 'Actividad cardiovascular de running', threshold: 60 },
        { title: 'Caminar', description: 'Caminata a paso moderado o rápido', threshold: 30 },
        { title: 'Bicicleta', description: 'Ciclismo en ruta o estacionario', threshold: 45 },
        { title: 'Natación', description: 'Natación en piscina o aguas abiertas', threshold: 45 },
        { title: 'Elíptica', description: 'Máquina elíptica', threshold: 30 },
        { title: 'Remo', description: 'Máquina de remo', threshold: 30 },
        { title: 'Senderismo', description: 'Caminata por montaña o naturaleza', threshold: 60 },
        { title: 'Trail Running', description: 'Correr por montaña o senderos', threshold: 60 },
        
        // Deportes de equipo
        { title: 'Fútbol', description: 'Fútbol 11 o fútbol sala', threshold: 45 },
        { title: 'Baloncesto', description: 'Básquetbol', threshold: 45 },
        { title: 'Tenis', description: 'Tenis individual o dobles', threshold: 45 },
        { title: 'Pádel', description: 'Pádel', threshold: 45 },
        { title: 'Voleibol', description: 'Voleibol', threshold: 45 },
        { title: 'Rugby', description: 'Rugby', threshold: 45 },
        
        // Fuerza y gimnasio
        { title: 'Gimnasio', description: 'Entrenamiento general en gimnasio', threshold: 45 },
        { title: 'Pesas', description: 'Entrenamiento con pesas', threshold: 45 },
        { title: 'CrossFit', description: 'Entrenamiento funcional de alta intensidad', threshold: 45 },
        { title: 'Calistenia', description: 'Ejercicios con peso corporal', threshold: 30 },
        { title: 'TRX', description: 'Entrenamiento en suspensión', threshold: 30 },
        
        // Flexibilidad y equilibrio
        { title: 'Yoga', description: 'Práctica de yoga', threshold: 45 },
        { title: 'Pilates', description: 'Método Pilates', threshold: 45 },
        { title: 'Estiramientos', description: 'Sesión de estiramientos', threshold: 20 },
        
        // Deportes de combate
        { title: 'Boxeo', description: 'Entrenamiento de boxeo', threshold: 45 },
        { title: 'Artes Marciales', description: 'Karate, judo, taekwondo, etc.', threshold: 45 },
        { title: 'Kickboxing', description: 'Kickboxing o muay thai', threshold: 45 },
        
        // Otros
        { title: 'Baile', description: 'Zumba, salsa, bachata, etc.', threshold: 45 },
        { title: 'Escalada', description: 'Escalada deportiva o boulder', threshold: 60 },
        { title: 'Golf', description: 'Golf', threshold: 120 },
        { title: 'Patinaje', description: 'Patinaje sobre ruedas o hielo', threshold: 30 },
        { title: 'Spinning', description: 'Clase de spinning', threshold: 45 },
    ];

    console.log('Starting activity types seeding...');
    
    for (const activityType of activityTypes) {
        const existing = await activityTypeService.findAll();
        const exists = existing.find(at => at.title === activityType.title);
        
        if (!exists) {
            await activityTypeService.create(activityType);
            console.log(`✓ Created: ${activityType.title}`);
        } else {
            console.log(`- Already exists: ${activityType.title}`);
        }
    }

    console.log('Activity types seeding completed!');
    await app.close();
}

bootstrap();
