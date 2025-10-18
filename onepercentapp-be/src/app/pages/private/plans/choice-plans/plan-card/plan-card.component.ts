import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-plan-card',
  standalone: true,
  imports: [IonIcon, CommonModule, TranslateModule],
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent  {
  @Input() plan: any;
  @Input() isSelected: boolean = false;
  @Input() discounts: any;
  @Output() isFreeTrial = new EventEmitter<any>();


  public checkboxIcons = {
    selected: 'checkmark-circle',
    unselected: 'ellipse-outline',
  };
  subscriptionPeriod(text:string){
    if (text === 'P1M') {
      return '';
    } else if (text === 'P1Y') {
      return `${this.plan.product.pricePerYearString }`;
    } else if (text === 'P6M') {
      return `${this.plan.product.priceString}`;
    } else {
      return text;
    }

  } 
}
