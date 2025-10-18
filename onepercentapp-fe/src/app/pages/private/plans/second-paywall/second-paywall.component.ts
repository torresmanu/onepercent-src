import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonButton, IonIcon, IonFooter, NavController } from "@ionic/angular/standalone";
import { TranslateModule } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { StorageKey } from '@src/app/core/interfaces/storage';
import { StorageService } from '@src/app/services/storage.service';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { PlanCardComponentPaywall2 } from "./plan-card/plan-card-paywall2.component";


@Component({
  standalone: true,
  imports: [IonFooter,
    IonIcon,
    IonButton,
    IonContent,
    CommonModule,
    TranslateModule, PlanCardComponentPaywall2],
  selector: 'app-second-paywall',
  templateUrl: './second-paywall.component.html',
  styleUrls: ['./second-paywall.component.scss'],
})


export class SecondPaywallComponent implements OnInit {
  private platformService = inject(Platform);
  private  navCtrl = inject(NavController);
  private storageService = inject(StorageService);
  private platformName = Capacitor.getPlatform();

  availablePackages: any[] = [];
  discounts: any = {};
  offerings: any = null;
  isConfigured = false;
  selectedPlanIndex: number | null = null;
  userData: any;
  selectedPlan: any = null;
  RevenueCatKey = {
    IOS: 'appl_MDJCjlGoKibxdRRHJGGzOLHBKje',
    ANDROID: 'goog_hWfwhYCKBXaEfzFwRckWXvDywIZ',
  };

  plans: any[] = [
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

      this.plans = this.availablePackages.map(pkg => ({
        duration: pkg?.product?.title,
        price: `${pkg?.product?.price}  ${pkg?.product?.currencyCode}/${pkg?.packageType}`, // <-- string
        billing: pkg?.packageType,
        discount: pkg?.product?.identifier,
        freeTrial: pkg?.product?.freeTrial,
      }));

    } catch (err) {
      console.error('🛑 Error configurando RevenueCat:', err);
    }
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

      const entitlement = customerInfo.entitlements.active['Fiber'];
      if (entitlement) {
        console.log('🎉 Entitlement activa: Fiber');
        await Purchases.logOut();
      } else {
        console.warn('⚠️ No se activó la suscripción');
      }
    } catch (error) {
      console.error('🛑 Error en la compra:', error);
    }
  }


  selectPlan(index: number) {
    this.selectedPlanIndex = index;
  }

  getCheckboxIcon(index: number): string {
    return this.selectedPlanIndex === index ? 'checkmark-circle' : 'ellipse-outline';
  }

  thirdSelector(): boolean {
    return this.selectedPlanIndex !== null && this.plans[this.selectedPlanIndex]?.duration === '12 meses';
  }

  goToHome() {
    this.navCtrl.navigateForward('/private/home');
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



