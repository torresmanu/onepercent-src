import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonButton } from '@ionic/angular/standalone';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-landing-logo',
  templateUrl: './landing-logo.component.html',
  styleUrls: ['./landing-logo.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    CommonModule,
    FormsModule,
    LogoComponent,
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class LandingLogoComponent {
  public translate = inject(TranslateModule);
  @Input() pictureUrl: string = '';
  @Input() buttonText: string = 'WELCOME.CONTINUE';
  @Input() headerTitle: string = '';
  @Input() description: string = '';
  @Input() title: string = '';
  @Output() continue = new EventEmitter<void>();

  ngOnInit() {
    console.log('LandingLogoComponent headerTitle:', this.headerTitle);
    console.log('LandingLogoComponent description:', this.description);
    console.log('LandingLogoComponent pictureUrl:', this.pictureUrl);
  }

  onContinue() {
    this.continue.emit();
  }
}
