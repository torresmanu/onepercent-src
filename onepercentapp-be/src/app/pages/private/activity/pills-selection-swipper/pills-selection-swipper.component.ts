import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { SplitSlideComponent } from "../../nutrition/split-slide/split-slide.component";
import { WaterSlideComponent } from "../../nutrition/water-slide/water-slide.component";
import { FruitSlideComponent } from "../../nutrition/fruit-slide/fruit-slide.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pills-selection-swipper',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './pills-selection-swipper.component.html',
  styleUrls: ['./pills-selection-swipper.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class PillsSelectionSwipperComponent  implements OnInit {

 slides = [
    {
      type: '1',
    },
    {
      type: '2',
    },
  ];

  ngOnInit() {}

}
