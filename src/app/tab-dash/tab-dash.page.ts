import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { SettingsService, Settings, UserSettings } from '../services/settings.service';

@Component({
  selector: 'app-tab-dash',
  templateUrl: 'tab-dash.page.html',
  styleUrls: ['tab-dash.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    TranslateModule
  ]
})
export class TabDashPage implements OnInit {
  settings: Settings | null = null;
  userSettings: UserSettings | null = null;

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private translate: TranslateService
  ) {
    addIcons({ star, starOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.loadSettings();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    this.settings = await this.settingsService.loadSettings();
    this.userSettings = await this.settingsService.loadUserSettings();
  }

  selectLevel(levelIndex: number): void {
    this.router.navigate(['/tabs/tab-play', levelIndex]);
  }

  translateLevel(label: string): string {
    return this.translate.instant('levels.' + label);
  }

  getStars(levelIndex: number): number {
    return this.userSettings?.levels[levelIndex]?.stars || 0;
  }

  getStarArray(): number[] {
    return [1, 2, 3];
  }
}
