import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  IonContent,
  IonButton,
  NavController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { PlanCardComponent } from './plan-card/plan-card.component';
import { User } from 'src/app/core/interfaces/user';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/core/interfaces/storage';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-choice-plans',
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    CommonModule,
    TranslateModule,
    PlanCardComponent,
  ],
  templateUrl: './choice-plans.component.html',
  styleUrls: ['./choice-plans.component.scss'],
})
export class ChoicePlansComponent implements OnInit {
  platformName = Capacitor.getPlatform();
  discounts: any = {};
  RevenueCatKey = {
    IOS: 'appl_MDJCjlGoKibxdRRHJGGzOLHBKje',
    ANDROID: 'goog_hWfwhYCKBXaEfzFwRckWXvDywIZ',
  };
  isConfigured = false;
  userData: any;
  selectedPlan: any = null;
  private platformService = inject(Platform);
  private navCtrl = inject(NavController);
  private storageService = inject(StorageService);

  offerings: any = null;
  availablePackages: any[] = [];
  public translate = TranslateModule;
  public selectedPlanIndex: number | null = null;

  @ViewChild(PlanCardComponent) planCard!: PlanCardComponent;

  selectPlan(index: number, pkg?: any) {
    console.log('Plan seleccionado:', pkg);
    this.selectedPlanIndex = index;
    this.selectedPlan = pkg
  }

  thirdSelector(): boolean {
    return (
      this.selectedPlanIndex !== null &&
      this.plans[this.selectedPlanIndex]?.duration === '12 meses'
    );
  }

  plans: Array<{
    duration: string;
    price: string;
    billing: string;
    discount?: string;
    freeTrial?: string;
  }> = [
  ];


  async ngOnInit() {
    await this.platformService.ready();

    this.userData = await firstValueFrom(this.storageService.get(StorageKey.userData));
    const userId = this.userData?.id || 'user_123';
console.log('👤 User ID:', userId);
    await this.configureRevenueCat(userId);
    await this.calculateDiscounts(this.availablePackages);
  }

  async configureRevenueCat(id: string) {
    if (this.isConfigured) return;

    try {
      console.log('🔧 Configurando RevenueCat...');
      await Purchases.configure({
        apiKey:
          this.platformName === 'android'
            ? this.RevenueCatKey.ANDROID
            : this.RevenueCatKey.IOS,
        appUserID: id,
      });
      this.isConfigured = true;

      const info = await Purchases.getCustomerInfo();
      console.log('🧾 RevenueCat info para user:', id, info);

      const offerings = await Purchases.getOfferings();
      this.offerings = offerings;
      this.availablePackages = offerings.current?.availablePackages ?? [];
      console.log('📦 Paquetes disponibles:', this.availablePackages);

    } catch (err) {
      console.error('🛑 Error configurando RevenueCat:', err);
    }
  }

  goHome() {
    
    console.log('Redirigiendo al usuario a la página de inicio...');
    this.navCtrl.navigateRoot('/home');
  }

  async openRevenueCat() {
    if (!this.isConfigured) {
      console.warn('⏳ RevenueCat aún no está configurado');
      return;
    }

    try {
      const offerings = await Purchases.getOfferings();
      const availablePackages = offerings.current?.availablePackages ?? [];

      console.log('📦 Paquetes disponibles:');
      availablePackages.forEach((pkg) =>
        console.log(`🔹 ${pkg.identifier} => ${pkg.product.identifier}`)
      );

      const desiredPackageId = this.selectedPlan.identifier;
      console.log(`🔍 Buscando paquete con ID: ${desiredPackageId}`);

      const packageToBuy = availablePackages.find(
        (pkg) => pkg.identifier === desiredPackageId
      );
      console.log('Paquete seleccionado:', packageToBuy);

      if (!packageToBuy) {
        console.error(`❌ No se encontró el paquete '${desiredPackageId}'`);
        return;
      }

      const { customerInfo } = await Purchases.purchasePackage({
        aPackage: packageToBuy,
      });
      console.log('💳 Resultado de la compra:', customerInfo);

      const entitlement = customerInfo.entitlements.active['Premium'];
      if (entitlement) {
        console.log('🎉 Entitlement activa: Premium');
        // await Purchases.logOut();
      } else {
        console.warn('⚠️ No se activó la suscripción');
      }
    } catch (error) {
      console.error('🛑 Error en la compra:', error);
    }
  }

  async calculateDiscounts(packages: any[]) {
    // 1. Encontrar el paquete mensual
    const monthly = packages.find(p => p.product.subscriptionPeriod === 'P1M');
    if (!monthly) return {};

  // precio base anual = 12 * precio mensual
  const baseYearPrice = monthly.product.pricePerYear ;

  const discounts: Record<string, { absolute: number; percent: number }> = {};

  packages.forEach(pkg => {
    if (pkg.identifier === monthly.identifier) return;

    let otherYearPrice = 0;

    switch (pkg.product.subscriptionPeriod) {
      case 'P6M':
        // precio semestral * 2
        otherYearPrice = pkg.product.pricePerYear ;
        break;
      case 'P1Y':
        // precio anual directo
        otherYearPrice = pkg.product.pricePerYear;
        break;
      default:
        return;
    }

    const absolute = baseYearPrice - otherYearPrice;
    const percent = (absolute / baseYearPrice) * 100;

    discounts[pkg.identifier] = {
      absolute: parseFloat(absolute.toFixed(2)),
      percent: parseFloat(percent.toFixed(2)),
    };
  });
console.log('Calculated discounts:', discounts);

  return this.discounts = discounts;
}
}