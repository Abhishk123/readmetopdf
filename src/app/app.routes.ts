import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ConverterHomeComponent } from './components/converter-home/converter-home';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer';
import { ImageCompressorComponent } from './tools/image-compressor/image-compressor.component';
import { WordCounterComponent } from './tools/word-counter/word-counter.component';
import { GpaCalculatorComponent } from './tools/gpa-calculator/gpa-calculator.component';
import { JsonFormatterComponent } from './tools/json-formatter/json-formatter.component';
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
  // Document Tools
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
  // Media Tools
  {
    path: 'tools/image-compressor',
    component: ImageCompressorComponent,
    title: 'Image & File Size Reducer - Compress JPG, PNG, WebP Online | JSNS Works'
  },
  // Student Tools
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
  // Developer Tools
  {
    path: 'tools/json-formatter',
    component: JsonFormatterComponent,
    title: 'JSON Formatter, Validator & CSV Converter Online | JSNS Works'
  },
  // Compliance & Info Pages
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
