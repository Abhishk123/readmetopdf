export type ToolCategory = 'all' | 'documents' | 'media' | 'student' | 'developer' | 'utilities';

export interface ToolHowToStep {
  name: string;
  text: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ToolCategory;
  route: string;
  icon: string; // SVG path or identifier
  badge?: string;
  isPopular?: boolean;
  keywords: string[];
  features: string[];
  howToSteps: ToolHowToStep[];
  faqs: ToolFaq[];
}
