import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {
    // Initialize settings on app start
    this.settingsService.initializeSettings();
  }

  initializeApp(): void {
    // Set up translations
    this.translate.addLangs(['en', 'sv']);
    this.translate.setDefaultLang('en');
    
    // Try to use browser language or default to English
    const browserLang = this.translate.getBrowserLang();
    const langToUse = browserLang && ['en', 'sv'].includes(browserLang) ? browserLang : 'en';
    this.translate.use(langToUse);
  }
}
