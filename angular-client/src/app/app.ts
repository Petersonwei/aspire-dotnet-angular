import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-client');
  private keycloakService = inject(KeycloakService);
  private platformId = inject(PLATFORM_ID);

  get isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return this.keycloakService.isLoggedIn();
  }

  get username(): string {
    if (!isPlatformBrowser(this.platformId)) return 'Guest';
    return this.keycloakService.getUsername() || 'Guest';
  }

  login(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Login button clicked, attempting Keycloak login...');
      console.log('Keycloak initialized?', this.keycloakService.isLoggedIn !== undefined);
      this.keycloakService.login().catch(error => {
        console.error('Keycloak login failed:', error);
      });
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.keycloakService.logout();
    }
  }
}
