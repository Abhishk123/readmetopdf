import { Injectable } from '@angular/core';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root'
})
export class MarkdownParserService {
  constructor() {
    marked.setOptions({
      gfm: true,
      breaks: true
    });
  }

  public parse(markdown: string): string {
    if (!markdown) return '';
    try {
      // marked.parse can return string or Promise<string>. Since no async extensions are used, string is returned.
      const parsed = marked.parse(markdown);
      return typeof parsed === 'string' ? parsed : '';
    } catch (e) {
      console.error('Error parsing markdown:', e);
      return `<pre>${this.escapeHtml(markdown)}</pre>`;
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
