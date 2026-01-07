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
import { medal, medalOutline } from 'ionicons/icons';
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
    addIcons({ medal, medalOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.loadSettings();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    this.settings = await this.settingsService.loadSettings();
    // Force reload from storage to get latest stars
    this.userSettings = await this.settingsService.loadUserSettings(true);
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

  getMedalColor(levelIndex: number): string {
    const stars = this.getStars(levelIndex);
    if (stars >= 3) return 'gold';
    if (stars >= 2) return 'silver';
    if (stars >= 1) return 'bronze';
    return 'none';
  }

  hasMedal(levelIndex: number): boolean {
    return this.getStars(levelIndex) > 0;
  }
}
