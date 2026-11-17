import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TOOLS_CONFIG } from '../../config/tools.config';
import { ToolItem } from '../../models/tool.model';
import { AdminService } from '../../services/admin.service';

interface ToolCategoryGroup {
  id: string;
  name: string;
  tagline: string;
  accentClass: string;
  badgeBg: string;
  badgeText: string;
  tools: ToolItem[];
}

@Component({
  selector: 'app-tools-directory',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tools-directory.component.html',
  styleUrl: './tools-directory.component.css'
})
export class ToolsDirectoryComponent {
  private adminService = inject(AdminService);
  searchQuery = signal<string>('');
  selectedFilter = signal<string>('all');

  private get allTools(): ToolItem[] {
    return TOOLS_CONFIG.filter(tool => this.adminService.isToolVisible(tool.id));
  }

  // Filtered tools list for active search
  filteredTools = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const filter = this.selectedFilter();

    return this.allTools.filter(tool => {
      const matchesFilter = filter === 'all' || this.getGroupForTool(tool.id) === filter;
      if (!matchesFilter) return false;

      if (!q) return true;
      return (
        tool.title.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.toLowerCase().includes(q))
      );
    });
  });

  // Segregated Functional Groups
  categoryGroups = computed<ToolCategoryGroup[]>(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const activeFilter = this.selectedFilter();

    const groups: ToolCategoryGroup[] = [
      {
        id: 'pdf-docs',
        name: 'Document & PDF Studio',
        tagline: 'Merge, convert, and view documents entirely in browser memory',
        accentClass: 'accent-pdf',
        badgeBg: '#fef2f2',
        badgeText: '#ef4444',
        tools: this.allTools.filter(t => ['watermark', 'pdf-merger', 'readme-to-pdf'].includes(t.id))
      },
      {
        id: 'image-media',
        name: 'Image & Media Lab',
        tagline: 'Compress photos, convert formats, pick palettes, and generate icons',
        accentClass: 'accent-image',
        badgeBg: '#f0f9ff',
        badgeText: '#0284c7',
        tools: this.allTools.filter(t => ['bg-remover', 'image-compressor', 'image-converter', 'favicon-generator', 'color-picker'].includes(t.id))
      },
      {
        id: 'finance-banking',
        name: 'Smart Finance & Banking Calculators',
        tagline: 'Loan EMIs, fixed deposits, compound interest, tips, and percentage math',
        accentClass: 'accent-finance',
        badgeBg: '#ecfdf5',
        badgeText: '#059669',
        tools: this.allTools.filter(t => ['finance-calculator', 'percentage-calculator', 'tip-calculator'].includes(t.id))
      },
      {
        id: 'dev-security',
        name: 'Developer & Security Suite',
        tagline: 'Cryptographic passwords, JWT decoding, JSON formatting, and UTM analytics links',
        accentClass: 'accent-dev',
        badgeBg: '#eef2ff',
        badgeText: '#6366f1',
        tools: this.allTools.filter(t => ['base64-tool', 'json-formatter', 'password-generator', 'url-tools'].includes(t.id))
      },
      {
        id: 'math-everyday',
        name: 'Math, Student & Daily Utilities',
        tagline: 'Barcode/QR codes, exact age calculators, unit conversions, and text counters',
        accentClass: 'accent-math',
        badgeBg: '#fffbeb',
        badgeText: '#d97706',
        tools: this.allTools.filter(t => ['barcode-generator', 'age-calculator', 'unit-converter', 'word-counter'].includes(t.id))
      }
    ];

    // If searching or filtering, dynamically filter the group tool lists
    return groups
      .map(group => {
        const matchingTools = group.tools.filter(tool => {
          const matchesFilter = activeFilter === 'all' || group.id === activeFilter;
          if (!matchesFilter) return false;

          if (!q) return true;
          return (
            tool.title.toLowerCase().includes(q) ||
            tool.shortDescription.toLowerCase().includes(q) ||
            tool.keywords.some(k => k.toLowerCase().includes(q))
          );
        });

        return { ...group, tools: matchingTools };
      })
      .filter(group => group.tools.length > 0);
  });

  setFilter(filterId: string) {
    this.selectedFilter.set(filterId);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.selectedFilter.set('all');
  }

  private getGroupForTool(toolId: string): string {
    if (['watermark', 'pdf-merger', 'readme-to-pdf'].includes(toolId)) return 'pdf-docs';
    if (['bg-remover', 'image-compressor', 'image-converter', 'favicon-generator', 'color-picker'].includes(toolId)) return 'image-media';
    if (['finance-calculator', 'percentage-calculator', 'tip-calculator'].includes(toolId)) return 'finance-banking';
    if (['base64-tool', 'json-formatter', 'password-generator', 'url-tools'].includes(toolId)) return 'dev-security';
    return 'math-everyday';
  }
}
