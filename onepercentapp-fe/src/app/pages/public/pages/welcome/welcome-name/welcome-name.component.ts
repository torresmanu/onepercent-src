import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonContent,
  NavController,
  Platform,
  IonHeader,
} from '@ionic/angular/standalone';
import { CustomInputComponent } from '../../../../../shared/components/custom-input/custom-input.component';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome-name',
  standalone: true,
  imports: [
    IonHeader,
    CommonModule,
    IonButton,
    TranslateModule,
    IonBackButton,
    IonContent,
    CustomInputComponent,
  ],
  templateUrl: './welcome-name.component.html',
  styleUrls: ['./welcome-name.component.scss'],
})
export class WelcomeNameComponent implements OnInit, OnDestroy {
  name = new FormControl('', Validators.minLength(3));
  isKeyboardOpen = false;
  private keyboardSubscription!: Subscription;
  private readonly navCtrl = inject(NavController);
  private readonly platform = inject(Platform);
  private readonly translate = inject(TranslateService);

  ngOnInit(): void {
    if (this.platform.is('android')) {
      this.keyboardSubscription = this.platform.keyboardDidShow.subscribe(
        () => {
          this.isKeyboardOpen = true;
        }
      );

      this.keyboardSubscription.add(
        this.platform.keyboardDidHide.subscribe(() => {
          this.isKeyboardOpen = false;
        })
      );
    }
  }

  ngOnDestroy(): void {
    if (this.keyboardSubscription) {
      this.keyboardSubscription.unsubscribe();
    }
  }

  continue() {
    const nameValue = this.name.value?.trim() || '';

    // Leer y parsear el objeto actual
    const formRaw = localStorage.getItem('registerform');
    const form = formRaw ? JSON.parse(formRaw) : {};

    // Añadir o actualizar el campo name
    form.firstname = nameValue;

    // Guardar el objeto actualizado
    localStorage.setItem('registerform', JSON.stringify(form));

    console.log('registerform actualizado:', form);

    this.navCtrl.navigateForward(['/public/welcome-final'], {
      queryParams: { name: nameValue },
    });
  }
}
