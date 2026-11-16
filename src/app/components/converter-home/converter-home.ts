import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PdfStateService } from '../../services/pdf-state.service';
import { PdfConverterService } from '../../services/pdf-converter.service';
import { ProgressBarComponent } from '../progress-bar/progress-bar';
import { AdBannerComponent } from '../ads/ad-banner/ad-banner';

@Component({
  selector: 'app-converter-home',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, AdBannerComponent],
  templateUrl: './converter-home.html',
  styleUrl: './converter-home.css'
})
export class ConverterHomeComponent implements OnInit {
  protected state = inject(PdfStateService);
  protected converter = inject(PdfConverterService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isDragging = false;
  selectedFileName = '';
  selectedFileSize = '';

  ngOnInit(): void {
    // If a file was previously selected, restore the name
    const existingFile = this.state.selectedFile();
    if (existingFile) {
      this.selectedFileName = existingFile.name;
      this.selectedFileSize = this.formatFileSize(existingFile.size);
    }

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent, fileInput: HTMLInputElement): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  public handleFile(file: File): void {
    this.selectedFileName = file.name;
    this.selectedFileSize = this.formatFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = (e.target?.result as string) || '';
      this.state.setSelectedFile(file, content);
    };
    reader.onerror = () => {
      alert('Could not read the selected file. Please try again.');
    };
    reader.readAsText(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async convertToPdf(fileInput: HTMLInputElement): Promise<void> {
    const file = this.state.selectedFile();
    const markdown = this.state.markdownContent();

    // If no file selected yet, automatically prompt user to choose a file
    if (!file || !markdown) {
      fileInput.click();
      return;
    }

    // Prevent double clicking while already converting
    if (this.state.progress().status === 'converting' || this.state.progress().status === 'reading') {
      return;
    }

    try {
      await this.converter.convertMarkdownFile(file, markdown);
    } catch (err) {
      console.error('Failed to convert:', err);
    }
  }

  viewPdf(): void {
    this.router.navigate(['/viewer']);
  }

  downloadPdf(): void {
    this.converter.downloadCurrentPdf();
  }

  clearSelectedFile(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFileName = '';
    this.selectedFileSize = '';
    this.state.reset();
  }
}
