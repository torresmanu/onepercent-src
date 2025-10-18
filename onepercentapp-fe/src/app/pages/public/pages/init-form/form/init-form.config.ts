export const STEPS_CONFIG: any = [
  {
    headerText: {
      title: 'STEPS.STEP1_TITLE',
      description: 'STEPS.STEP1_DESCRIPTION',
    },
    icons: [
      '../../../../../../../assets/icons/initFormIcons/walking.svg',
      '../../../../../../../assets/icons/initFormIcons/running.svg',
      '../../../../../../../assets/icons/initFormIcons/sprinting.svg',
    ],
    values: [],
    key: 'activeData',
    selected: {
      allowMultiple: false,
      values: [],
    },
  },
  {
    headerText: {
      title: 'STEPS.STEP2_TITLE',
      description: 'STEPS.STEP2_DESCRIPTION',
    },
    icons: [
      '../../../../../../../assets/icons/initFormIcons/0sessions.svg',
      '../../../../../../../assets/icons/initFormIcons/1_3sessions.svg',
      '../../../../../../../assets/icons/initFormIcons/4_5sessions.svg',
      '../../../../../../../assets/icons/initFormIcons/5sessions.svg',
    ],
    values: [],
    key: 'workoutWeeks',
    selected: {
      allowMultiple: false,
      values: [],
    },
  },
  {
    headerText: {
      title: 'STEPS.STEP3_TITLE',
      description: 'STEPS.STEP3_DESCRIPTION',
    },
    icons: [
      '../../../../../../../assets/icons/initFormIcons/halfGlass.svg',
      '../../../../../../../assets/icons/initFormIcons/bottle.svg',
      '../../../../../../../assets/icons/initFormIcons/ocean.svg',
    ],
    values: [],
    key: 'hydrationData',
    selected: {
      allowMultiple: false,
      values: [],
    },
  },
  {
    headerText: {
      title: 'STEPS.STEP4_TITLE',
      description: 'STEPS.STEP4_DESCRIPTION',
    },
    icons: [
      '../../../../../../../assets/icons/initFormIcons/bittenChicken.svg',
      '../../../../../../../assets/icons/initFormIcons/chicken.svg',
      '../../../../../../../assets/icons/initFormIcons/ham.svg',
    ],
    values: [],
    key: 'vegetablesAndFruitsData',
    selected: {
      allowMultiple: false,
      values: [],
    },
  },
  {
    headerText: {
      title: 'STEPS.STEP5_TITLE',
      description: 'STEPS.STEP5_DESCRIPTION',
    },
    values: [{ id: 1 }, { id: 2 }, { id: 3 }], // exception
    icons: [
      '../../../../../../../assets/icons/initFormIcons/breakfast.svg',
      '../../../../../../../assets/icons/initFormIcons/launch.svg',
      '../../../../../../../assets/icons/initFormIcons/dinner.svg',
    ],
    key: 'foodsHabitsData',
    selected: {
      allowMultiple: true,
      values: [],
    },
    fullPicture: true,
  },
  {
    headerText: {
      title: 'STEPS.STEP6_TITLE',
      description: 'STEPS.STEP6_DESCRIPTION',
    },
    icons: [
      '../../../../../../../assets/icons/initFormIcons/bittenApple.svg',
      '../../../../../../../assets/icons/initFormIcons/apple.svg',
      '../../../../../../../assets/icons/initFormIcons/apples.svg',
    ],
    values: [],
    key: 'vegetablesAndFruitsData',
    selected: {
      allowMultiple: false,
      max: 2,
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
