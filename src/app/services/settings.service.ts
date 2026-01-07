import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface LevelSettings {
  level: number;
  label: string;
}

export interface UserLevelSettings {
  level: number;
  stars: number;
  stats: unknown[];
}

export interface Settings {
  version: string;
  levels: LevelSettings[];
}

export interface UserSettings {
  version: string;
  sound: boolean;
  timed: boolean;
  levels: UserLevelSettings[];
}

const CURRENT_VERSION = '2.0.0';
const SETTINGS_KEY = 'mattemix_settings';
const USER_SETTINGS_KEY = 'mattemix_user_settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings: Settings | null = null;
  private userSettings: UserSettings | null = null;

  constructor() {}

  /**
   * Initialize settings on app startup
   */
  async initializeSettings(): Promise<void> {
    await this.loadSettings();
    await this.loadUserSettings();
    await this.checkUpgrade();
  }

  /**
   * Get default settings
   */
  getDefaultSettings(): Settings {
    return {
      version: CURRENT_VERSION,
      levels: Array.from({ length: 20 }, (_, i) => ({
        level: i + 1,
        label: `${i + 1}_table`
      }))
    };
  }

  /**
   * Get default user settings
   */
  getDefaultUserSettings(): UserSettings {
    return {
      version: CURRENT_VERSION,
      sound: true,
      timed: true,
      levels: Array.from({ length: 20 }, (_, i) => ({
        level: i + 1,
        stars: 0,
        stats: []
      }))
    };
  }

  /**
   * Load settings from storage
   */
  async loadSettings(): Promise<Settings> {
    try {
      const { value } = await Preferences.get({ key: SETTINGS_KEY });
      if (value) {
        this.settings = JSON.parse(value);
      } else {
        this.settings = this.getDefaultSettings();
        await this.saveSettings();
      }
    } catch {
      this.settings = this.getDefaultSettings();
    }
    return this.settings!;
  }

  /**
   * Load user settings from storage
   */
  async loadUserSettings(forceReload: boolean = false): Promise<UserSettings> {
    // Always reload from storage if forceReload is true, or if not cached
    if (forceReload || !this.userSettings) {
      try {
        const { value } = await Preferences.get({ key: USER_SETTINGS_KEY });
        if (value) {
          this.userSettings = JSON.parse(value);
        } else {
          this.userSettings = this.getDefaultUserSettings();
          await this.saveUserSettings();
        }
      } catch {
        this.userSettings = this.getDefaultUserSettings();
      }
    }
    return this.userSettings!;
  }

  /**
   * Get current settings (sync)
   */
  getSettings(): Settings {
    return this.settings || this.getDefaultSettings();
  }

  /**
   * Get current user settings (sync)
   */
  getUserSettings(): UserSettings {
    return this.userSettings || this.getDefaultUserSettings();
  }

  /**
   * Save settings to storage
   */
  async saveSettings(): Promise<void> {
    if (this.settings) {
      await Preferences.set({
        key: SETTINGS_KEY,
        value: JSON.stringify(this.settings)
      });
    }
  }

  /**
   * Save user settings to storage
   */
  async saveUserSettings(): Promise<void> {
    if (this.userSettings) {
      await Preferences.set({
        key: USER_SETTINGS_KEY,
        value: JSON.stringify(this.userSettings)
      });
    }
  }

  /**
   * Update timed setting
   */
  async setTimed(timed: boolean): Promise<void> {
    if (this.userSettings) {
      this.userSettings.timed = timed;
      await this.saveUserSettings();
    }
  }

  /**
   * Update stars for a level
   */
  async updateLevelStars(levelIndex: number, stars: number): Promise<void> {
    if (this.userSettings && levelIndex >= 0 && levelIndex < this.userSettings.levels.length) {
      if (stars > this.userSettings.levels[levelIndex].stars) {
        this.userSettings.levels[levelIndex].stars = stars;
        await this.saveUserSettings();
      }
    }
  }

  /**
   * Reset all user progress
   */
  async resetProgress(): Promise<void> {
    this.userSettings = this.getDefaultUserSettings();
    await this.saveUserSettings();
  }

  /**
   * Check and perform version upgrade
   */
  private async checkUpgrade(): Promise<void> {
    if (!this.settings || !this.userSettings) return;

    const existingVersion = this.settings.version;

    if (existingVersion !== CURRENT_VERSION) {
      // Migration logic for older versions
      switch (existingVersion) {
        case '1.0.0':
          this.upgradeFrom_1_0_0();
          this.upgradeFrom_1_1_0();
          this.upgradeFrom_1_2_0();
          break;
        case '1.1.0':
          this.upgradeFrom_1_1_0();
          this.upgradeFrom_1_2_0();
          break;
        case '1.2.0':
          this.upgradeFrom_1_2_0();
          break;
        case '1.3.0':
          // No migration needed, just update version
          break;
        default:
          // Unknown version, reset to defaults
          this.settings = this.getDefaultSettings();
          this.userSettings = this.getDefaultUserSettings();
      }

      // Update versions
      this.settings.version = CURRENT_VERSION;
      this.userSettings.version = CURRENT_VERSION;
      await this.saveSettings();
      await this.saveUserSettings();
    }
  }

  private upgradeFrom_1_0_0(): void {
    // 1.0.0 => 1.1.0: Add timed setting to userSettings
    if (this.userSettings && this.userSettings.timed === undefined) {
      this.userSettings.timed = true;
    }
  }

  private upgradeFrom_1_1_0(): void {
    // 1.1.0 => 1.2.0: Nothing specific
  }

  private upgradeFrom_1_2_0(): void {
    // 1.2.0 => 1.3.0: Update settings with labels
    this.settings = this.getDefaultSettings();
  }
}
