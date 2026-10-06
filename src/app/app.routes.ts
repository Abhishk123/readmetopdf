import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ConverterHomeComponent } from './components/converter-home/converter-home';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer';
import { ImageCompressorComponent } from './tools/image-compressor/image-compressor.component';
import { WordCounterComponent } from './tools/word-counter/word-counter.component';
import { GpaCalculatorComponent } from './tools/gpa-calculator/gpa-calculator.component';
import { JsonFormatterComponent } from './tools/json-formatter/json-formatter.component';
import { FinanceCalculatorComponent } from './tools/finance-calculator/finance-calculator.component';
import { PdfMergerComponent } from './tools/pdf-merger/pdf-merger.component';
import { Base64ToolComponent } from './tools/base64-tool/base64-tool.component';
import { UnitConverterComponent } from './tools/unit-converter/unit-converter.component';
import { AgeCalculatorComponent } from './tools/age-calculator/age-calculator.component';
import { PercentageCalculatorComponent } from './tools/percentage-calculator/percentage-calculator.component';
import { TipCalculatorComponent } from './tools/tip-calculator/tip-calculator.component';
import { ColorPickerComponent } from './tools/color-picker/color-picker.component';
import { ImageConverterComponent } from './tools/image-converter/image-converter.component';
import { FaviconGeneratorComponent } from './tools/favicon-generator/favicon-generator.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsComponent } from './pages/terms/terms.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'JSNS Works - Free Online Tools for Developers, Students & Creators'
  },

  // 1. Financial & Investment Calculators
  {
    path: 'tools/finance-calculator',
    component: FinanceCalculatorComponent,
    title: 'Loan EMI, FD, RD & PPF Calculator Online | JSNS Works'
  },

  // 2. Media & Graphic Utilities
  {
    path: 'tools/pdf-merger',
    component: PdfMergerComponent,
    title: 'PDF Merger & Combiner - Merge PDF Files Online | JSNS Works'
  },
  {
    path: 'tools/image-compressor',
    component: ImageCompressorComponent,
    title: 'Image & File Size Reducer - Compress JPG, PNG, WebP Online | JSNS Works'
  },
  {
    path: 'tools/image-converter',
    component: ImageConverterComponent,
    title: 'Image Format Converter - PNG ⇄ JPG ⇄ WebP | JSNS Works'
  },
  {
    path: 'tools/favicon-generator',
    component: FaviconGeneratorComponent,
    title: 'Favicon & Multi-Res Icon Generator - SVG to PNG/ICO | JSNS Works'
  },
  {
    path: 'tools/color-picker',
    component: ColorPickerComponent,
    title: 'Image Color Picker & Palette Extractor (HEX, RGB, HSL) | JSNS Works'
  },

  // 3. Converters & Developer Utilities
  {
    path: 'tools/unit-converter',
    component: UnitConverterComponent,
    title: 'Universal Unit Converter - Length, Weight, Temp, Storage, Speed | JSNS Works'
  },
  {
    path: 'tools/base64-tool',
    component: Base64ToolComponent,
    title: 'JWT Decoder & Base64 Encoder / Decoder Online | JSNS Works'
  },
  {
    path: 'tools/json-formatter',
    component: JsonFormatterComponent,
    title: 'JSON Formatter, Validator & CSV Converter Online | JSNS Works'
  },
  {
    path: 'tools/readme-to-pdf',
    component: ConverterHomeComponent,
    title: 'README to PDF Converter - Convert Markdown to PDF Online | JSNS Works'
  },
  {
    path: 'viewer',
    component: PdfViewerComponent,
    title: 'PDF Viewer - README to PDF Converter | JSNS Works'
  },

  // 4. Student & Everyday Calculators
  {
    path: 'tools/word-counter',
    component: WordCounterComponent,
    title: 'Word & Character Counter - Free Essay & Reading Time Tool | JSNS Works'
  },
  {
    path: 'tools/gpa-calculator',
    component: GpaCalculatorComponent,
    title: 'Student GPA & Grade Calculator - 4.0 & 10.0 CGPA Scale | JSNS Works'
  },
  {
    path: 'tools/age-calculator',
    component: AgeCalculatorComponent,
    title: 'Age & Date Duration Calculator - Calculate Exact Age | JSNS Works'
  },
  {
    path: 'tools/percentage-calculator',
    component: PercentageCalculatorComponent,
    title: 'Percentage & Discount Calculator Online | JSNS Works'
  },
  {
    path: 'tools/tip-calculator',
    component: TipCalculatorComponent,
    title: 'Tip & Bill Splitter - Calculate Restaurant Tips | JSNS Works'
  },

  // 5. Compliance & Legal Pages
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us - JSNS Works'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact & Support - JSNS Works'
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    title: 'Privacy Policy - JSNS Works'
  },
  {
    path: 'terms',
    component: TermsComponent,
    title: 'Terms of Service - JSNS Works'
  },

  {
    path: '**',
    redirectTo: ''
  }
];
