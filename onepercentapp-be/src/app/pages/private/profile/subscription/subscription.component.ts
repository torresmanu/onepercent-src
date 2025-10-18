import { Component, inject, OnInit } from '@angular/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonLabel, IonContent, IonIcon,   NavController,
 } from "@ionic/angular/standalone";
import { Platform } from '@ionic/angular';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { firstValueFrom } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from '@src/app/core/interfaces/storage';

@Component({
  standalone: true,
  imports: [IonIcon, IonContent, IonLabel, IonButton, CommonModule, HeaderComponent,TranslateModule],
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  revenueCatUserData: any
  userData: any;
    offerings: any = null;
  availablePackages: any[] = [];
  platformName = Capacitor.getPlatform(); 
  RevenueCatKey = {
    IOS: 'appl_MDJCjlGoKibxdRRHJGGzOLHBKje',
    ANDROID: 'goog_hWfwhYCKBXaEfzFwRckWXvDywIZ'
  };
  isConfigured = false;
  private storageService = inject(StorageService);
  private navCtrl = inject(NavController);

  constructor(private platformService: Platform) {}

  
    async ngOnInit() {
      await this.platformService.ready();
  
      this.userData = await firstValueFrom(this.storageService.get(StorageKey.userData));
      const userId = this.userData?.id || 'user_123';
  console.log('👤 User ID:', userId);
      await this.configureRevenueCat(userId);
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
      this.revenueCatUserData = info;
      const offerings = await Purchases.getOfferings();
      this.offerings = offerings;
      this.availablePackages = offerings.current?.availablePackages ?? [];
      console.log('📦 Paquetes disponibles:', this.availablePackages);

      if (this.platformName === 'ios') {
        alert(
          '🚨 Atención: La integración de RevenueCat para esta mockeada para un solo plan'
        );
      }
    } catch (err) {
      console.error('🛑 Error configurando RevenueCat:', err);
    }
  }

  async subscription() {
   this.navCtrl.navigateForward('/private/profile/choose-plan');
  }
// === Helpers para mapear y mostrar en el HTML ===

// 1) Entitlement activo o el primero disponible
get entitlement(): any {
  const all = this.revenueCatUserData?.customerInfo?.entitlements?.all || {};
  // Prioriza "Premium" si existe, si no coge el primero
  return all['Premium'] ?? Object.values(all)[0] ?? null;
}

// 2) ID de producto ligado al entitlement
get productId(): string | null {
  return this.entitlement?.productIdentifier ?? null;
}

// 3) Objeto de suscripción en subscriptionsByProductIdentifier
get subscriptionObj(): any {
  const subs = this.revenueCatUserData?.customerInfo?.subscriptionsByProductIdentifier || {};
  return this.productId ? subs[this.productId] ?? null : null;
}

// 4) Datos del producto desde offerings (para saber periodo e intro)
get productFromOfferings(): any {
  if (!this.offerings?.current?.availablePackages?.length || !this.productId) return null;
  const pkg = this.offerings.current.availablePackages.find(
    (p: any) => p?.product?.identifier === this.productId
  );
  return pkg?.product ?? null;
}

// 5) Etiqueta del plan (tu UI lo llama "onepercent pro")
get planLabel(): string {
  // Si prefieres leer de product.title, usa: this.productFromOfferings?.title ?? 'onepercent pro'
  return 'onepercent pro';
}

// 6) Periodicidad (Mensual / Anual / Semestral) mapeando ISO 8601 de RevenueCat
get billingLabel(): string {
  const period = this.productFromOfferings?.subscriptionPeriod; // ej: 'P1M' | 'P1Y' | 'P6M'
  switch (period) {
    case 'P1Y': return 'Anual';
    case 'P6M': return 'Semestral';
    case 'P1M': return 'Mensual';
    default:    return '—';
  }
}

// 7) Estado: detecta prueba gratuita si hay introPrice con 0 y la suscripción está activa
get statusLabel(): string {
  const isActive = !!this.entitlement?.isActive;
  const willRenew = !!this.entitlement?.willRenew;
  const intro = this.productFromOfferings?.introPrice; // { price, period... }
  const isTrialNow =
    !!intro &&
    (intro.price === 0 || intro.price === 0.0) &&
    isActive;

  if (isTrialNow) return 'Prueba gratuita';
  if (isActive && willRenew) return 'Activa';
  if (isActive && !willRenew) return 'Activa (no renovará)';
  return 'Inactiva';
}

// 8) Próximo pago = fecha de expiración cuando willRenew = true (siguiente renovación)
get nextPaymentLabel(): string {
  const expISO = this.entitlement?.expirationDate ?? this.subscriptionObj?.expiresDate ?? null;
  if (!expISO) return '—';
  const d = new Date(expISO);
  // Formato dd/mm/yyyy
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
}