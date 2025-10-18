import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-result-card',
  templateUrl: './options-result-card.component.html',
  styleUrls: ['./options-result-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class OptionsResultCardComponent implements OnInit {
  @Input() results: any[] = [];
  @Input() style: any = {};
  ngOnInit() {
    console.log(
      'OptionsResultCardComponent initialized with results:',
      this.results
    );
  }
}
