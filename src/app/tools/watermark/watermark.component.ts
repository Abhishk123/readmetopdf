import { Component, ElementRef, ViewChild, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

@Component({
  selector: 'app-watermark',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './watermark.component.html',
  styleUrls: ['./watermark.component.css']
})
export class WatermarkComponent {
  @ViewChild('previewCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // State
  selectedImage = signal<HTMLImageElement | null>(null);
  imageName = signal<string>('watermarked-document.png');
  isDragging = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Watermark Settings
  watermarkText = signal<string>('FOR VERIFICATION ONLY');
  textColor = signal<string>('#dc2626'); // Red default
  opacity = signal<number>(55); // 55% opacity
  fontSize = signal<number>(36);
  repeatPattern = signal<boolean>(true); // Repeating diagonal pattern
  dateStamp = signal<boolean>(true); // Add today's date automatically

  // Quick Preset Templates
  presets = [
    { label: '🏨 Hotel Check-In', text: 'ONLY FOR HOTEL CHECK-IN' },
    { label: '📱 SIM Card Verification', text: 'ONLY FOR SIM ACTIVATION' },
    { label: '🏦 Bank Account', text: 'ONLY FOR BANK ACCOUNT OPENING' },
    { label: '💼 Job Application', text: 'ONLY FOR JOB APPLICATION' },
    { label: '🏠 Rental Agreement', text: 'ONLY FOR HOUSE RENTAL' },
    { label: '🔒 Verification Only', text: 'FOR VERIFICATION ONLY' }
  ];

  fullWatermarkText = computed(() => {
    let t = this.watermarkText().trim().toUpperCase();
    if (this.dateStamp()) {
      const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      t += ` • ${today.toUpperCase()}`;
    }
    return t;
  });

  applyPreset(presetText: string) {
    this.watermarkText.set(presetText);
    this.renderCanvas();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.loadFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.loadFile(event.dataTransfer.files[0]);
    }
  }

  loadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    this.errorMessage.set('');
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    this.imageName.set(`${baseName}-protected.png`);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.selectedImage.set(img);
        // Defer render slightly to allow canvas view initialization
        setTimeout(() => this.renderCanvas(), 50);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  renderCanvas() {
    const img = this.selectedImage();
    if (!img || !this.canvasRef) return;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match source image
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    // 1. Draw original document image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 2. Setup Watermark styling
    const text = this.fullWatermarkText();
    if (!text) return;

    const op = this.opacity() / 100;
    ctx.save();
    ctx.globalAlpha = op;
    ctx.fillStyle = this.textColor();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(2, Math.round(this.fontSize() / 14));

    // Dynamic scale based on image dimensions
    const scale = Math.max(1, canvas.width / 1000);
    const calculatedFontSize = Math.round(this.fontSize() * scale);
    ctx.font = `bold ${calculatedFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (this.repeatPattern()) {
      // Draw grid of diagonal watermarks across entire document
      const angle = -30 * (Math.PI / 180);
      const stepX = calculatedFontSize * 12;
      const stepY = calculatedFontSize * 6;

      ctx.rotate(angle);

      // Expand loop range to cover rotated corners
      const maxDim = Math.max(canvas.width, canvas.height) * 2;
      for (let y = -maxDim; y < maxDim; y += stepY) {
        for (let x = -maxDim; x < maxDim; x += stepX) {
          ctx.strokeText(text, x, y);
          ctx.fillText(text, x, y);
        }
      }
    } else {
      // Single large center diagonal watermark
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-30 * (Math.PI / 180));
      ctx.strokeText(text, 0, 0);
      ctx.fillText(text, 0, 0);
    }

    ctx.restore();
  }

  downloadProtectedImage() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;

    const link = document.createElement('a');
    link.download = this.imageName();
    link.href = canvas.toDataURL('image/png', 0.95);
    link.click();
  }

  resetImage() {
    this.selectedImage.set(null);
    this.watermarkText.set('FOR VERIFICATION ONLY');
  }
}
