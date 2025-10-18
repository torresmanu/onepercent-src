import { Component, inject, signal, type OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonIcon,
  NavController,
  IonImg,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  SegmentCustomEvent,
  IonButtons,
  IonButton,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { User } from 'src/app/core/interfaces/user';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SwiperCardsComponent } from '../swiper-cards/swiper-cards.component';
import { TodayProgressCardComponent } from '../today-progress-card/today-progress-card.component';
import { TodayPillCardComponent } from '../today-pill-card/today-pill-card.component';
import { PillsSelectionSwipperComponent } from "../pills-selection-swipper/pills-selection-swipper.component";
import { RegisterActivityCardComponent } from "../register-activity-card/register-activity-card.component";
@Component({
  selector: 'app-activity-main',
  standalone: true,
  imports: [
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonImg,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonAvatar,
    IonIcon,
    RouterLink,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButtons,
    IonButton,
    SwiperCardsComponent,
    TodayProgressCardComponent,
    TodayPillCardComponent,
    PillsSelectionSwipperComponent,
    RegisterActivityCardComponent
],
  templateUrl: './activity-main.component.html',
  styleUrls: ['./activity-main.component.scss'],
})
export class ActivityMainComponent implements OnInit {
  user: User | null = null;
  public environment = environment;

  constructor() {}

  ngOnInit() {}
}
