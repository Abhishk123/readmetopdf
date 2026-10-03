import { Injectable, signal } from '@angular/core';
import { ConvertedPdfResult, ProgressState } from '../models/conversion.model';

@Injectable({
  providedIn: 'root'
})
export class PdfStateService {
  // Selected file info
  public readonly selectedFile = signal<File | null>(null);
  public readonly markdownContent = signal<string>('');
  
  // Progress tracker
  public readonly progress = signal<ProgressState>({
    percentage: 0,
    message: 'Ready',
    status: 'idle'
  });

  // Converted result
  public readonly convertedResult = signal<ConvertedPdfResult | null>(null);

  public setSelectedFile(file: File, content: string): void {
    this.selectedFile.set(file);
    this.markdownContent.set(content);
    this.progress.set({
      percentage: 0,
      message: 'File ready for conversion',
      status: 'idle'
    });
  }

  public updateProgress(percentage: number, message: string, status: ProgressState['status']): void {
    this.progress.set({ percentage, message, status });
  }

  public setConvertedResult(result: ConvertedPdfResult): void {
    // Revoke previous objectUrl to free memory
    const prev = this.convertedResult();
    if (prev?.objectUrl) {
      try {
        URL.revokeObjectURL(prev.objectUrl);
      } catch (e) {
        // ignore
      }
    }
    this.convertedResult.set(result);
    this.progress.set({
      percentage: 100,
      message: 'Conversion completed successfully!',
      status: 'completed'
    });
  }

  public reset(): void {
    const prev = this.convertedResult();
    if (prev?.objectUrl) {
      try {
        URL.revokeObjectURL(prev.objectUrl);
      } catch (e) {
        // ignore
      }
    }
    this.selectedFile.set(null);
    this.markdownContent.set('');
    this.convertedResult.set(null);
    this.progress.set({
      percentage: 0,
      message: 'Ready',
      status: 'idle'
    });
  }
}
