import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

@Component({
  selector: 'app-image-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './image-converter.component.html',
  styleUrl: './image-converter.component.css'
})
export class ImageConverterComponent {
  public targetFormat = signal<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  public quality = signal<number>(85);
  public originalFile = signal<File | null>(null);
  public originalPreview = signal<string | null>(null);
  public convertedUrl = signal<string | null>(null);
  public convertedBlob = signal<Blob | null>(null);
  public isProcessing = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  public onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  public handleFile(file: File): void {
    this.errorMessage.set('');
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please choose a valid image file.');
      return;
    }

    this.originalFile.set(file);
    const url = URL.createObjectURL(file);
    this.originalPreview.set(url);
    this.convertImage();
  }

  public convertImage(): void {
    const file = this.originalFile();
    if (!file) return;

    this.isProcessing.set(true);
    this.errorMessage.set('');

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        this.isProcessing.set(false);
        this.errorMessage.set('Canvas not supported in this browser.');
        return;
      }

      // If converting transparent image to JPEG, fill white background
      if (this.targetFormat() === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const q = this.quality() / 100;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            this.convertedBlob.set(blob);
            this.convertedUrl.set(URL.createObjectURL(blob));
          }
          this.isProcessing.set(false);
        },
        this.targetFormat(),
        q
      );
    };
    img.onerror = () => {
      this.isProcessing.set(false);
      this.errorMessage.set('Failed to read image file.');
    };
    img.src = this.originalPreview()!;
  }

  public downloadConverted(): void {
    const url = this.convertedUrl();
    const orig = this.originalFile();
    if (!url || !orig) return;

    const ext = this.targetFormat() === 'image/jpeg' ? '.jpg' : this.targetFormat() === 'image/png' ? '.png' : '.webp';
    const base = orig.name.substring(0, orig.name.lastIndexOf('.')) || 'converted';

    const a = document.createElement('a');
    a.href = url;
    a.download = `${base}-converted${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  public reset(): void {
    this.originalFile.set(null);
    this.originalPreview.set(null);
    this.convertedUrl.set(null);
    this.convertedBlob.set(null);
  }
}
