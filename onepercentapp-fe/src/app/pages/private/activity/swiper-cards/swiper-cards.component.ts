import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { SplitSlideComponent } from "../../nutrition/split-slide/split-slide.component";
import { WaterSlideComponent } from "../../nutrition/water-slide/water-slide.component";
import { FruitSlideComponent } from "../../nutrition/fruit-slide/fruit-slide.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-swiper-cards',
  standalone: true,
  templateUrl: './swiper-cards.component.html',
  styleUrls: ['./swiper-cards.component.scss'],
  imports: [ CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class SwiperCardsComponent  implements OnInit {

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
