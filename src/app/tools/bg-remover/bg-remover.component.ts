import { Component, ElementRef, ViewChild, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';
import { removeBackground } from '@imgly/background-removal';

export type BgMode = 'transparent' | 'color' | 'gradient';

@Component({
  selector: 'app-bg-remover',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './bg-remover.component.html',
  styleUrls: ['./bg-remover.component.css']
})
export class BgRemoverComponent {
  @ViewChild('outputCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // Uploaded & Processed State
  originalImageUrl = signal<string | null>(null);
  originalFile = signal<File | null>(null);
  cutoutBlob = signal<Blob | null>(null);
  cutoutImg = signal<HTMLImageElement | null>(null);

  // Processing & Loading State
  isProcessing = signal<boolean>(false);
  progressStage = signal<string>('');
  progressPercent = signal<number>(0);
  errorMessage = signal<string>('');
  isDragging = signal<boolean>(false);

  // Customization Options
  bgMode = signal<BgMode>('transparent');
  selectedColor = signal<string>('#ffffff');
  customHex = signal<string>('#ffffff');
  gradientPreset = signal<string>('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
  sliderPosition = signal<number>(50); // Before/After slider (0-100)

  // Quick Color Presets
  colorPresets = [
    { name: 'Pure White (Passport/Visa)', hex: '#ffffff' },
    { name: 'Light Blue (Official ID)', hex: '#e0f2fe' },
    { name: 'Studio Gray', hex: '#f1f5f9' },
    { name: 'Dark Slate', hex: '#1e293b' },
    { name: 'Vibrant Red', hex: '#ef4444' },
    { name: 'Emerald Green', hex: '#10b981' },
    { name: 'Royal Purple', hex: '#8b5cf6' },
    { name: 'Sunset Amber', hex: '#f59e0b' }
  ];

  // Quick Gradient Presets
  gradientPresets = [
    { name: 'Cosmic Purple', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Sunset Glow', css: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%)' },
    { name: 'Ocean Blue', css: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)' },
    { name: 'Deep Cyber', css: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }
  ];

  constructor() {
    // Re-draw canvas whenever customization changes
    effect(() => {
      const mode = this.bgMode();
      const color = this.selectedColor();
      const grad = this.gradientPreset();
      const img = this.cutoutImg();
      if (img) {
        this.renderCanvas();
      }
    });
  }

  // --- File Upload & Processing ---

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  async handleFile(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    this.errorMessage.set('');
    this.originalFile.set(file);

    // Create preview for original image
    const reader = new FileReader();
    reader.onload = (e) => {
      this.originalImageUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Run AI segmentation
    await this.processImage(file);
  }

  async processImage(file: File | Blob): Promise<void> {
    this.isProcessing.set(true);
    this.progressStage.set('Initializing WebGPU AI Model...');
    this.progressPercent.set(10);
    this.cutoutBlob.set(null);
    this.cutoutImg.set(null);

    try {
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            this.progressPercent.set(Math.max(15, Math.min(95, pct)));
          }
          if (key.includes('fetch')) {
            this.progressStage.set('Loading AI Neural Network into Device GPU...');
          } else if (key.includes('compute') || key.includes('process')) {
            this.progressStage.set('Running AI Segmentation on Device GPU...');
          }
        }
      });

      this.cutoutBlob.set(blob);
      this.progressPercent.set(100);
      this.progressStage.set('AI Processing Complete!');

      // Load resulting blob into an HTMLImageElement
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        this.cutoutImg.set(img);
        this.isProcessing.set(false);
        this.renderCanvas();
      };
      img.src = url;
    } catch (err: any) {
      console.error('[AI Background Removal Error]:', err);
      this.errorMessage.set('AI Processing failed: ' + (err?.message || 'Please try another photo.'));
      this.isProcessing.set(false);
    }
  }

  // Sample Images to try in 1-click
  async loadSample(url: string): Promise<void> {
    try {
      this.errorMessage.set('');
      const res = await fetch(url);
      const blob = await res.blob();
      this.originalImageUrl.set(url);
      await this.processImage(blob);
    } catch (e) {
      this.errorMessage.set('Could not load sample image. Please upload your own photo.');
    }
  }

  // --- Canvas Rendering with Custom Backgrounds ---

  renderCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    const img = this.cutoutImg();
    if (!canvas || !img) return;

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply Background
    if (this.bgMode() === 'color') {
      ctx.fillStyle = this.selectedColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (this.bgMode() === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      // Simple parse for 2 gradient colors
      grad.addColorStop(0, '#667eea');
      grad.addColorStop(1, '#764ba2');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw Cutout Image on top
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  // Download Output File
  downloadImage(format: 'png' | 'jpg' = 'png'): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const link = document.createElement('a');
    const baseName = this.originalFile()?.name?.replace(/\.[^/.]+$/, '') || 'bg-removed';

    if (format === 'png' && this.bgMode() === 'transparent') {
      link.download = `${baseName}-transparent.png`;
      link.href = canvas.toDataURL('image/png');
    } else {
      link.download = `${baseName}-${this.bgMode()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
    }

    link.click();
  }

  resetAll(): void {
    this.originalImageUrl.set(null);
    this.originalFile.set(null);
    this.cutoutBlob.set(null);
    this.cutoutImg.set(null);
    this.errorMessage.set('');
    this.progressPercent.set(0);
    this.bgMode.set('transparent');
  }
}
