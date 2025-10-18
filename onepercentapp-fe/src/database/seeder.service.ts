import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {Role} from "../modules/user/entities/role.entity";
import {User} from "../modules/user/entities/user.entity";
import {ActivityCategoryService} from "../modules/activity-category/activity-category.service";
import {LicenseService} from "../modules/license/license.service";
import {TargetService} from "../modules/target/target.service";
import {PlanService} from "../modules/plan/plan.service";
import {ActiveData} from "../modules/plan/entities/activeData.entity";
import {WorkoutWeek} from "../modules/plan/entities/workoutWeek.entity";
import {HydrationDay} from "../modules/plan/entities/hydrationDay.entity";
import {LunchDay} from "../modules/plan/entities/lunchDay.entity";
import {VegetablesAndFruits} from "../modules/plan/entities/vegetablesAndFruits.entity";
import {CardiovascularLevel} from "../modules/plan/entities/cardiovascularLevel";
import {Allergy} from "../modules/plan/entities/allergy";
import {Intolerance} from "../modules/plan/entities/intolerance";
import {NutritionPreference} from "../modules/plan/entities/nutritionPreference";
import {ProvinceService} from "../modules/province/province.service";
import {ActivityTypeService} from "../modules/activity-type/activity-type.service";
import {RecipeAllergenService} from "../modules/recipe-allergen/recipe-allergen.service";
import {IngredientService} from "../modules/ingredient/ingredient.service";

import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import {Ingredient} from "../modules/ingredient/entities/ingredient.entity";
import {ActivityIntensityService} from "../modules/activity-intensity/activity-intensity.service";

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly activityCategoryService: ActivityCategoryService,
        private readonly licenseService: LicenseService,
        private readonly targetService: TargetService,
        private readonly planService: PlanService,
        private readonly provinceService: ProvinceService,
        private readonly activityTypeService: ActivityTypeService,
        private readonly receipeAllergenService: RecipeAllergenService,
        private readonly ingredientService: IngredientService,
        private readonly activityIntensityService: ActivityIntensityService
    ) {}

    async onModuleInit() {
        // Seeder desactivado - usando dump.sql en su lugar
        console.log('Seeder desactivado - usando datos del dump.sql');
        return;

        // Gender
        await this.planService.setGender('Male');
        await this.planService.setGender('Female');
        await this.planService.setGender('Non-binary');
        await this.planService.setGender('Prefer not to say');

        // Referral
        await this.planService.setReferral('Podcast');
        await this.planService.setReferral('Newsletter (web or physical)');
        await this.planService.setReferral('Internet ads');
        await this.planService.setReferral('Influencer');
        await this.planService.setReferral('Friends and family');
        await this.planService.setReferral('Healthcare professional');
        await this.planService.setReferral('App store or Google Play');
        await this.planService.setReferral('Other');

        // Provinces
        await this.provinceService.findOrCreate({name: 'Álava/Araba'}, {id: 1, name: 'Álava/Araba'});
        await this.provinceService.findOrCreate({name: 'Albacete'}, {id: 2, name: 'Albacete'});
        await this.provinceService.findOrCreate({name: 'Alicante/Alacant'}, {id: 3, name: 'Alicante/Alacant'});
        await this.provinceService.findOrCreate({name: 'Almería'}, {id: 4, name: 'Almería'});
        await this.provinceService.findOrCreate({name: 'Asturias'}, {id: 5, name: 'Asturias'});
        await this.provinceService.findOrCreate({name: 'Ávila'}, {id: 6, name: 'Ávila'});
        await this.provinceService.findOrCreate({name: 'Badajoz'}, {id: 7, name: 'Badajoz'});
        await this.provinceService.findOrCreate({name: 'Balears, Illes'}, {id: 8, name: 'Balears, Illes'});
        await this.provinceService.findOrCreate({name: 'Barcelona'}, {id: 9, name: 'Barcelona'});
        await this.provinceService.findOrCreate({name: 'Bizkaia'}, {id: 10, name: 'Bizkaia'});
        await this.provinceService.findOrCreate({name: 'Burgos'}, {id: 11, name: 'Burgos'});
        await this.provinceService.findOrCreate({name: 'Cantabria'}, {id: 12, name: 'Cantabria'});
        await this.provinceService.findOrCreate({name: 'Castellón/Castelló'}, {id: 13, name: 'Castellón/Castelló'});
        await this.provinceService.findOrCreate({name: 'Ceuta'}, {id: 14, name: 'Ceuta'});
        await this.provinceService.findOrCreate({name: 'Ciudad Real'}, {id: 15, name: 'Ciudad Real'});
        await this.provinceService.findOrCreate({name: 'Coruña, A'}, {id: 16, name: 'Coruña, A'});
        await this.provinceService.findOrCreate({name: 'Cuenca'}, {id: 17, name: 'Cuenca'});
        await this.provinceService.findOrCreate({name: 'Cáceres'}, {id: 18, name: 'Cáceres'});
        await this.provinceService.findOrCreate({name: 'Cádiz'}, {id: 19, name: 'Cádiz'});
        await this.provinceService.findOrCreate({name: 'Córdoba'}, {id: 20, name: 'Córdoba'});
        await this.provinceService.findOrCreate({name: 'Gipuzkoa'}, {id: 21, name: 'Gipuzkoa'});
        await this.provinceService.findOrCreate({name: 'Girona'}, {id: 22, name: 'Girona'});
        await this.provinceService.findOrCreate({name: 'Granada'}, {id: 23, name: 'Granada'});
        await this.provinceService.findOrCreate({name: 'Guadalajara'}, {id: 24, name: 'Guadalajara'});
        await this.provinceService.findOrCreate({name: 'Huelva'}, {id: 25, name: 'Huelva'});
        await this.provinceService.findOrCreate({name: 'Huesca'}, {id: 26, name: 'Huesca'});
        await this.provinceService.findOrCreate({name: 'Jaén'}, {id: 27, name: 'Jaén'});
        await this.provinceService.findOrCreate({name: 'La Rioja'}, {id: 28, name: 'La Rioja'});
        await this.provinceService.findOrCreate({name: 'Las Palmas'}, {id: 29, name: 'Las Palmas'});
        await this.provinceService.findOrCreate({name: 'León'}, {id: 30, name: 'León'});
        await this.provinceService.findOrCreate({name: 'Lleida'}, {id: 31, name: 'Lleida'});
        await this.provinceService.findOrCreate({name: 'Lugo'}, {id: 32, name: 'Lugo'});
        await this.provinceService.findOrCreate({name: 'Madrid'}, {id: 33, name: 'Madrid'});
        await this.provinceService.findOrCreate({name: 'Melilla'}, {id: 34, name: 'Melilla'});
        await this.provinceService.findOrCreate({name: 'Murcia'}, {id: 35, name: 'Murcia'});
        await this.provinceService.findOrCreate({name: 'Málaga'}, {id: 36, name: 'Málaga'});
        await this.provinceService.findOrCreate({name: 'Navarra'}, {id: 37, name: 'Navarra'});
        await this.provinceService.findOrCreate({name: 'Ourense'}, {id: 38, name: 'Ourense'});
        await this.provinceService.findOrCreate({name: 'Palencia'}, {id: 39, name: 'Palencia'});
        await this.provinceService.findOrCreate({name: 'Pontevedra'}, {id: 40, name: 'Pontevedra'});
        await this.provinceService.findOrCreate({name: 'Salamanca'}, {id: 41, name: 'Salamanca'});
        await this.provinceService.findOrCreate({name: 'Santa Cruz de Tenerife'}, {id: 42, name: 'Santa Cruz de Tenerife'});
        await this.provinceService.findOrCreate({name: 'Segovia'}, {id: 43, name: 'Segovia'});
        await this.provinceService.findOrCreate({name: 'Sevilla'}, {id: 44, name: 'Sevilla'});
        await this.provinceService.findOrCreate({name: 'Soria'}, {id: 45, name: 'Soria'});
        await this.provinceService.findOrCreate({name: 'Tarragona'}, {id: 46, name: 'Tarragona'});
        await this.provinceService.findOrCreate({name: 'Teruel'}, {id: 47, name: 'Teruel'});
        await this.provinceService.findOrCreate({name: 'Toledo'}, {id: 48, name: 'Toledo'});
        await this.provinceService.findOrCreate({name: 'Valencia/València'}, {id: 49, name: 'Valencia/València'});
        await this.provinceService.findOrCreate({name: 'Valladolid'}, {id: 50, name: 'Valladolid'});
        await this.provinceService.findOrCreate({name: 'Zamora'}, {id: 51, name: 'Zamora'});
        await this.provinceService.findOrCreate({name: 'Zaragoza'}, {id: 52, name: 'Zaragoza'});

        // Activity Types
        await this.activityTypeService.findOrCreate({ title: 'Aquagym' }, { id: 1, title: 'Aquagym', description: 'Aquagym', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Artes marciales (boxeo, etc.)' }, { id: 2, title: 'Artes marciales (boxeo, etc.)', description: 'Artes marciales (boxeo, etc.)', threshold: 5 });
        await this.activityTypeService.findOrCreate({ title: 'Bádminton' }, { id: 3, title: 'Bádminton', description: 'Bádminton', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'Baile (zumba/salsa)' }, { id: 4, title: 'Baile (zumba/salsa)', description: 'Baile (zumba/salsa)', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Baloncesto' }, { id: 5, title: 'Baloncesto', description: 'Baloncesto', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Bicicleta estática (intensa)' }, { id: 6, title: 'Bicicleta estática (intensa)', description: 'Bicicleta estática (intensa)', threshold: 5 });
        await this.activityTypeService.findOrCreate({ title: 'Bicicleta estática (moderada)' }, { id: 7, title: 'Bicicleta estática (moderada)', description: 'Bicicleta estática (moderada)', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'Ciclismo (moderado, 16–19 km/h)' }, { id: 8, title: 'Ciclismo (moderado, 16–19 km/h)', description: 'Ciclismo (moderado, 16–19 km/h)', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'Ciclismo (rápido, >20 km/h)' }, { id: 9, title: 'Ciclismo (rápido, >20 km/h)', description: 'Ciclismo (rápido, >20 km/h)', threshold: 5 });
        await this.activityTypeService.findOrCreate({ title: 'Ciclismo de montaña' }, { id: 10, title: 'Ciclismo de montaña', description: 'Ciclismo de montaña', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'Calistenia' }, { id: 11, title: 'Calistenia', description: 'Calistenia', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'Caminar (normal, 4–5 km/h)' }, { id: 12, title: 'Caminar (normal, 4–5 km/h)', description: 'Caminar (normal, 4–5 km/h)', threshold: 8 });
        await this.activityTypeService.findOrCreate({ title: 'Caminar rápido (6 km/h)' }, { id: 13, title: 'Caminar rápido (6 km/h)', description: 'Caminar rápido (6 km/h)', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'CrossFit / funcional' }, { id: 14, title: 'CrossFit / funcional', description: 'CrossFit / funcional', threshold: 5 });
        await this.activityTypeService.findOrCreate({ title: 'Correr (10 km/h)' }, { id: 15, title: 'Correr (10 km/h)', description: 'Correr (10 km/h)', threshold: 5 });
        await this.activityTypeService.findOrCreate({ title: 'Correr (trote, 8 km/h)' }, { id: 16, title: 'Correr (trote, 8 km/h)', description: 'Correr (trote, 8 km/h)', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'Elíptica' }, { id: 17, title: 'Elíptica', description: 'Elíptica', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Entrenamiento con pesas' }, { id: 18, title: 'Entrenamiento con pesas', description: 'Entrenamiento con pesas', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Escalada' }, { id: 19, title: 'Escalada', description: 'Escalada', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'Estiramientos / movilidad' }, { id: 20, title: 'Estiramientos / movilidad', description: 'Estiramientos / movilidad', threshold: 9 });
        await this.activityTypeService.findOrCreate({ title: 'Fútbol' }, { id: 21, title: 'Fútbol', description: 'Fútbol', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'HIIT' }, { id: 22, title: 'HIIT', description: 'HIIT', threshold: 5 });
        await this.activityTypeService.findOrCreate({ title: 'Máquinas de gimnasio' }, { id: 23, title: 'Máquinas de gimnasio', description: 'Máquinas de gimnasio', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Nadar (intenso)' }, { id: 24, title: 'Nadar (intenso)', description: 'Nadar (intenso)', threshold: 5 });
        await this.activityTypeService.findOrCreate({ title: 'Nadar (recreativo)' }, { id: 25, title: 'Nadar (recreativo)', description: 'Nadar (recreativo)', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Paddle surf' }, { id: 26, title: 'Paddle surf', description: 'Paddle surf', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Patinaje' }, { id: 27, title: 'Patinaje', description: 'Patinaje', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'Remo (máquina)' }, { id: 28, title: 'Remo (máquina)', description: 'Remo (máquina)', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'Pilates (intenso)' }, { id: 29, title: 'Pilates (intenso)', description: 'Pilates (intenso)', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Pilates (suave)' }, { id: 30, title: 'Pilates (suave)', description: 'Pilates (suave)', threshold: 8 });
        await this.activityTypeService.findOrCreate({ title: 'Pádel' }, { id: 31, title: 'Pádel', description: 'Pádel', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Saltar la cuerda' }, { id: 32, title: 'Saltar la cuerda', description: 'Saltar la cuerda', threshold: 4 });
        await this.activityTypeService.findOrCreate({ title: 'Senderismo' }, { id: 33, title: 'Senderismo', description: 'Senderismo', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'TRX' }, { id: 34, title: 'TRX', description: 'TRX', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Tenis' }, { id: 35, title: 'Tenis', description: 'Tenis', threshold: 6 });
        await this.activityTypeService.findOrCreate({ title: 'Vóley' }, { id: 36, title: 'Vóley', description: 'Vóley', threshold: 8 });
        await this.activityTypeService.findOrCreate({ title: 'Yoga (suave)' }, { id: 37, title: 'Yoga (suave)', description: 'Yoga (suave)', threshold: 9 });
        await this.activityTypeService.findOrCreate({ title: 'Yoga (vinyasa/power)' }, { id: 38, title: 'Yoga (vinyasa/power)', description: 'Yoga (vinyasa/power)', threshold: 7 });
        await this.activityTypeService.findOrCreate({ title: 'Trail running' }, { id: 39, title: 'Trail running', description: 'Trail running', threshold: 5 });

        // Recipe Allergens
        await this.receipeAllergenService.findOrCreate({name: 'Altramuces'}, {id: 1, name: 'Altramuces'});
        await this.receipeAllergenService.findOrCreate({name: 'Apio'}, {id: 2, name: 'Apio'});
        await this.receipeAllergenService.findOrCreate({name: 'Cacahuetes'}, {id: 3, name: 'Cacahuetes'});
        await this.receipeAllergenService.findOrCreate({name: 'Cereales que contengan gluten'}, {id: 4, name: 'Cereales que contengan gluten'});
        await this.receipeAllergenService.findOrCreate({name: 'Crustáceos'}, {id: 5, name: 'Crustáceos'});
        await this.receipeAllergenService.findOrCreate({name: 'Frutos secos'}, {id: 6, name: 'Frutos secos'});
        await this.receipeAllergenService.findOrCreate({name: 'Huevos'}, {id: 7, name: 'Huevos'});
        await this.receipeAllergenService.findOrCreate({name: 'Leche y derivados'}, {id: 8, name: 'Leche y derivados'});
        await this.receipeAllergenService.findOrCreate({name: 'Moluscos'}, {id: 9, name: 'Moluscos'});
        await this.receipeAllergenService.findOrCreate({name: 'Mostaza'}, {id: 10, name: 'Mostaza'});
        await this.receipeAllergenService.findOrCreate({name: 'Pescado'}, {id: 11, name: 'Pescado'});
        await this.receipeAllergenService.findOrCreate({name: 'Pescados'}, {id: 12, name: 'Pescados'});
        await this.receipeAllergenService.findOrCreate({name: 'Soja'}, {id: 13, name: 'Soja'});
        await this.receipeAllergenService.findOrCreate({name: 'Sulfitos'}, {id: 14, name: 'Sulfitos'});
        await this.receipeAllergenService.findOrCreate({name: 'Sésamo'}, {id: 15, name: 'Sésamo'});

        // Crear roles si no existen
        const roles = ['admin', 'user'];
        let i = 1;
        for (const roleName of roles) {
            const role = await this.roleRepository.findOne({where: {name: roleName}});
            if (!role) {
                await this.roleRepository.save({id: i, name: roleName});
                console.log(`[${i}] Rol '${roleName}' creado.`);
                i++;
            }
        }

        // Crear un usuario de prueba (admin) si no existe
        const adminRole = await this.roleRepository.findOne({where: {name: 'admin'}});
        if (!adminRole) {
            console.error('El rol de administrador no existe.');
            return;
        }
        const existingUser = await this.userRepository.findOne({where: {email: 'habilidosos@armadilloamarillo.com'}});

        if (!existingUser && adminRole) {
            const hashedPassword = await bcrypt.hash('12341234Aa', 10); // Asegúrate de usar un hash de contraseña adecuado
            await this.userRepository.save({
                email: 'habilidosos@armadilloamarillo.com',
                password: hashedPassword,
                firstname: 'Habilidosos',
                lastname: 'Armadillos',
                roleId: adminRole!.id, // Non-null assertion since we checked above
                province: {id: 33}, // Madrid
                validatedEmail: '2024-01-01 00:00:00'
            });
            console.log('Usuario de prueba admin creado.');
        }


        //     Activity Category
        await this.activityCategoryService.findOrCreate({title: 'Tranquility breath'}, {id: 1, title: 'Tranquility breath'});
        await this.activityCategoryService.findOrCreate({title: 'Normal Pace'}, {id: 2, title: 'Normal Pace'});
        await this.activityCategoryService.findOrCreate({title: 'Explosive power'}, {id: 3, title: 'Explosive power'});

        // Activity Intensity
        await this.activityIntensityService.findOrCreate({title: 'Low'}, {id: 1, title: 'Low', description: 'Low intensity activity'});
        await this.activityIntensityService.findOrCreate({title: 'Medium'}, {id: 2, title: 'Medium', description: 'Medium intensity activity'});
        await this.activityIntensityService.findOrCreate({title: 'High'}, {id: 3, title: 'High', description: 'High intensity activity'});

        // Licenses
        await this.licenseService.findOrCreate({title: 'monthly'}, {id: 1, title: 'monthly', description: 'monthly', price: 8.99, googleProductId: '', appleProductId: 'prod1ac0e0b4a7'});
        await this.licenseService.findOrCreate({title: '6-months'}, {id: 2, title: '6-months', description: '6-months', price: 6.99, googleProductId: '', appleProductId: 'proda4b8e3930b'});
        await this.licenseService.findOrCreate({title: '12-months'}, {id: 3, title: '12-months', description: '12-months', price: 4.99, googleProductId: '', appleProductId: 'prod4173b4110d'});
        await this.licenseService.findOrCreate({title: 'basic'}, {id: 4, title: 'basic', description: 'basic', price: 0, googleProductId: '', appleProductId: ''});

        // Targets
        await this.targetService.findOrCreate({title: 'Steps'}, {id: 1, title: 'Steps', description: 'Diary steps'});
        await this.targetService.findOrCreate({title: 'Workouts'}, {id: 2, title: 'Workouts', description: 'Workouts'});
        await this.targetService.findOrCreate({title: 'Hydration'}, {id: 3, title: 'Hydration', description: 'Hydration'});
        await this.targetService.findOrCreate({title: 'Nutrition'}, {id: 4, title: 'Nutrition', description: 'Nutrition'});
        await this.targetService.findOrCreate({title: 'Fruits and Vegetables'}, {id: 5, title: 'Fruits and Vegetables', description: 'Fruits and Vegetables'});

        // Active Data
        const lessActiveData = new ActiveData();
        lessActiveData.title = 'Poco activo';
        lessActiveData.description = 'No más de 5.000 pasos al día, unos 30 minutos de paseo (trabajar desde casa o sentado, pocos desplazamientos...)';
        await this.planService.setActiveData(lessActiveData);

        const moderateActiveData = new ActiveData();
        moderateActiveData.title = 'Moderadamente activo';
        moderateActiveData.description = 'Un máximo de 10.000 pasos diarios (varios desplazamientos durante el día, estar de pie en varios momentos...)';
        await this.planService.setActiveData(moderateActiveData);

        const veryActiveData = new ActiveData();
        veryActiveData.title = 'Muy activo';
        veryActiveData.description = 'Más de 10.000 pasos diarios (rutina movida, mucho tiempo desplazándose, poco tiempo sentado...)';
        await this.planService.setActiveData(veryActiveData);

        // Workout    Weeks
        // const nonSessions = new WorkoutWeek();
        // nonSessions.title = '0 sesiones a la semana';
        // await this.planService.setWorkoutWeekData(nonSessions);
        //
        // const oneToThree = new WorkoutWeek();
        // oneToThree.title = 'De 1 a 3 sesiones a la semana';
        // await this.planService.setWorkoutWeekData(oneToThree);
        //
        // const fourToFive = new WorkoutWeek();
        // fourToFive.title = 'De 4 a 5 sesiones a la semana';
        // await this.planService.setWorkoutWeekData(fourToFive);
        //
        // const moreFive = new WorkoutWeek();
        // moreFive.title = 'Más de 5 sesiones a la semana';
        // await this.planService.setWorkoutWeekData(moreFive);

        const nonToOne = new WorkoutWeek();
        nonToOne.title = '0 - 1 sesiones / semana';
        nonToOne.factor = 1.2;
        await this.planService.setWorkoutWeekData(nonToOne);

        const twoToThree = new WorkoutWeek();
        twoToThree.title = '2 - 3 sesiones / semana';
        twoToThree.factor = 1.375;
        await this.planService.setWorkoutWeekData(twoToThree);

        const fourFive = new WorkoutWeek();
        fourFive.title = '4 - 5 sesiones / semana';
        fourFive.factor = 1.55;
        await this.planService.setWorkoutWeekData(fourFive);

        const moreThanSix = new WorkoutWeek();
        moreThanSix.title = '6 o + sesiones / semana';
        moreThanSix.factor = 1.725;
        await this.planService.setWorkoutWeekData(moreThanSix);

        // Hydration
        const hydrationLess = new HydrationDay();
        hydrationLess.title = 'Menos de media botella al día';
        hydrationLess.description = 'Menos de un litro';
        await this.planService.setHydrationData(hydrationLess);

        const hydrationModerate = new HydrationDay();
        hydrationModerate.title = 'Una botella al día';
        hydrationModerate.description = 'Litro y medio';
        await this.planService.setHydrationData(hydrationModerate);

        const hydrationMore = new HydrationDay();
        hydrationMore.title = 'Más de una botella al día';
        hydrationMore.description = 'Dos litros o más';
        await this.planService.setHydrationData(hydrationMore);

        // Lunch
        const lunchLess = new LunchDay();
        lunchLess.title = '2 veces máximo';
        await this.planService.setLunchData(lunchLess);

        const lunchModerate = new LunchDay();
        lunchModerate.title = 'Entre 3 y 4 veces';
        await this.planService.setLunchData(lunchModerate);

        const lunchMore = new LunchDay();
        lunchMore.title = '5 o más veces';
        await this.planService.setLunchData(lunchMore);

        // Vegetables  and Fruits
        const vegetablesAndFruitsLess = new VegetablesAndFruits();
        vegetablesAndFruitsLess.title = 'Cómo mucho 1 porción al día';
        await this.planService.setVegetablesAndFruitsData(vegetablesAndFruitsLess);

        const vegetablesAndFruitsModerate = new VegetablesAndFruits();
        vegetablesAndFruitsModerate.title = '2 - 3 porciones al día';
        await this.planService.setVegetablesAndFruitsData(vegetablesAndFruitsModerate);

        const vegetablesAndFruitsMore = new VegetablesAndFruits();
        vegetablesAndFruitsMore.title = 'Más de 4 porciones al día';
        await this.planService.setVegetablesAndFruitsData(vegetablesAndFruitsMore);

        // Cardiovascular Level
        const none = new CardiovascularLevel();
        none.title = 'Ninguno';
        none.description = 'Actualmente no practico ningún deporte así';
        await this.planService.setCardiovascularLevelData(none);

        const beginner = new CardiovascularLevel();
        beginner.title = 'Principiante';
        beginner.description = 'Llevo practicando menos de 1 año';
        await this.planService.setCardiovascularLevelData(beginner);

        const intermediate = new CardiovascularLevel();
        intermediate.title = 'Intermedio';
        intermediate.description = 'Llevo practicando más de 1 año, pero menos de 4.';
        await this.planService.setCardiovascularLevelData(intermediate);

        const advanced = new CardiovascularLevel();
        advanced.title = 'Avanzado';
        advanced.description = 'Llevo practicando más de 4 años.';
        await this.planService.setCardiovascularLevelData(advanced);


        // Allergies
        const noneAllergy = new Allergy();
        noneAllergy.title = 'Ninguna';
        await this.planService.setAllergyData(noneAllergy);

        const cereals = new Allergy();
        cereals.title = 'Cereales que contengan gluten';
        await this.planService.setAllergyData(cereals);

        const milk = new Allergy();
        milk.title = 'Leche y derivados';
        await this.planService.setAllergyData(milk);

        const soya = new Allergy();
        soya.title = 'Soja';
        await this.planService.setAllergyData(soya);

        const crustaceans = new Allergy();
        crustaceans.title = 'Crustáceos';
        await this.planService.setAllergyData(crustaceans);

        const molluscs = new Allergy();
        molluscs.title = 'Moluscos';
        await this.planService.setAllergyData(molluscs);

        const eggs = new Allergy();
        eggs.title = 'Huevos';
        await this.planService.setAllergyData(eggs);

        const peanuts = new Allergy();
        peanuts.title = 'Cacahuetes';
        await this.planService.setAllergyData(peanuts);

        const apium = new Allergy();
        apium.title = 'Apio';
        await this.planService.setAllergyData(apium);

        const mustard = new Allergy();
        mustard.title = 'Mostaza';
        await this.planService.setAllergyData(mustard);

        const sesame = new Allergy();
        sesame.title = 'Sésamo';
        await this.planService.setAllergyData(sesame);

        const altramuce = new Allergy();
        altramuce.title = 'Altramuces';
        await this.planService.setAllergyData(altramuce);

        const sulfites = new Allergy();
        sulfites.title = 'Sulfitos';
        await this.planService.setAllergyData(sulfites);

        // Intolerances
        const gluten = new Intolerance();
        gluten.title = 'Gluten';
        await this.planService.setIntoleranceData(gluten);

        const lactose = new Intolerance();
        lactose.title = 'Lactosa';
        await this.planService.setIntoleranceData(lactose);

        const sorbitol = new Intolerance();
        sorbitol.title = 'Sorbital';
        await this.planService.setIntoleranceData(sorbitol);

        const additives = new Intolerance();
        additives.title = 'Aditivos';
        await this.planService.setIntoleranceData(additives);

        const fructose = new Intolerance();
        fructose.title = 'Fructosa';
        await this.planService.setIntoleranceData(fructose);

        const caffeine = new Intolerance();
        caffeine.title = 'Cafeína';
        await this.planService.setIntoleranceData(caffeine);

        // Nutrition preferences
        const noneNutritionPreference = new NutritionPreference();
        noneNutritionPreference.title = 'No tengo ninguna preferencia';
        await this.planService.setNutritionPreferenceData(noneNutritionPreference);

        const fish = new NutritionPreference();
        fish.title = 'Soy pescetariano';
        await this.planService.setNutritionPreferenceData(fish);

        const vegetarian = new NutritionPreference();
        vegetarian.title = 'Soy vegetariano';
        await this.planService.setNutritionPreferenceData(vegetarian);

        const withoutGluten = new NutritionPreference();
        withoutGluten.title = 'Sigo una dieta sin gluten';
        await this.planService.setNutritionPreferenceData(withoutGluten);



        //     INGREDIENTS
        await this.ingredientService.createIngredientGroup(1, "entrantes y platos preparados");
        await this.ingredientService.createIngredientGroup(2, "frutas, verduras, legumbres y frutos secos");
        await this.ingredientService.createIngredientGroup(3, "productos de cereales");
        await this.ingredientService.createIngredientGroup(4, "carne, huevos y pescado");
        await this.ingredientService.createIngredientGroup(5, "leche y productos lácteos");
        await this.ingredientService.createIngredientGroup(6, "bebidas");
        await this.ingredientService.createIngredientGroup(7, "azúcar y productos de confitería");
        await this.ingredientService.createIngredientGroup(8, "helados y sorbetes");
        await this.ingredientService.createIngredientGroup(9, "grasas y aceites");
        await this.ingredientService.createIngredientGroup(10, "varios");
        await this.ingredientService.createIngredientGroup(11, "alimentos para bebés");

        // Import ingredients from CSV
        if (this.parseBool(process.env.IMPORT_CSV_INGREDIENTS || 'false')) {
            await this.manageIngredients();
        }

    }
    
    parseBool(value: string): boolean {
        return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
    }


    async manageIngredients() {
        // Read ingredientes file (CSV) from ./csv folder
        const results: any = [];
        const filePath = path.join(__dirname, 'csv', 'ingredients.csv');

        // Read each file and create ingredients via IngredientService
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('data', (data: any) => results.push(data))
            .on('end', async () => {
                for (const row of results) {
                    console.log("ROW:", row);
                    const code = row['code'];
                    const name = row['name'];
                    const name_en = row['name_en'];
                    const energy = parseFloat(row['energy'].replace(',', '.')) || 0;
                    const protein = parseFloat(row['protein'].replace(',', '.')) || 0;
                    const carbs = parseFloat(row['carbs'].replace(',', '.')) || 0;
                    const fat = parseFloat(row['fat'].replace(',', '.')) || 0;
                    const saturatedFat = parseFloat(row['saturatedFat'].replace(',', '.')) || 0;
                    const nonSaturatedFat = parseFloat(row['nonSaturatedFat'].replace(',', '.')) || 0;
                    const sugar = parseFloat(row['sugar'].replace(',', '.')) || 0;
                    const fiber = parseFloat(row['fiber'].replace(',', '.')) || 0;
                    const cholesterol = parseFloat(row['cholesterol'].replace(',', '.')) || 0;
                    const potassium = parseFloat(row['potassium'].replace(',', '.')) || 0;
                    const sodium = parseFloat(row['sodium'].replace(',', '.')) || 0;
                    const salt = parseFloat(row['salt'].replace(',', '.')) || 0;
                    const fresh = this.parseBool(row['fresh']) || false;

                    // Check if ingredient already exists
                    const existingIngredient = await this.ingredientService.findByCode(code);

                    // Check allergens
                    const allergensIds = JSON.parse(row['allergens']) || [];
                    console.log("Allergens IDs:", allergensIds);
                    let allergies = await this.ingredientService.findAllergensByIds(allergensIds);
                    // if (allergies.length > 0) {
                    //     allergies = allergies.map((a: any) => a.id);
                    // }

                    const ingredientData: any = {
                        code,
                        name,
                        name_en,
                        energy,
                        protein,
                        carbs,
                        fat,
                        saturatedFat,
                        nonSaturatedFat,
                        sugar,
                        fiber,
                        cholesterol,
                        potassium,
                        sodium,
                        salt,
                        fresh,
                    }

                    // Check group
                    let group = parseInt(row['group']);
                    if (group >= 1 && group <= 11) {
                        ingredientData.ingredientGroupId = {id: group}
                    }

                    console.log("Ingredients data:", ingredientData);

                    let ingredient: Ingredient;
                    if (!existingIngredient) {
                        // Create new ingredient
                        ingredient = await this.ingredientService.create({
                            ...ingredientData,
                            allergies
                        });
                        console.log(`Ingrediente '${name}' creado.`);
                    } else {
                        ingredient = await this.ingredientService.update(existingIngredient.id, ingredientData);
                        console.log(`Ingrediente '${name}' actualizado.`);
                    }
                }
                console.log('Importación de ingredientes completada.');
            });

    }
}