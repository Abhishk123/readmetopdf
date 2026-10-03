import { Routes } from '@angular/router';
import { ConverterHomeComponent } from './components/converter-home/converter-home';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer';

export const routes: Routes = [
  {
    path: '',
    component: ConverterHomeComponent,
    title: 'README to PDF Converter - Convert Markdown to PDF Online'
  },
  {
    path: 'viewer',
    component: PdfViewerComponent,
    title: 'PDF Viewer - README to PDF Converter'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
