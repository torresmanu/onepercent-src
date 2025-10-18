export const ALLERGIES_FORM_CONFIG = [
  {
    headerText: {
      title: 'ALLERGIES.STEP2_TITLE',
      description: 'ALLERGIES.STEP2_DESCRIPTION',
    },
    icons: [
      '/assets/icons/initFormIcons/slash.svg',
      '/assets/icons/initFormIcons/wheat.svg',
      '/assets/icons/initFormIcons/glass.svg',
      '/assets/icons/initFormIcons/soy.svg',
      '/assets/icons/initFormIcons/crab.svg',
      '/assets/icons/initFormIcons/mollusk.svg',
      '/assets/icons/initFormIcons/egg.svg',
      '/assets/icons/initFormIcons/peanut.svg',
      '/assets/icons/initFormIcons/celery.svg',
      '/assets/icons/initFormIcons/mustard.svg',
      '/assets/icons/initFormIcons/sesame.svg',
      '/assets/icons/initFormIcons/lupins.svg',
      '/assets/icons/initFormIcons/sulfites.svg',
    ],
    values: [],
    key: 'allergiesData',
    selected: {
      allowMultiple: true, // Use multiselect to determine if multiple selection is allowed
      values: [],
    },
  },
  {
    headerText: {
      title: 'ALLERGIES.STEP2_TITLE',
      description: 'ALLERGIES.STEP2_DESCRIPTION',
    },
    icons: [
      '/assets/icons/initFormIcons/gluten.svg',
      '/assets/icons/initFormIcons/glass.svg',
      '/assets/icons/initFormIcons/sorbital.svg',
      '/assets/icons/initFormIcons/salt.svg',
      '/assets/icons/initFormIcons/fruits.svg',
      '/assets/icons/initFormIcons/coffee.svg',
    ],
    values: [],
    key: 'intolerancesData',
    selected: {
      allowMultiple: true, // Use multiselect to determine if multiple selection is allowed
      values: [],
    },
  },
  {
    headerText: {
      title: 'ALLERGIES.STEP3_TITLE',
      description: 'ALLERGIES.STEP3_DESCRIPTION',
    },
    icons: [
      '/assets/icons/initFormIcons/slash.svg',
      '/assets/icons/initFormIcons/fish.svg',
      '/assets/icons/initFormIcons/veggie.svg',
      '/assets/icons/initFormIcons/carrot.svg',
      '/assets/icons/initFormIcons/noGluten.svg',
    ],
    values: [],
    key: 'nutritionPreferencesData',
    selected: {
      allowMultiple: true, // Use multiselect to determine if multiple selection is allowed
      values: [],
    },
  },
];
// values: [

//             {
//                 "id": 1,
//                 "key": "vegetablesAndFruitsData",
//                 "title": "Como mucho 1 porción al día",
//                 "description": null,
//                 "createdAt": "2025-06-24T15:23:51.241Z",
//                 "updatedAt": "2025-06-24T15:23:51.241Z"
//             },
//             {
//                 "id": 2,
//                 ...
// ]
