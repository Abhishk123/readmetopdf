import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './json-formatter.component.html',
  styleUrl: './json-formatter.component.css'
})
export class JsonFormatterComponent {
  public inputJson = signal<string>('{\n  "tool": "JSON Formatter",\n  "author": "jsnsworks",\n  "features": ["validate", "beautify", "minify", "csv-export"],\n  "status": "active",\n  "users": 15000\n}');
  public statusMessage = signal<string>('');
  public isError = signal<boolean>(false);
  public copiedMessage = signal<boolean>(false);
  public indentation = signal<number>(2);

  public formatJson(): void {
    const raw = this.inputJson().trim();
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const formatted = JSON.stringify(parsed, null, this.indentation());
      this.inputJson.set(formatted);
      this.isError.set(false);
      this.statusMessage.set('✓ Valid JSON formatted successfully.');
    } catch (err: any) {
      this.isError.set(true);
      this.statusMessage.set(`Syntax Error: ${err.message}`);
    }
  }

  public minifyJson(): void {
    const raw = this.inputJson().trim();
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const minified = JSON.stringify(parsed);
      this.inputJson.set(minified);
      this.isError.set(false);
      this.statusMessage.set('✓ JSON minified into a single line.');
    } catch (err: any) {
      this.isError.set(true);
      this.statusMessage.set(`Syntax Error: ${err.message}`);
    }
  }

  public validateJson(): void {
    const raw = this.inputJson().trim();
    if (!raw) {
      this.statusMessage.set('Please enter JSON text to validate.');
      this.isError.set(false);
      return;
    }

    try {
      JSON.parse(raw);
      this.isError.set(false);
      this.statusMessage.set('✓ JSON is completely valid and well-formed!');
    } catch (err: any) {
      this.isError.set(true);
      this.statusMessage.set(`Invalid JSON: ${err.message}`);
    }
  }

  public convertToCsv(): void {
    const raw = this.inputJson().trim();
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const arrayData = Array.isArray(parsed) ? parsed : [parsed];

      if (arrayData.length === 0 || typeof arrayData[0] !== 'object') {
        this.isError.set(true);
        this.statusMessage.set('JSON must contain an object or array of objects to convert to CSV.');
        return;
      }

      // Collect all keys
      const headers = Array.from(new Set(arrayData.flatMap(item => Object.keys(item || {}))));
      const csvRows: string[] = [];

      // Header row
      csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

      // Data rows
      for (const item of arrayData) {
        const row = headers.map(h => {
          const val = item ? item[h] : '';
          const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
          return `"${strVal.replace(/"/g, '""')}"`;
        });
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\n');
      this.downloadBlob(csvContent, 'data.csv', 'text/csv');
      this.isError.set(false);
      this.statusMessage.set('✓ Successfully converted and downloaded as data.csv');
    } catch (err: any) {
      this.isError.set(true);
      this.statusMessage.set(`Unable to convert to CSV: ${err.message}`);
    }
  }

  public downloadJson(): void {
    const text = this.inputJson();
    if (!text) return;
    this.downloadBlob(text, 'formatted.json', 'application/json');
  }

  private downloadBlob(content: string, filename: string, mime: string): void {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public copyJson(): void {
    if (!this.inputJson()) return;
    navigator.clipboard.writeText(this.inputJson()).then(() => {
      this.copiedMessage.set(true);
      setTimeout(() => this.copiedMessage.set(false), 2000);
    });
  }

  public clearText(): void {
    this.inputJson.set('');
    this.statusMessage.set('');
  }

  public loadSample(): void {
    this.inputJson.set(
      JSON.stringify(
        [
          { id: 101, name: "Alice Johnson", role: "Software Engineer", skills: ["Angular", "TypeScript"], active: true },
          { id: 102, name: "Bob Smith", role: "UI/UX Designer", skills: ["Figma", "CSS3"], active: false },
          { id: 103, name: "Charlie Davis", role: "Product Manager", skills: ["Agile", "Scrum"], active: true }
        ],
        null,
        2
      )
    );
    this.statusMessage.set('✓ Sample JSON loaded (try "Export to CSV")');
    this.isError.set(false);
  }
}
