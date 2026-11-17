import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ToolsDirectoryComponent } from './pages/tools-directory/tools-directory.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ConverterHomeComponent } from './components/converter-home/converter-home';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer';
import { ImageCompressorComponent } from './tools/image-compressor/image-compressor.component';
import { WordCounterComponent } from './tools/word-counter/word-counter.component';
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
import { BarcodeGeneratorComponent } from './tools/barcode-generator/barcode-generator.component';
import { UrlToolsComponent } from './tools/url-tools/url-tools.component';
import { PasswordGeneratorComponent } from './tools/password-generator/password-generator.component';
import { WatermarkComponent } from './tools/watermark/watermark.component';
import { BgRemoverComponent } from './tools/bg-remover/bg-remover.component';
import { RedirectComponent } from './pages/redirect/redirect.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { QuicktoolsComponent } from './pages/quicktools/quicktools.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'JSANS DevStudio - Modern Web Utilities, Mobile Apps & Automation Bots'
  },
  {
    path: 'quicktools',
    component: QuicktoolsComponent,
    title: 'QuickTools on WhatsApp - Cloud Automation Bot | JSANS DevStudio'
  },
  {
    path: 'whatsapp',
    redirectTo: 'quicktools',
    pathMatch: 'full'
  },
  {
    path: 'tools',
    component: ToolsDirectoryComponent,
    title: 'All Online Tools & Utilities Directory | JSANS DevStudio'
  },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Admin Control Center | JSANS DevStudio'
  },

  // 1. Financial & Investment Calculators
  {
    path: 'tools/finance-calculator',
    component: FinanceCalculatorComponent,
    title: 'Loan EMI, FD, RD & PPF Calculator Online | JSANS DevStudio'
  },

  // 2. Media & Graphic Utilities
  {
    path: 'tools/pdf-merger',
    component: PdfMergerComponent,
    title: 'PDF Merger & Combiner - Merge PDF Files Online | JSANS DevStudio'
  },
  {
    path: 'tools/image-compressor',
    component: ImageCompressorComponent,
    title: 'Image & File Size Reducer - Compress JPG, PNG, WebP Online | JSANS DevStudio'
  },
  {
    path: 'tools/image-converter',
    component: ImageConverterComponent,
    title: 'Image Format Converter - PNG ⇄ JPG ⇄ WebP | JSANS DevStudio'
  },
  {
    path: 'tools/bg-remover',
    component: BgRemoverComponent,
    title: 'AI Background Remover - WebGPU Accelerated, 100% Free & Private | JSANS DevStudio'
  },
  {
    path: 'tools/background-remover',
    redirectTo: 'tools/bg-remover',
    pathMatch: 'full'
  },
  {
    path: 'tools/remove-background',
    redirectTo: 'tools/bg-remover',
    pathMatch: 'full'
  },
  {
    path: 'tools/favicon-generator',
    component: FaviconGeneratorComponent,
    title: 'Favicon & Multi-Res Icon Generator - SVG to PNG/ICO | JSANS DevStudio'
  },
  {
    path: 'tools/color-picker',
    component: ColorPickerComponent,
    title: 'Image Color Picker & Palette Extractor (HEX, RGB, HSL) | JSANS DevStudio'
  },

  // 3. Converters & Developer Utilities
  {
    path: 'tools/unit-converter',
    component: UnitConverterComponent,
    title: 'Universal Unit Converter - Length, Weight, Temp, Storage, Speed | JSANS DevStudio'
  },
  {
    path: 'tools/base64-tool',
    component: Base64ToolComponent,
    title: 'JWT Decoder & Base64 Encoder / Decoder Online | JSANS DevStudio'
  },
  {
    path: 'tools/json-formatter',
    component: JsonFormatterComponent,
    title: 'JSON Formatter, Validator & CSV Converter Online | JSANS DevStudio'
  },
  {
    path: 'tools/readme-to-pdf',
    component: ConverterHomeComponent,
    title: 'README to PDF Converter - Convert Markdown to PDF Online | JSANS DevStudio'
  },
  {
    path: 'viewer',
    component: PdfViewerComponent,
    title: 'PDF Viewer - README to PDF Converter | JSANS DevStudio'
  },

  // 4. Student & Everyday Calculators
  {
    path: 'tools/word-counter',
    component: WordCounterComponent,
    title: 'Word & Character Counter - Free Text & Reading Time Tool | JSANS DevStudio'
  },
  {
    path: 'tools/watermark',
    component: WatermarkComponent,
    title: 'Safe-KYC Document Watermarker - Protect Aadhaar & PAN | JSANS DevStudio'
  },
  {
    path: 'tools/aadhaar-masker',
    redirectTo: 'tools/watermark',
    pathMatch: 'full'
  },
  {
    path: 'tools/age-calculator',
    component: AgeCalculatorComponent,
    title: 'Age & Date Duration Calculator - Calculate Exact Age | JSANS DevStudio'
  },
  {
    path: 'tools/percentage-calculator',
    component: PercentageCalculatorComponent,
    title: 'Percentage & Discount Calculator Online | JSANS DevStudio'
  },
  {
    path: 'tools/tip-calculator',
    component: TipCalculatorComponent,
    title: 'Tip & Bill Splitter - Calculate Restaurant Tips | JSANS DevStudio'
  },

  // 5. Advanced Utilities (SEO Rich Landing Pages)
  {
    path: 'tools/barcode-generator',
    component: BarcodeGeneratorComponent,
    title: 'Barcode & QR Code Generator Online - Free SVG / PNG Download | JSANS DevStudio'
  },
  {
    path: 'tools/url-tools',
    component: UrlToolsComponent,
    title: 'URL Shortener, UTM Campaign Builder & Link Cleaner Online | JSANS DevStudio'
  },
  {
    path: 'tools/url-shortener',
    component: UrlToolsComponent,
    title: 'URL Shortener Online - Shorten Long Web Links | JSANS DevStudio'
  },
  {
    path: 'tools/password-generator',
    component: PasswordGeneratorComponent,
    title: 'Strong Password, Secret Key & UUID Generator Online | JSANS DevStudio'
  },
  {
    path: 's',
    component: RedirectComponent,
    title: 'Redirecting... | JSANS DevStudio'
  },

  // 6. Compliance & Legal Pages
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us - JSANS DevStudio'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact & Support - JSANS DevStudio'
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    title: 'Privacy Policy - JSANS DevStudio'
  },
  {
    path: 'terms',
    component: TermsComponent,
    title: 'Terms of Service - JSANS DevStudio'
  },

  {
    path: '**',
    redirectTo: ''
  }
];
