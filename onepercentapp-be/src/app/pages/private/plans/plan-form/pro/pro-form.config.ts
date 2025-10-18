import { FormControl, Validators } from '@angular/forms';

export const PRO_CONFIG = [
  // {
  //   component: 'pro-intro',
  //   title: 'PRO_FORM.STEP1_TITLE',
  //   pictureUrl: '../../../../../assets/imgs/plan-forms/pro-plan-bg.png',
  // },
  // {
  //   pictureUrl: 'assets/imgs/plan-forms/get-to-know.png',
  //   headerTitle: 'PRO_FORM.STEP2_TITLE',
  //   description: 'PRO_FORM.STEP2_DESC',
  //   stepper: false,
  //   content: 'text',
  //   component: 'landing-logo',
  // },
  {
    image: '../../../../../assets/imgs/plan-forms/birth-date.png',
    title: 'PRO_FORM.STEP3_TITLE',
    description: 'PRO_FORM.STEP3_DESC',
    stepper: true,
    content: 'input',
    inputs: [
      {
        type: 'date',
        customIcon: '../../../../../assets/icon/calendar.svg',
        control: new FormControl(),
        placeholder: 'PRO_FORM.STEP3_INPUT_PLACEHOLDER',
      },
    ],
  },
  {
    image: '../../../../../assets/imgs/plan-forms/height.png',
    title: 'PRO_FORM.STEP4_TITLE',
    description: 'PRO_FORM.STEP4_DESC',
    stepper: true,
    content: 'input',
    inputs: [
      {
        type: 'number',
        customIcon: '../../../../../assets/icon/pencil.svg',
        control: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[0-9]{3}$/), // Solo números enteros de 3 cifras (cm)
        ]),
        placeholder: 'PRO_FORM.STEP4_INPUT_PLACEHOLDER',
        inputmode: 'numeric',
        pattern: '^[0-9]{3}$',
        customErrorMessage: 'ERRORS.CM',
      },
    ],
  },
  {
    image: '../../../../../assets/imgs/plan-forms/gender.png',
    description: 'PRO_FORM.STEP5_DESC',
    stepper: true,
    content: 'text',
  },
  {
    image: '../../../../../assets/imgs/plan-forms/gender2.png',
    title: 'PRO_FORM.STEP6_TITLE',
    description: 'PRO_FORM.STEP6_DESC',
    stepper: true,
    content: 'selectable',
    multiselect: false,
    control: new FormControl(),
    options: [
      { label: 'PRO_FORM.GENDER_MALE', value: 'male', input: false },
      { label: 'PRO_FORM.GENDER_FEMALE', value: 'female', input: false },
      {
        label: 'PRO_FORM.GENDER_NONBINARY',
        value: 'nonbinary',
        input: false,
      },
      { label: 'PRO_FORM.GENDER_NOT_SAY', value: 'not_say', input: false },
      { label: 'PRO_FORM.GENDER_OTHER', value: 'other', input: true },
    ],
  },
  {
    image: '../../../../../assets/imgs/plan-forms/bio-gender.png',
    title: 'PRO_FORM.STEP7_TITLE',
    description: 'PRO_FORM.STEP7_DESC',
    stepper: true,
    content: 'selectable',
    multiselect: false,
    control: new FormControl(),
    options: [
      { label: 'PRO_FORM.GENDER_MALE', value: 'male', input: false },
      { label: 'PRO_FORM.GENDER_FEMALE', value: 'female', input: false },
      {
        label: 'PRO_FORM.GENDER_INTERSEXUAL',
        value: 'intersexual',
        input: false,
      },
      { label: 'PRO_FORM.GENDER_NOT_SAY', value: 'not_say', input: false },
    ],
  },
  {
    image: '../../../../../assets/imgs/plan-forms/weight.png',
    title: 'PRO_FORM.STEP8_TITLE',
    description: 'PRO_FORM.STEP8_DESC',
    stepper: true,
    content: 'input',
    inputs: [
      {
        type: 'number',
        customIcon: '../../../../../assets/icon/pencil.svg',
        control: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[0-9]{1,4}$/), // Solo números enteros de hasta 4 cifras
        ]),
        placeholder: 'PRO_FORM.STEP8_INPUT_PLACEHOLDER',
        inputmode: 'numeric',
        pattern: '^[0-9]{1,4}$',
        customErrorMessage: 'ERRORS.KG',
      },
    ],
  },
  {
    image: '../../../../../assets/imgs/plan-forms/know-us.png',
    title: 'PRO_FORM.STEP9_TITLE',
    description: 'PRO_FORM.STEP9_DESC',
    stepper: true,
    content: 'selectable',
    multiselect: true,
    control: new FormControl(),
    options: [
      {
        label: 'PRO_FORM.STEP9_OPTION_PODCAST',
        value: 'podcast',
        input: false,
      },
      { label: 'PRO_FORM.STEP9_OPTION_PRESS', value: 'press', input: false },
      {
        label: 'PRO_FORM.STEP9_OPTION_INTERNET_AD',
        value: 'internet_ad',
        input: false,
      },
      {
        label: 'PRO_FORM.STEP9_OPTION_INFLUENCER',
        value: 'influencer',
        input: false,
      },
      {
        label: 'PRO_FORM.STEP9_OPTION_FRIEND',
        value: 'friend',
        input: false,
      },
      {
        label: 'PRO_FORM.STEP9_OPTION_HEALTH_PRO',
        value: 'health_pro',
        input: false,
      },
      { label: 'PRO_FORM.STEP9_OPTION_STORE', value: 'store', input: false },
      { label: 'PRO_FORM.STEP9_OPTION_OTHER', value: 'other', input: false },
    ],
  },
];
