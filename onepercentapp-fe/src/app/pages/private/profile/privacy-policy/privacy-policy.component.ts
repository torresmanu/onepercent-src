import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { IonContent, IonSkeletonText, IonText } from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  imports: [IonText, IonSkeletonText, IonContent, HeaderComponent],
})
export class PrivacyPolicyComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
