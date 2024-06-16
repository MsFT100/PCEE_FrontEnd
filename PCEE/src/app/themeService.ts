import { Injectable } from '@angular/core';
import { LocalStorageService } from './LocalStorageService'; // Import the service


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private localStorageService: LocalStorageService) {}
  private darkThemeEnabledKey = 'darkThemeEnabled';

  isDarkTheme(): boolean {
    return this.localStorageService.getItem(this.darkThemeEnabledKey) === 'true';
  }

  setDarkTheme(enabled: boolean): void {
    this.localStorageService.setItem(this.darkThemeEnabledKey, enabled ? 'true' : 'false');
  }
}
