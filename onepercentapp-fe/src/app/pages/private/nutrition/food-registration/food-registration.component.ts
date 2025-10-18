import { Component, inject, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { SelectMealModalComponent } from 'src/app/shared/components/select-meal-modal/select-meal-modal.component';
import { ModalService } from '@src/app/services/modal.service';
import { NutritionService } from 'src/app/services/nutrition.service';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    CustomInputComponent,
    CommonModule,
  ],
  selector: 'app-food-registration',
  templateUrl: './food-registration.component.html',
  styleUrls: ['./food-registration.component.scss'],
})
export class FoodRegistrationComponent implements OnInit {
  foodInputControl = new FormControl('', Validators.required);
  modalService = inject(ModalService);
  nutritionService = inject(NutritionService);
  navCtrl = inject(NavController);

  selectedMealTitle: string | null = null;
  meals: any[] = [];
  selectedTab = signal<string>('registrando');

  get ingredients() {
    return this.nutritionService.getIngredients();
  }

  constructor() {}

  ngOnInit() {
    this.nutritionService.getFoodData().subscribe((data) => {
      this.meals = Array.isArray(data) ? data : Object.values(data);
    });
  }

  changeTab(event: any) {
    this.selectedTab.set(event.detail.value);
  }

  async openSelectMealModal() {
    await this.modalService.presentMediumModal(
      SelectMealModalComponent,
      {
        title: 'Escoge la comida',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }
    ).then((result) => {
      if (result.role === 'confirm' && typeof result.data === 'number') {
        this.selectedMealTitle = this.meals[result.data]?.title ?? null;
      }
    });
  }

  editIngredient(index: number) {
    this.navCtrl.navigateForward(['/private/edit-ingredient', index]);
  }

  removeIngredient(index: number) {
    this.nutritionService.getIngredients().splice(index, 1);
  }
}