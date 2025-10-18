import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonRadio, IonRadioGroup } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { HydrationService } from 'src/app/services/hydratation.service';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';


@Component({
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonRadio,
    IonRadioGroup,
  ],
  selector: 'app-input-card',
  templateUrl: './input-card.component.html',
  styleUrls: ['./input-card.component.scss']
})

export class InputCardComponent {
  private hydrationService = inject(HydrationService);

  hydrationRegister$ = this.hydrationService.getHydrationStatus();
  selectedIndex: number | null = null;

  @Output() selectionChange = new EventEmitter<number | null>();

  selectOption(index: number) {
    this.selectedIndex = index;
    this.selectionChange.emit(this.selectedIndex);
  }
}