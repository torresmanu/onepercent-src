import { Component, inject } from '@angular/core';
import { IonicModule, } from "@ionic/angular";
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { InputCardComponent } from "./input-card/input-card.component";
import { ReactiveFormsModule } from '@angular/forms';
import { HydrationService } from 'src/app/services/hydratation.service';

@Component({
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule,
    HeaderComponent,
    InputCardComponent,
    ReactiveFormsModule
  ],
  selector: 'app-hydration-registration',
  templateUrl: './hydration-registration.component.html',
  styleUrls: ['./hydration-registration.component.scss']
})

export class HydrationRegistrationComponent {
  private hydrationService = inject(HydrationService);

  selected: number | null = null;
  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['/private/nutrition']);
  }

  onSelectionChange(selected: number | null) {
    this.selected = selected;
  }

  registerHydration() {
    if (this.selected !== null) {
      this.hydrationService.sendHydrationStatus(this.selected);
    }
  }
}