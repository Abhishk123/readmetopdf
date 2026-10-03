import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MarkdownParserService } from './markdown-parser.service';
import { PdfStateService } from './pdf-state.service';
import { ConvertedPdfResult } from '../models/conversion.model';

@Injectable({
  providedIn: 'root'
})
export class PdfConverterService {
  constructor(
    private parser: MarkdownParserService,
    private state: PdfStateService
  ) {}

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async convertMarkdownFile(file: File, markdownText: string): Promise<ConvertedPdfResult> {
    try {
      this.state.updateProgress(15, 'Reading file contents...', 'reading');
      await this.delay(150);

      this.state.updateProgress(35, 'Parsing Markdown into formatted document...', 'converting');
      const htmlContent = this.parser.parse(markdownText);
      await this.delay(200);

      this.state.updateProgress(60, 'Rendering document layout...', 'converting');
      
      // Render container safely inside viewport behind active UI so html2canvas captures full dimensions
      const container = document.createElement('div');
      container.className = 'pdf-render-temp-container';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.zIndex = '-9999';
      container.style.width = '800px';
      container.style.padding = '40px 48px';
      container.style.backgroundColor = '#ffffff';
      container.style.color = '#1f2937';
      container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
      container.style.fontSize = '14px';
      container.style.lineHeight = '1.6';
      container.style.boxSizing = 'border-box';
      container.style.opacity = '1';
      container.style.pointerEvents = 'none';

      const cleanDocTitle = file.name.replace(/\.[^/.]+$/, '') || 'README';

      container.innerHTML = `
        <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
          <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0;">${this.escape(cleanDocTitle)}</h1>
          <span style="font-size: 11px; color: #64748b;">README to PDF</span>
        </div>
        <div class="markdown-body">
          ${htmlContent}
        </div>
      `;
      document.body.appendChild(container);

      this.state.updateProgress(80, 'Generating high-definition PDF...', 'converting');
      await this.delay(200);

      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(container, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1024
        });
      } finally {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }

      this.state.updateProgress(95, 'Finalizing pages & downloads...', 'converting');
      await this.delay(150);

      // Multi-page PDF calculation (A4 in mm: 210 x 297)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 12;
      const contentWidth = pageWidth - (margin * 2);
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentHeightPerPage = pageHeight - (margin * 2);

      let heightLeft = imgHeight;
      let position = margin;
      let pageNumber = 1;

      // Add first page
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= contentHeightPerPage;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = margin - (pageNumber * contentHeightPerPage);
        pdf.addPage();
        pageNumber++;
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        heightLeft -= contentHeightPerPage;
      }

      const totalPages = pageNumber;

      // Add page numbering footer
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(140, 140, 140);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 6);
      }

      const blob = pdf.output('blob');
      const objectUrl = URL.createObjectURL(blob);
      const dataUrl = pdf.output('datauristring');
      const pdfFileName = `${cleanDocTitle}.pdf`;

      const result: ConvertedPdfResult = {
        fileName: file.name,
        pdfFileName,
        blob,
        objectUrl,
        dataUrl,
        pageCount: totalPages,
        renderedHtml: htmlContent,
        createdAt: new Date()
      };

      this.state.setConvertedResult(result);
      return result;
    } catch (error: any) {
      console.error('PDF Conversion error:', error);
      this.state.updateProgress(0, error?.message || 'Conversion failed. Please try again.', 'error');
      alert('Could not complete PDF conversion. Please check the file and try again.');
      throw error;
    }
  }

  public downloadCurrentPdf(): void {
    const result = this.state.convertedResult();
    if (!result) return;
    this.triggerDownload(result.blob, result.pdfFileName);
  }

  public triggerDownload(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  private escape(str: string): string {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m] || m));
  }
}
