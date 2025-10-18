import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  forwardRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonIcon,
  IonInput,
  IonItem,
  IonText,
  IonDatetime,
  IonButton,
  IonButtons,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SelectableOptionsComponent } from '../forms/selectable-options/selectable-options.component';
@Component({
  selector: 'app-custom-input',
  standalone: true,
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  imports: [
    IonInput,
    IonIcon,
    IonItem,
    IonText,
    IonicStorageModule,
    TranslateModule,
    ReactiveFormsModule,
    CommonModule,
    IonDatetime,
    IonButton,
    IonButtons,
    IonSelect,
    IonSelectOption,
    SelectableOptionsComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor {
  // Propiedades de entrada para personalización del input
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;
  @Input() placeholder!: string;
  @Input() labelPlacement: string = 'floating'; //Para un input tipo password se debo colocar fixed
  @Input() fontSize: string = '1rem';
  @Input() inputStyle: string = ''; // Estilo por defecto para el input
  @Input() hasError: boolean = false;
  @Input() errorMessage: string = '';
  @Input() customIcon?: string;
  @Input() customIconColor?: any = null;
  @Input() options: { label: string; value: string }[] = [];
  @Input() multiselect: boolean = false;
  @Input() inputmode: string = 'text';
  @Input() pattern?: string;

  // Estado interno del componente
  public isPassword!: boolean;
  public hide: boolean = true;
  public value: any = '';
  public isDisabled: boolean = false;
  public hasValue: boolean = false;
  public showDatepicker = false;

  // Funciones requeridas por ControlValueAccessor
  onChange = (_: any) => {};
  onTouch = () => {};
  @ViewChild('mainInput', { static: false, read: ElementRef })
  mainInput!: ElementRef;

  triggerInputClick() {
    // Si se hace click en el icono del input que se dispare el evento de click del input
    console.log('triggerInputClick called');
    if (this.mainInput) {
      console.log('Clicking ionItem');
      this.mainInput.nativeElement.click();
      
    }
  }

  ngOnInit() {
    // Log para depuración de iconos recibidos

    // Determinar si el campo es de tipo password para manejar la visibilidad
    if (this.type === 'password') {
      this.isPassword = true;
    }

    // Verifica si hay un valor inicial
    if (this.control) {
      this.hasValue = !!this.control.value;

      // Suscripción para detectar cambios en el valor del control
      this.control.valueChanges.subscribe((value) => {
        this.hasValue = !!value;
      });
    }

    if (this.type === 'select') {
      console.log('CustomInputComponent options:', this.options);
    }
  }

  // Alterna la visibilidad de la contraseña
  passwordToggle() {
    this.hide = !this.hide;
    this.type = this.hide ? 'password' : 'text';
  }

  // Método para manejar cambios directamente desde el evento ionInput
  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.hasValue = !!value;
    this.updateValue(event);
  }

  openDatepicker() {
    this.showDatepicker = true;
  }

  onDateChange(event: any) {
    const value = event.detail.value;
    this.control.setValue(value);
    this.value = value;
    this.hasValue = !!value;
    this.onChange(value);
    this.onTouch();
    this.showDatepicker = false;
  }

  // Implementación de ControlValueAccessor
  writeValue(value: any): void {
    this.value = value;
    this.hasValue = !!value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  updateValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouch();
  }

  resetDatetime() {
    this.control.setValue(null);
    this.value = null;
    this.hasValue = false;
    this.showDatepicker = false;
  }

  cancelDatetime() {
    this.showDatepicker = false;
  }

  isSelected(value: string): boolean {
    if (this.multiselect) {
      return (
        Array.isArray(this.control.value) && this.control.value.includes(value)
      );
    } else {
      return this.control.value === value;
    }
  }

  toggleOption(value: string): void {
    if (this.multiselect) {
      let current = Array.isArray(this.control.value)
        ? [...this.control.value]
        : [];
      if (current.includes(value)) {
        current = current.filter((v) => v !== value);
      } else {
        current.push(value);
      }
      this.control.setValue(current);
      this.onChange(current);
    } else {
      this.control.setValue(value);
      this.onChange(value);
    }
    this.onTouch();
  }
get isValid(): boolean {
  return !!this.control && this.control.valid && (this.control.dirty || this.control.touched);
}

}
