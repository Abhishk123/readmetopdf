export type ConversionStatus = 'idle' | 'reading' | 'converting' | 'completed' | 'error';

export interface ConvertedPdfResult {
  fileName: string;
  pdfFileName: string;
  blob: Blob;
  objectUrl: string;
  dataUrl?: string;
  pageCount: number;
  renderedHtml: string;
  createdAt: Date;
}

export interface ProgressState {
  percentage: number;
  message: string;
  status: ConversionStatus;
  errorMessage?: string;
}

export type AdSlotType = 'topBanner' | 'homeSidebar' | 'viewerSidebar';
export type AdFormat = 'horizontal' | 'rectangle' | 'vertical';
