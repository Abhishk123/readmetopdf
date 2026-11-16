import { Component, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

type BarcodeTab = 'qr' | 'barcode1d';

@Component({
  selector: 'app-barcode-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './barcode-generator.component.html',
  styleUrl: './barcode-generator.component.css'
})
export class BarcodeGeneratorComponent implements AfterViewInit {
  @ViewChild('qrCanvas') qrCanvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('barcodeSvg') barcodeSvgRef?: ElementRef<SVGElement>;

  public activeTab = signal<BarcodeTab>('qr');

  // QR Code Inputs
  public qrText = signal<string>('https://www.jsnsworks.site');
  public qrSize = signal<number>(280);
  public qrDarkColor = signal<string>('#4f46e5');
  public qrLightColor = signal<string>('#ffffff');
  public qrCorrectionLevel = signal<'L' | 'M' | 'Q' | 'H'>('M');

  // 1D Barcode Inputs
  public barcodeValue = signal<string>('123456789012');
  public barcodeFormat = signal<string>('CODE128');
  public barcodeWidth = signal<number>(2);
  public barcodeHeight = signal<number>(80);
  public barcodeLineColor = signal<string>('#0f172a');
  public barcodeBgColor = signal<string>('#ffffff');
  public barcodeShowText = signal<boolean>(true);

  // Status
  public copiedMessage = signal<string>('');
  public barcodeError = signal<string>('');

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderQrCode();
    }, 100);
  }

  public setTab(tab: BarcodeTab): void {
    this.activeTab.set(tab);
    setTimeout(() => {
      if (tab === 'qr') {
        this.renderQrCode();
      } else {
        this.renderBarcode1D();
      }
    }, 50);
  }

  public onGenerateQr(): void {
    this.renderQrCode();
    this.showCopied('QR code updated!');
  }

  public onGenerateBarcode(): void {
    this.renderBarcode1D();
    if (!this.barcodeError()) {
      this.showCopied('Barcode updated!');
    }
  }

  public renderQrCode(): void {
    if (!this.qrCanvasRef?.nativeElement) return;
    const canvas = this.qrCanvasRef.nativeElement;
    const text = this.qrText().trim() || 'https://www.jsnsworks.site';

    QRCode.toCanvas(canvas, text, {
      width: this.qrSize(),
      margin: 2,
      color: {
        dark: this.qrDarkColor(),
        light: this.qrLightColor()
      },
      errorCorrectionLevel: this.qrCorrectionLevel()
    }, (err) => {
      if (err) {
        console.error('QR Render Error:', err);
      }
    });
  }

  public renderBarcode1D(): void {
    if (!this.barcodeSvgRef?.nativeElement) return;
    const svg = this.barcodeSvgRef.nativeElement;
    const val = this.barcodeValue().trim() || '12345678';

    try {
      this.barcodeError.set('');
      JsBarcode(svg, val, {
        format: this.barcodeFormat(),
        width: this.barcodeWidth(),
        height: this.barcodeHeight(),
        displayValue: this.barcodeShowText(),
        lineColor: this.barcodeLineColor(),
        background: this.barcodeBgColor(),
        margin: 12,
        font: 'monospace',
        fontSize: 14
      });
    } catch (err: any) {
      this.barcodeError.set(err?.message || 'Invalid barcode characters for selected format.');
    }
  }

  public downloadQrPng(): void {
    if (!this.qrCanvasRef?.nativeElement) return;
    const canvas = this.qrCanvasRef.nativeElement;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    this.showCopied('QR Code downloaded as PNG!');
  }

  public downloadBarcodeSvg(): void {
    if (!this.barcodeSvgRef?.nativeElement) return;
    const svgEl = this.barcodeSvgRef.nativeElement;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `barcode-${this.barcodeFormat()}-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    this.showCopied('Barcode downloaded as vector SVG!');
  }

  public downloadBarcodePng(): void {
    if (!this.barcodeSvgRef?.nativeElement) return;
    const svgEl = this.barcodeSvgRef.nativeElement;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const URLObj = window.URL || window.webkitURL || window;
    const blobURL = URLObj.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width || 400;
      canvas.height = image.height || 160;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = this.barcodeBgColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `barcode-${this.barcodeFormat()}-${Date.now()}.png`;
        link.href = pngUrl;
        link.click();
        this.showCopied('Barcode downloaded as PNG!');
      }
      URLObj.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  }

  private showCopied(msg: string): void {
    this.copiedMessage.set(msg);
    setTimeout(() => {
      this.copiedMessage.set('');
    }, 3000);
  }
}
