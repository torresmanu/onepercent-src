import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-plan-card-paywall2',
  standalone: true,
  imports: [ CommonModule,TranslateModule],
  templateUrl: './plan-card-paywall2.component.html',
  styleUrls: ['./plan-card-paywall2.component.scss'],
})
export class PlanCardComponentPaywall2 implements OnInit {

  @Input() availablePackages: any[] = [];
  @Input() discounts: any = {};
  @Output() selectedPackage = new EventEmitter<string | null>();
  selectedId: string | null = null;
  constructor() { }

  ngOnInit() {
    this.onSelect("$rc_annual");
    console.log('Available Packages in PlanCardComponentPaywall2:', this.availablePackages);
    console.log('Discounts in PlanCardComponentPaywall2:', this.discounts);
  }
  onSelect(id: string) {
    // alterna selección; si quieres que no se pueda deseleccionar, elimina el ternario
    this.selectedId = (this.selectedId === id) ? null : id;
    this.selectedPackage.emit(this.selectedId);
  }
}
