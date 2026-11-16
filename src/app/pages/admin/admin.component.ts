import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService, AdFormatsConfig } from '../../services/admin.service';
import { TOOLS_CONFIG } from '../../config/tools.config';
import { ToolItem } from '../../models/tool.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  public adminService = inject(AdminService);
  public toolsList: ToolItem[] = TOOLS_CONFIG;

  public usernameInput = signal<string>('');
  public passwordInput = signal<string>('');
  public loginError = signal<string>('');

  public handleLogin(): void {
    const success = this.adminService.login(this.usernameInput(), this.passwordInput());
    if (success) {
      this.loginError.set('');
      this.passwordInput.set('');
    } else {
      this.loginError.set('Invalid admin credentials. Please check your username and password.');
    }
  }

  public handleLogout(): void {
    this.adminService.logout();
  }

  public toggleAds(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.adminService.setAdsEnabled(checked);
  }

  public setProvider(provider: 'custom' | 'adsense' | 'monetag' | 'disabled'): void {
    if (provider === 'disabled') {
      this.adminService.setAdsEnabled(false);
      this.adminService.setAdProvider('disabled');
    } else {
      this.adminService.setAdsEnabled(true);
      this.adminService.setAdProvider(provider);
    }
  }

  public get visibleToolsCount(): number {
    return this.toolsList.filter(t => this.adminService.isToolVisible(t.id)).length;
  }

  public get hiddenToolsCount(): number {
    return this.toolsList.length - this.visibleToolsCount;
  }

  public toggleFormat(format: keyof AdFormatsConfig, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.adminService.setAdFormat(format, checked);
  }

  public toggleWhatsApp(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.adminService.setWhatsAppBotEnabled(checked);
  }

  public toggleTool(toolId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.adminService.setToolVisibility(toolId, checked);
  }
}
