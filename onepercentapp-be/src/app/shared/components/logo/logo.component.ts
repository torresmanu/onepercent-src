import { Component, Input, OnInit } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  imports: [IonImg],
})
export class LogoComponent  implements OnInit {
  @Input() dark: boolean = false;
  @Input() width: string = '3.75rem';
  @Input() height: string = '3.75rem';

  constructor() { }

  ngOnInit() {}

}
