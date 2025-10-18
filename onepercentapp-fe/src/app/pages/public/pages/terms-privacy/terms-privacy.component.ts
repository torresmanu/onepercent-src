import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonContent, NavController, IonText } from '@ionic/angular/standalone';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { StorageService } from 'src/app/services/storage.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-privacy',
  standalone: true,
  imports: [IonText, 
    CommonModule,
    IonContent,
    IonButton,
    LogoComponent,
    TranslateModule],
  templateUrl: './terms-privacy.component.html',
  styleUrls: ['./terms-privacy.component.scss'],
})
export class TermsPrivacyComponent implements OnInit {
  // Inyección de servicios necesarios
  private readonly navCtrl = inject(NavController);
  private readonly storageService = inject(StorageService);
private readonly translate = inject(TranslateService);
  ngOnInit(): void { 
    this.storageService.get(StorageKey.termsAccepted).subscribe(value => {
      console.log('termsAccepted:', value);
      if (value === true) {
        this.navCtrl.navigateForward('/private/plans/select-info');
      }
    });
  }

  acceptTerms() {
    this.storageService.set(StorageKey.termsAccepted, true);
    this.navCtrl.navigateForward('/private/plans/select-info');
  }

}
