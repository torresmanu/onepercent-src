import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  NavController, IonHeader } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonHeader, IonButton, IonContent, CommonModule, FormsModule, LogoComponent, TranslateModule],
})
export class WelcomePage implements OnInit {
  private readonly navCtrl = inject(NavController);

  constructor() {}

  ngOnInit() {}

  goToEnterName() {
    this.navCtrl.navigateForward(['/public/welcome-name']);
  }

  goToLogin() {
    this.navCtrl.navigateForward(['/public/login']);
  }
}
