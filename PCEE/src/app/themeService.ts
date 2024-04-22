import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkThemeEnabledKey = 'darkThemeEnabled';

  isDarkTheme(): boolean {
    return localStorage.getItem(this.darkThemeEnabledKey) === 'true';
  }

  setDarkTheme(enabled: boolean): void {
    localStorage.setItem(this.darkThemeEnabledKey, enabled ? 'true' : 'false');
  }
}
