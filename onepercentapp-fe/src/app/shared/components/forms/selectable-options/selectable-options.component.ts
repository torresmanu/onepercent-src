import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-selectable-options',
  standalone: true,
  templateUrl: './selectable-options.component.html',
  styleUrls: ['./selectable-options.component.scss'],
  imports: [CommonModule, TranslateModule],
})
export class SelectableOptionsComponent {
  /*
  ====================================================================================
  COMPONENTE: SelectableOptionsComponent (app-selectable-options)
  ====================================================================================

  Descripción general:
  --------------------
  Componente de opciones seleccionables reutilizable para formularios. Permite selección simple o múltiple, soporte para inputs embebidos, estilos customizables y emisión de cambios de valor.

  Inputs:
  -------
  - options: array de opciones a mostrar (pueden ser simples o con input).
  - value: valor actual seleccionado (string o array de strings).
  - multiselect: permite selección múltiple si es true.
  - inputStyle: clase de estilos para personalizar la apariencia.

  Outputs:
  --------
  - valueChange: emite el valor seleccionado o array de valores seleccionados.

  Métodos y ciclo de vida:
  ------------------------
  - ngOnInit(): inicializa el valor según el modo de selección.
  - isSelected(): determina si una opción está seleccionada.
  - toggleOption(): gestiona la selección/deselección de opciones.
  - onInputFocus(): selecciona la opción al enfocar el input.
  - onInputChange(): actualiza el valor del input y lo emite.
  - focusInput(): enfoca el input correspondiente.

  Buenas prácticas y recomendaciones:
  ----------------------------------
  - Usa multiselect para permitir selección múltiple.
  - Personaliza los estilos con inputStyle y SCSS.
  - Si añades nuevos tipos de opción, actualiza la lógica de renderizado y selección.
  - Usa claves de traducción en los labels de las opciones.

  Ejemplo de uso (ver selectable-options.component.html):
  -------------------------------------------------------
  <app-selectable-options [options]="options" [value]="selected" [multiselect]="true" (valueChange)="onChange($event)"></app-selectable-options>

  Notas sobre estilos y extensibilidad:
  -------------------------------------
  - Personaliza la apariencia de las opciones y los inputs en el SCSS.
  - Si necesitas lógica adicional, implementa métodos auxiliares y documenta su propósito.
  */

  @Input() options: any[] = [];
  @Input() value: string | string[] = '';
  @Input() multiselect: boolean = false;
  @Input() inputStyle: string = 'standard-imput-plan-form'; // Default style, can be overridden
  @Output() valueChange = new EventEmitter<string | string[]>();

  @ViewChildren('inputRef') inputRefs!: QueryList<ElementRef<HTMLInputElement>>;

  inputValues: { [key: string]: string } = {};

  ngOnInit() {
    if (this.value === null || this.value === undefined) {
      this.value = this.multiselect ? [] : '';
    }
  }

  isSelected(val: string): boolean {
    if (this.multiselect) {
      return Array.isArray(this.value) && this.value.includes(val);
    } else {
      return this.value === val;
    }
  }

  toggleOption(val: string): void {
    if (this.multiselect) {
      let current = Array.isArray(this.value) ? [...this.value] : [];
      if (current.includes(val)) {
        current = current.filter((v) => v !== val);
      } else {
        current.push(val);
      }
      this.valueChange.emit(current);
    } else {
      if (this.value === val) {
        this.valueChange.emit('');
      } else {
        this.valueChange.emit(val);
      }
    }
  }

  onInputFocus(val: string) {
    if (!this.isSelected(val)) {
      this.toggleOption(val);
    }
  }

  onInputChange(event: Event, val: string) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.inputValues[val] = inputValue;
    // Si quieres emitir el valor del input como value principal:
    this.valueChange.emit(inputValue);
  }

  focusInput(i: number) {
    const input = this.inputRefs?.toArray()[i]?.nativeElement;
    if (input) {
      input.focus();
    }
  }
}
