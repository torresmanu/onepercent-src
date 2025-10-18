import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent, IonRouterOutlet, IonImg } from '@ionic/angular/standalone';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    TranslateModule,
  ],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})


export class TabsComponent {
  selectedIndex = 0;
  tabRoutes = ['/private/home', '/private/activity', '/private/nutrition', '/private/stats'];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const idx = this.tabRoutes.findIndex(route => event.urlAfterRedirects.startsWith(route));
        if (idx !== -1) this.selectedIndex = idx;
      }
    });
  }

  get indicatorTransform() {
    return `translateX(${this.selectedIndex * 100}%)`;
  }

  onTabClick(idx: number) {
    this.selectedIndex = idx;
  }

  
}