import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { IonIcon, IonContent, IonText, IonButton, IonSkeletonText } from "@ionic/angular/standalone";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [IonSkeletonText,
    IonButton,
    IonText,
    IonContent, 
    IonIcon, 
    HeaderComponent,
    TranslateModule,
  ],
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent  implements OnInit {


  ngOnInit() {}

}
