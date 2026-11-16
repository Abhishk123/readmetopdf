import { Component, inject, signal, computed, ElementRef, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService, Language } from '../../services/translation.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.css'
})
export class LanguageSelectorComponent {
  public translationService = inject(TranslationService);
  private elementRef = inject(ElementRef);

  public readonly variant = input<'desktop' | 'mobile'>('desktop');
  public isOpen = signal<boolean>(false);
  public searchQuery = signal<string>('');

  public readonly currentLanguage = this.translationService.currentLanguage;
  public readonly currentLangCode = this.translationService.currentLangCode;

  public readonly filteredLanguages = computed<Language[]>(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const all = this.translationService.languages;
    if (!q) return all;
    return all.filter(l => 
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  public toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      this.searchQuery.set('');
    }
  }

  public closeDropdown(): void {
    this.isOpen.set(false);
  }

  public selectLanguage(code: string, event: Event): void {
    event.stopPropagation();
    this.closeDropdown();
    this.translationService.setLanguage(code);
  }

  public resetToEnglish(event: Event): void {
    event.stopPropagation();
    this.closeDropdown();
    this.translationService.setLanguage('en');
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    this.closeDropdown();
  }
}
