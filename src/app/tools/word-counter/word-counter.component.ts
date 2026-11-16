import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

@Component({
  selector: 'app-word-counter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './word-counter.component.html',
  styleUrl: './word-counter.component.css'
})
export class WordCounterComponent {
  public text = signal<string>('');
  public copiedMessage = signal<boolean>(false);

  // Computed metrics
  public wordsCount = computed(() => {
    const t = this.text().trim();
    if (!t) return 0;
    return t.split(/\s+/).filter(Boolean).length;
  });

  public charsWithSpaces = computed(() => this.text().length);

  public charsWithoutSpaces = computed(() => {
    return this.text().replace(/\s/g, '').length;
  });

  public sentencesCount = computed(() => {
    const t = this.text().trim();
    if (!t) return 0;
    const matches = t.match(/[.!?]+(\s+|$)/g);
    return matches ? matches.length : (t.length > 0 ? 1 : 0);
  });

  public paragraphsCount = computed(() => {
    const t = this.text().trim();
    if (!t) return 0;
    return t.split(/\n\s*\n/).filter(Boolean).length;
  });

  public readingTimeMinutes = computed(() => {
    const words = this.wordsCount();
    if (words === 0) return 0;
    return Math.ceil(words / 200); // 200 WPM
  });

  public speakingTimeMinutes = computed(() => {
    const words = this.wordsCount();
    if (words === 0) return 0;
    return Math.ceil(words / 130); // 130 WPM
  });

  // Text Transform Utilities
  public toUpperCase(): void {
    this.text.set(this.text().toUpperCase());
  }

  public toLowerCase(): void {
    this.text.set(this.text().toLowerCase());
  }

  public toTitleCase(): void {
    const str = this.text().toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
    this.text.set(str);
  }

  public toSentenceCase(): void {
    const str = this.text().toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    this.text.set(str);
  }

  public cleanSpaces(): void {
    const cleaned = this.text().replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    this.text.set(cleaned);
  }

  public clearText(): void {
    this.text.set('');
  }

  public loadSampleText(): void {
    this.text.set(
      'Online tools make student and developer workflows effortless. Whether you are drafting a scholarship essay, submitting college applications, or preparing project documentation, tracking word count and character limits is vital. High-quality utilities ensure clean formatting, professional grammar, and error-free presentations.'
    );
  }

  public copyText(): void {
    if (!this.text()) return;
    navigator.clipboard.writeText(this.text()).then(() => {
      this.copiedMessage.set(true);
      setTimeout(() => this.copiedMessage.set(false), 2000);
    });
  }
}
