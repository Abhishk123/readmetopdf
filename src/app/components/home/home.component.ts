import { Component, signal, computed, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TOOLS_CONFIG } from '../../config/tools.config';
import { ToolCategory, ToolItem } from '../../models/tool.model';
import { AdBannerComponent } from '../ads/ad-banner/ad-banner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  public tools = signal<ToolItem[]>(TOOLS_CONFIG);
  public searchQuery = signal<string>('');
  public selectedCategory = signal<ToolCategory>('all');

  public readonly categories: { label: string; value: ToolCategory }[] = [
    { label: 'All Tools', value: 'all' },
    { label: 'Finance & Loans', value: 'finance' },
    { label: 'Media & Graphics', value: 'media' },
    { label: 'Documents & PDF', value: 'documents' },
    { label: 'Converters & Math', value: 'utilities' },
    { label: 'Developer', value: 'developer' },
    { label: 'Writing & Student', value: 'student' }
  ];

  public filteredTools = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const cat = this.selectedCategory();

    return this.tools().filter(tool => {
      const matchesCat = cat === 'all' || tool.category === cat;
      if (!matchesCat) return false;

      if (!q) return true;

      const titleMatch = tool.title.toLowerCase().includes(q);
      const descMatch = tool.shortDescription.toLowerCase().includes(q);
      const kwMatch = tool.keywords.some(k => k.toLowerCase().includes(q));

      return titleMatch || descMatch || kwMatch;
    });
  });

  // Hotkey listener: Press '/' or 'Ctrl+K' to focus search
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if ((event.key === '/' || (event.ctrlKey && event.key === 'k')) && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  }

  public setCategory(cat: ToolCategory): void {
    this.selectedCategory.set(cat);
  }

  public clearSearch(): void {
    this.searchQuery.set('');
  }
}
