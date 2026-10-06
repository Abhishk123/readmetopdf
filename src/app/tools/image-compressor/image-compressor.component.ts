import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

interface CompressedImageResult {
  originalFile: File;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalUrl: string;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressedUrl: string;
  reductionPercent: number;
  fileName: string;
}

@Component({
  selector: 'app-image-compressor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './image-compressor.component.html',
  styleUrl: './image-compressor.component.css'
})
export class ImageCompressorComponent {
  // Quality slider (10 to 100)
  public quality = signal<number>(75);
  // Max dimension constraint (0 means original)
  public maxDimension = signal<number>(1920);
  // Output format
  public outputFormat = signal<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  public isProcessing = signal<boolean>(false);
  public isDragging = signal<boolean>(false);
  public result = signal<CompressedImageResult | null>(null);
  public errorMessage = signal<string>('');

  // Target KB quick presets
  public targetKb = signal<number | null>(null);

  public formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  public onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(true);
  }

  public onDragLeave(): void {
    this.isDragging.set(false);
  }

  public onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(false);
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      this.handleFile(e.dataTransfer.files[0]);
    }
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
      this.errorMessage.set('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const originalUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      this.result.set({
        originalFile: file,
        originalSize: file.size,
        originalWidth: img.width,
        originalHeight: img.height,
        originalUrl: originalUrl,
        compressedBlob: null,
        compressedSize: 0,
        compressedUrl: '',
        reductionPercent: 0,
        fileName: file.name
      });

      // Default format to match input where sensible
      if (file.type === 'image/png') {
        this.outputFormat.set('image/png');
      } else if (file.type === 'image/webp') {
        this.outputFormat.set('image/webp');
      } else {
        this.outputFormat.set('image/jpeg');
      }

      this.compressImage();
    };
    img.onerror = () => {
      this.errorMessage.set('Unable to read this image. Please try another file.');
    };
    img.src = originalUrl;
  }

  public onSettingChange(): void {
    if (this.result()) {
      this.compressImage();
    }
  }

  public setPresetQuality(val: number): void {
    this.quality.set(val);
    this.onSettingChange();
  }

  public compressImage(): void {
    const current = this.result();
    if (!current) return;

    this.isProcessing.set(true);

    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const maxDim = this.maxDimension();

      // Downscale if exceeds maxDimension
      if (maxDim > 0 && (width > maxDim || height > maxDim)) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        this.isProcessing.set(false);
        this.errorMessage.set('Canvas rendering is not supported on this browser.');
        return;
      }

      // If converting PNG with transparency to JPEG, fill white background
      if (this.outputFormat() === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const q = this.quality() / 100;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedUrl = URL.createObjectURL(blob);
            const savedBytes = current.originalSize - blob.size;
            const reduction = Math.max(0, Math.round((savedBytes / current.originalSize) * 100));

            // Generate clean extension
            const ext = this.outputFormat() === 'image/jpeg' ? '.jpg' : this.outputFormat() === 'image/png' ? '.png' : '.webp';
            const baseName = current.originalFile.name.substring(0, current.originalFile.name.lastIndexOf('.')) || 'image';

            this.result.set({
              ...current,
              compressedBlob: blob,
              compressedSize: blob.size,
              compressedUrl: compressedUrl,
              reductionPercent: reduction,
              fileName: `${baseName}-compressed${ext}`
            });
          }
          this.isProcessing.set(false);
        },
        this.outputFormat(),
        q
      );
    };
    img.src = current.originalUrl;
  }

  public downloadCompressed(): void {
    const res = this.result();
    if (!res || !res.compressedUrl) return;

    const link = document.createElement('a');
    link.href = res.compressedUrl;
    link.download = res.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public reset(): void {
    this.result.set(null);
    this.errorMessage.set('');
  }
}
