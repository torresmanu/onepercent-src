import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonIcon,
} from '@ionic/angular/standalone';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-predictive-input',
  standalone: true,
  imports: [
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './predictive-input.component.html',
  styleUrls: ['./predictive-input.component.scss'],
})
export class PredictiveInputComponent implements OnChanges {
  @Input() suggestions: { id: number; name: string }[] = [];
  @Input() placeholder: string = 'Type here...';
  @Input() control?: FormControl;
  @Output() valueChange = new EventEmitter<string>();

  searchText = '';
  filteredItems: { id: number; name: string }[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.control) {
      this.searchText = this.control.value || '';
      this.control.valueChanges.subscribe((val) => {
        if (val !== this.searchText) {
          this.searchText = val || '';
        }
      });
    }
  }

  filterItems() {
    console.log('Filtering items with searchText:', this.searchText);
    const text = this.searchText.toLowerCase();
    if (!text) {
      this.filteredItems = []; // Clear the list if searchText is empty
      if (this.control) {
        this.control.setValue('');
        this.control.markAsDirty();
        this.control.markAsTouched();
      }
      this.valueChange.emit('');
      return;
    }
    this.filteredItems = this.suggestions.filter((item) =>
      item.name.toLowerCase().includes(text)
    );

    console.log('Filtered items:', this.filteredItems);
    if (this.control) {
      this.control.setValue(this.searchText);
      this.control.markAsDirty();
      this.control.markAsTouched();
    }
    this.valueChange.emit(this.searchText);
  }

  selectItem(item: { id: number; name: string }) {
    this.searchText = item.name;
    this.filteredItems = [];
    if (this.control) {
      this.control.setValue(item.name);
    }
    this.valueChange.emit(item.name);
  }

  clearSearch() {
    this.searchText = '';
    if (this.control) {
      this.control.setValue('');
      this.control.markAsDirty();
      this.control.markAsTouched();
    }
    this.filterItems();
    this.valueChange.emit('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['suggestions']) {
      console.log(
        '[PredictiveInputComponent] suggestions changed:',
        changes['suggestions'].currentValue
      );
    }
  }
}
