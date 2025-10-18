import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    // Add any other necessary imports here
  ],
  selector: 'app-daily-highlights-slider',
  templateUrl: './daily-highlights-slider.component.html',
  styleUrls: ['./daily-highlights-slider.component.scss'],
})
export class DailyHighlightsSliderComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
