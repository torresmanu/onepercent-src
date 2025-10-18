export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  components: string[];
  favorite: boolean;
  section: string;
  time: number;
  value: number;
}

export const RECETAS: Recipe[] = [
  {
    id: 'r1',
    title: 'Spaghetti a la Boloñesa',
    description: 'Pasta italiana con salsa de carne y tomate.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/d/d0/Pasta_%281%29.jpg',
    components: ['Spaghetti', 'Carne molida', 'Tomate', 'Cebolla', 'Ajo'],
    favorite: true,
    section: 'Breakfast',
    time: 30,
    value: 1,
  },
  {
    id: 'r2',
    title: 'Tacos al Pastor',
    description: 'Tacos mexicanos con carne de cerdo marinada.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/d/d1/%28El_Flaco%29_Al_Pastor_Tacos.jpg',
    components: ['Tortillas', 'Carne al pastor', 'Piña', 'Cilantro', 'Cebolla'],
    favorite: false,
    section: 'Lunch',
    time: 10,
    value: 2,
  },
  {
    id: 'r3',
    title: 'Sushi Variado',
    description: 'Selección de sushi con salmón, atún y aguacate.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Sushi_bandeja.jpg/1200px-Sushi_bandeja.jpg',
    components: ['Arroz', 'Alga nori', 'Salmón', 'Atún', 'Aguacate'],
    favorite: true,
    section: 'Dinner',
    time: 20,
    value: 3,
  },
  {
    id: 'r4',
    title: 'Ensalada César',
    description: 'Ensalada fresca con aderezo César y crutones.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/2/23/Caesar_salad_%282%29.jpg',
    components: ['Lechuga', 'Pollo', 'Parmesano', 'Crutones', 'Aderezo César'],
    favorite: false,
    section: 'Snacks',
    time: 30,
    value: 4,
  },
  {
    id: 'r5',
    title: 'Pizza Margarita',
    description: 'Pizza italiana clásica con mozzarella y albahaca.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg',
    components: ['Masa de pizza', 'Tomate', 'Mozzarella', 'Albahaca'],
    favorite: true,
    section: 'Breakfast',
    time: 20,
    value: 1,
  },
  {
    id: 'r6',
    title: 'Pollo al Curry',
    description: 'Delicioso pollo cocinado en salsa de curry con arroz.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/be/Chicken_Curry_%E2%80%93_Trissur_Style_%2815727448880%29.jpg',
    components: ['Pollo', 'Curry', 'Arroz', 'Crema', 'Cilantro'],
    favorite: false,
    section: 'Lunch',
    time: 30,
    value: 2,
  },
  {
    id: 'r7',
    title: 'Hamburguesa Clásica',
    description: 'Hamburguesa con carne, queso, lechuga y tomate.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/6/62/NCI_Visuals_Food_Hamburger.jpg',
    components: ['Pan', 'Carne de res', 'Queso', 'Lechuga', 'Tomate'],
    favorite: true,
    section: 'Dinner',
    time: 20,
    value: 3,
  },
  {
    id: 'r8',
    title: 'Crepes de Nutella',
    description: 'Crepes dulces rellenos con Nutella y frutas.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/4/4c/Crep_de_chocolates.jpg',
    components: ['Harina', 'Leche', 'Huevos', 'Nutella', 'Frutas'],
    favorite: false,
    section: 'Snacks',
    time: 10,
    value: 4,
  },
  {
    id: 'r9',
    title: 'Gnocchi con Pesto',
    description: 'Pasta de papa con salsa pesto casera.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/8/86/Gnocchi_di_ricotta_burro_e_salvia.jpg',
    components: ['Gnocchi', 'Albahaca', 'Ajo', 'Parmesano', 'Aceite de oliva'],
    favorite: true,
    section: 'Breakfast',
    time: 30,
    value: 1,
  },
  {
    id: 'r10',
    title: 'Falafel con Hummus',
    description: 'Bocados de garbanzo acompañados de hummus.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/0/05/Falafel_balls.jpg',
    components: ['Garbanzo', 'Cilantro', 'Cebolla', 'Ajo', 'Tahini'],
    favorite: true,
    section: 'Lunch',
    time: 30,
    value: 2,
  },
  {
    id: 'r11',
    title: 'Ramen Japonés',
    description: 'Sopa japonesa con fideos, cerdo y huevo marinado.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Soy_ramen.jpg/640px-Soy_ramen.jpg',
    components: ['Fideos ramen', 'Cerdo', 'Huevo', 'Cebollín', 'Caldo'],
    favorite: false,
    section: 'Dinner',
    time: 30,
    value: 3,
  },
  {
    id: 'r12',
    title: 'Paella Valenciana',
    description: 'Tradicional arroz español con mariscos y verduras.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/01_Paella_Valenciana_original.jpg/1200px-01_Paella_Valenciana_original.jpg',
    components: ['Arroz', 'Camarones', 'Calamares', 'Pimiento', 'Azafrán'],
    favorite: true,
    section: 'Snacks',
    time: 20,
    value: 4,
  },
];
