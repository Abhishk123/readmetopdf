import { Component, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.css'
})
export class ColorPickerComponent implements AfterViewInit {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  public activeHex = signal<string>('#2563eb');
  public activeRgb = signal<string>('rgb(37, 99, 235)');
  public activeHsl = signal<string>('hsl(221, 83%, 53%)');
  public copiedFormat = signal<string>('');
  public extractedPalette = signal<string[]>(['#1e293b', '#2563eb', '#38bdf8', '#10b981', '#f59e0b']);
  public hasImage = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.drawSampleImage();
  }

  private drawSampleImage(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw vibrant gradient background sample
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(0.3, '#8b5cf6');
    grad.addColorStop(0.6, '#ec4899');
    grad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative circles
    ctx.beginPath();
    ctx.arc(100, 100, 60, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(320, 160, 80, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fill();

    this.hasImage.set(true);
  }

  public onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const img = new Image();
      img.onload = () => {
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = Math.min(img.width, 800);
        canvas.height = (img.height * canvas.width) / img.width;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.hasImage.set(true);
        this.extractDominantPalette(ctx, canvas.width, canvas.height);
      };
      img.src = URL.createObjectURL(file);
    }
  }

  public onCanvasClick(e: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    this.activeHex.set(hex);
    this.activeRgb.set(`rgb(${r}, ${g}, ${b})`);
    this.activeHsl.set(this.rgbToHsl(r, g, b));
  }

  private extractDominantPalette(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // Sample across grid points
    const points = [
      { x: w * 0.2, y: h * 0.2 },
      { x: w * 0.5, y: h * 0.3 },
      { x: w * 0.8, y: h * 0.5 },
      { x: w * 0.3, y: h * 0.7 },
      { x: w * 0.7, y: h * 0.8 }
    ];

    const colors = points.map(pt => {
      const pixel = ctx.getImageData(Math.floor(pt.x), Math.floor(pt.y), 1, 1).data;
      return '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
    });

    this.extractedPalette.set(colors);
  }

  public selectPaletteColor(hex: string): void {
    this.activeHex.set(hex);
    // Parse hex to rgb
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    this.activeRgb.set(`rgb(${r}, ${g}, ${b})`);
    this.activeHsl.set(this.rgbToHsl(r, g, b));
  }

  private rgbToHsl(r: number, g: number, b: number): string {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  public copyColor(val: string, format: string): void {
    navigator.clipboard.writeText(val).then(() => {
      this.copiedFormat.set(format);
      setTimeout(() => this.copiedFormat.set(''), 2000);
    });
  }
}
