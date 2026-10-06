import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

interface IconSizeOption {
  size: number;
  label: string;
  dataUrl: string | null;
}

@Component({
  selector: 'app-favicon-generator',
  standalone: true,
  imports: [CommonModule, RouterLink, AdBannerComponent],
  templateUrl: './favicon-generator.component.html',
  styleUrl: './favicon-generator.component.css'
})
export class FaviconGeneratorComponent {
  public sourceFile = signal<File | null>(null);
  public originalPreview = signal<string | null>(null);
  public sizes = signal<IconSizeOption[]>([
    { size: 16, label: '16 × 16 (Browser Tab)', dataUrl: null },
    { size: 32, label: '32 × 32 (Standard Favicon)', dataUrl: null },
    { size: 48, label: '48 × 48 (Desktop Shortcut)', dataUrl: null },
    { size: 180, label: '180 × 180 (Apple Touch Icon)', dataUrl: null }
  ]);

  public onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.sourceFile.set(file);
      const url = URL.createObjectURL(file);
      this.originalPreview.set(url);
      this.generateIcons(url);
    }
  }

  private generateIcons(srcUrl: string): void {
    const img = new Image();
    img.onload = () => {
      const updated = this.sizes().map(opt => {
        const canvas = document.createElement('canvas');
        canvas.width = opt.size;
        canvas.height = opt.size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, opt.size, opt.size);
          return { ...opt, dataUrl: canvas.toDataURL('image/png') };
        }
        return opt;
      });
      this.sizes.set(updated);
    };
    img.src = srcUrl;
  }

  public downloadIcon(opt: IconSizeOption): void {
    if (!opt.dataUrl) return;
    const a = document.createElement('a');
    a.href = opt.dataUrl;
    a.download = `favicon-${opt.size}x${opt.size}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  public reset(): void {
    this.sourceFile.set(null);
    this.originalPreview.set(null);
    this.sizes.set([
      { size: 16, label: '16 × 16 (Browser Tab)', dataUrl: null },
      { size: 32, label: '32 × 32 (Standard Favicon)', dataUrl: null },
      { size: 48, label: '48 × 48 (Desktop Shortcut)', dataUrl: null },
      { size: 180, label: '180 × 180 (Apple Touch Icon)', dataUrl: null }
    ]);
  }
}
