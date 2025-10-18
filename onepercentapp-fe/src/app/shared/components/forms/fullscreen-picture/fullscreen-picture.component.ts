import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonButton } from '@ionic/angular/standalone';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-fullscreen-picture',
  templateUrl: './fullscreen-picture.component.html',
  styleUrls: ['./fullscreen-picture.component.scss'],
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
export class FullScreenPictureComponent {
  public translate = inject(TranslateModule);
  @Input() pictureUrl: string = '';
  @Input() buttonText: string = '';
  @Input() title: string = '';
  @Output() continue = new EventEmitter<void>();

  onContinue() {
    this.continue.emit();
  }
}
