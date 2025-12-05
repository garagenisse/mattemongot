import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel,
  IonToggle,
  IonButton,
  AlertController
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingsService, UserSettings } from '../services/settings.service';

@Component({
  selector: 'app-tab-settings',
  templateUrl: 'tab-settings.page.html',
  styleUrls: ['tab-settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonLabel,
    IonToggle,
    IonButton,
    TranslateModule
  ]
})
export class TabSettingsPage implements OnInit {
  userSettings: UserSettings | null = null;
  version = '2.0.0';

  constructor(
    private settingsService: SettingsService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadSettings();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    this.userSettings = await this.settingsService.loadUserSettings();
  }

  async onTimedChange(event: CustomEvent): Promise<void> {
    const timed = event.detail.checked;
    await this.settingsService.setTimed(timed);
  }

  async showConfirm(): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translate.instant('reset_panel.title'),
      message: this.translate.instant('reset_panel.message'),
      buttons: [
        {
          text: this.translate.instant('buttons.cancel'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('buttons.ok'),
          handler: async () => {
            await this.reset();
          }
        }
      ]
    });

    await alert.present();
  }

  private async reset(): Promise<void> {
    await this.settingsService.resetProgress();
    await this.loadSettings();
  }
}
