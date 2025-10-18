import { style } from '@angular/animations';
import { Component } from '@angular/core';

export const PRO_FORM_RESULTS_CONFIG = [
  {
    headerText: {
      title: 'PRO_FORM_RESULTS.STEP1_TITLE',
      description: 'PRO_FORM_RESULTS.STEP1_DESCRIPTION',
    },
    acceptBtn: 'PRO_FORM_RESULTS.CONTINUE',
    component: 'results',
    results: ['score', 'goals'],
  },
  // {
  //   headerText: {
  //     title: 'PRO_FORM_RESULTS.STEP2_TITLE',
  //     description: 'PRO_FORM_RESULTS.STEP2_DESCRIPTION',
  //   },
  //   acceptBtn: 'PRO_FORM_RESULTS.CONTINUE',
  //   denyBtn: 'PRO_FORM_RESULTS.NOT_NOW',
  //   component: 'default',
  // },
  // {
  //   headerText: {
  //     title: 'PRO_FORM_RESULTS.STEP3_TITLE',
  //   },
  //   acceptBtn: 'PRO_FORM_RESULTS.YES',
  //   denyBtn: 'PRO_FORM_RESULTS.NO',
  //   component: 'results',
  //   results: ['goals'],
  //   style: {
  //     border: '1px solid #1C1C1C',
  //   },
  // },
];
