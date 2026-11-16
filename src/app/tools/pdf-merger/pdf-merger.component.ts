import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';
import { PDFDocument } from 'pdf-lib';

export interface PdfFileEntry {
  id: string;
  file: File;
  name: string;
  sizeFormatted: string;
}

@Component({
  selector: 'app-pdf-merger',
  standalone: true,
  imports: [CommonModule, RouterLink, AdBannerComponent],
  templateUrl: './pdf-merger.component.html',
  styleUrl: './pdf-merger.component.css'
})
export class PdfMergerComponent {
  public filesList = signal<PdfFileEntry[]>([]);
  public isProcessing = signal<boolean>(false);
  public isDragging = signal<boolean>(false);
  public errorMessage = signal<string>('');
  public downloadUrl = signal<string | null>(null);

  public formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
      this.addFiles(Array.from(e.dataTransfer.files));
    }
  }

  public onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.addFiles(Array.from(input.files));
    }
  }

  private addFiles(files: File[]): void {
    this.errorMessage.set('');
    this.downloadUrl.set(null);

    const pdfs = files.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) {
      this.errorMessage.set('Please select valid PDF documents (.pdf).');
      return;
    }

    const current = this.filesList();
    const newEntries: PdfFileEntry[] = pdfs.map(f => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      name: f.name,
      sizeFormatted: this.formatBytes(f.size)
    }));

    this.filesList.set([...current, ...newEntries]);
  }

  public moveUp(idx: number): void {
    if (idx <= 0) return;
    const list = [...this.filesList()];
    const temp = list[idx - 1];
    list[idx - 1] = list[idx];
    list[idx] = temp;
    this.filesList.set(list);
    this.downloadUrl.set(null);
  }

  public moveDown(idx: number): void {
    const list = [...this.filesList()];
    if (idx >= list.length - 1) return;
    const temp = list[idx + 1];
    list[idx + 1] = list[idx];
    list[idx] = temp;
    this.filesList.set(list);
    this.downloadUrl.set(null);
  }

  public removeFile(id: string): void {
    this.filesList.set(this.filesList().filter(f => f.id !== id));
    this.downloadUrl.set(null);
  }

  public clearAll(): void {
    this.filesList.set([]);
    this.downloadUrl.set(null);
    this.errorMessage.set('');
  }

  public async mergePdfs(): Promise<void> {
    const entries = this.filesList();
    if (entries.length < 2) {
      this.errorMessage.set('Please add at least 2 PDF files to merge.');
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const entry of entries) {
        const arrayBuffer = await entry.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      this.downloadUrl.set(url);
    } catch (err: any) {
      this.errorMessage.set(`Unable to merge PDFs: ${err.message || 'Corrupt or password-protected PDF file.'}`);
    } finally {
      this.isProcessing.set(false);
    }
  }

  public downloadMerged(): void {
    const url = this.downloadUrl();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged-document-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
