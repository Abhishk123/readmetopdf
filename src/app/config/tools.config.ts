import { ToolItem } from '../models/tool.model';

/**
 * Central Tools Registry
 * Adding a new tool to jsnsworks is as simple as adding an entry to this array!
 * The Homepage grid, search index, and category filters automatically update.
 */
export const TOOLS_CONFIG: ToolItem[] = [
  {
    id: 'readme-to-pdf',
    title: 'README to PDF Converter',
    shortDescription: 'Convert GitHub README.md or Markdown documentation into styled, printable A4 PDF documents.',
    fullDescription: 'Professional in-browser documentation converter. Formats markdown tables, syntax-highlighted code blocks, and headings into publication-grade multi-page PDFs with zero server uploads.',
    category: 'documents',
    route: '/tools/readme-to-pdf',
    icon: 'file-text',
    badge: 'Popular',
    isPopular: true,
    keywords: ['readme', 'markdown', 'pdf', 'github', 'convert md to pdf', 'documentation', 'markdown to pdf'],
    features: [
      '100% Private in-browser conversion',
      'GitHub-flavored Markdown & syntax highlighting',
      'Clean A4 multi-page pagination',
      'Custom styling and real-time live preview',
      'Zero server upload or data storage'
    ],
    howToSteps: [
      { name: 'Upload or Paste Markdown', text: 'Choose your README.md file or paste raw markdown text directly into the editor.' },
      { name: 'Preview & Customize', text: 'Inspect the live rendered preview and adjust styling options.' },
      { name: 'Download PDF', text: 'Click Convert to generate and save your formatted PDF in seconds.' }
    ],
    faqs: [
      { question: 'Is my documentation uploaded to a server?', answer: 'No. All parsing and PDF rendering happen entirely inside your web browser using HTML5 and WebAssembly.' },
      { question: 'Does it support GitHub code blocks and tables?', answer: 'Yes, full GitHub Flavored Markdown (GFM) is supported including tables, code highlighting, and task lists.' }
    ]
  },
  {
    id: 'image-compressor',
    title: 'Image & File Size Reducer',
    shortDescription: 'Compress and resize JPG, PNG, and WebP images to reduce file size without losing quality.',
    fullDescription: 'Quickly shrink image file sizes for job applications, passports, websites, and school portals. Choose custom quality levels, max dimensions, and compare original vs compressed files side-by-side.',
    category: 'media',
    route: '/tools/image-compressor',
    icon: 'image',
    badge: '100% Private',
    isPopular: true,
    keywords: ['image compressor', 'reduce image size', 'compress jpg', 'compress png', 'shrink photo size', 'kb reducer', 'photo resizer'],
    features: [
      'Compress JPG, PNG, and WebP images instantly',
      'Target file size reduction (e.g. compress below 200 KB)',
      'Side-by-side before and after quality preview',
      'Batch-ready in-browser processing with zero server lag',
      'No loss of image aspect ratio'
    ],
    howToSteps: [
      { name: 'Select Image', text: 'Drag and drop or browse for any JPG, PNG, or WebP image from your device.' },
      { name: 'Adjust Quality', text: 'Use the quality slider or dimension controls to achieve your desired file size.' },
      { name: 'Download Compressed Image', text: 'Review the instant preview and click Download to save your optimized file.' }
    ],
    faqs: [
      { question: 'Are my photos uploaded to external servers?', answer: 'Never. Image compression uses browser Canvas and Blob APIs locally on your device. Your photos remain 100% confidential.' },
      { question: 'Can I reduce image size to under 100KB for government forms?', answer: 'Yes! Simply lower the quality slider until the output file size shows under 100KB, then download.' }
    ]
  },
  {
    id: 'word-counter',
    title: 'Word & Character Counter',
    shortDescription: 'Count words, characters, sentences, and estimated reading time with case conversion tools.',
    fullDescription: 'A comprehensive text utility for students, essay writers, and content creators. Provides real-time metrics for word counts, character limits, reading time, speaking duration, and one-click case changers.',
    category: 'student',
    route: '/tools/word-counter',
    icon: 'type',
    badge: 'Student Tool',
    isPopular: true,
    keywords: ['word counter', 'character count', 'reading time', 'essay counter', 'case converter', 'uppercase lowercase', 'sentence counter'],
    features: [
      'Real-time word, character, and sentence calculation',
      'Estimated reading and speaking time metrics',
      'Character counts with and without spaces for application limits',
      'One-click Case Converters (UPPERCASE, lowercase, Title Case, Sentence case)',
      'Removes redundant spaces and empty lines'
    ],
    howToSteps: [
      { name: 'Paste or Type Text', text: 'Enter your essay, article, or assignment into the text box.' },
      { name: 'View Live Metrics', text: 'Watch the word counter and statistics update in real-time as you type.' },
      { name: 'Convert & Copy', text: 'Apply case conversions or clean up whitespace and copy back with one click.' }
    ],
    faqs: [
      { question: 'What is the reading time calculation based on?', answer: 'It is based on the average adult reading speed of 200 words per minute (WPM) and speech rate of 130 WPM.' },
      { question: 'Is there any character limit in this tool?', answer: 'No limit. You can paste entire book chapters or research papers with no restrictions.' }
    ]
  },
  {
    id: 'gpa-calculator',
    title: 'Student GPA & Grade Calculator',
    shortDescription: 'Calculate college semester GPA, cumulative CGPA, and grade percentages with custom grading scales.',
    fullDescription: 'An intuitive GPA calculator built for high school and university students. Supports standard 4.0 US scales, 10.0 CGPA scales, weighted credit hours, and planning target future grades.',
    category: 'student',
    route: '/tools/gpa-calculator',
    icon: 'award',
    badge: 'Student Utility',
    isPopular: false,
    keywords: ['gpa calculator', 'cgpa calculator', 'grade calculator', 'college gpa', 'semester gpa', 'credit hours', 'student grades'],
    features: [
      'Supports 4.0 Standard Scale and 10.0 CGPA Scale',
      'Weighted credit hours calculation',
      'Add unlimited course rows with instant updates',
      'Target GPA planning & percentage conversion',
      'Auto-saves courses in browser storage so you don’t lose progress'
    ],
    howToSteps: [
      { name: 'Choose Scale', text: 'Select between 4.0 GPA scale or 10.0 CGPA grading scale.' },
      { name: 'Enter Courses', text: 'Input course names, credit hours, and your letter grade or grade points.' },
      { name: 'Check GPA', text: 'Your calculated GPA, total credits, and performance rating update instantly.' }
    ],
    faqs: [
      { question: 'Does this save my entered courses?', answer: 'Yes! Your course list is safely cached in your local browser storage so it is ready when you return.' },
      { question: 'How is weighted GPA calculated?', answer: 'Total Grade Points = Sum of (Course Credits × Grade Point). Semester GPA = Total Grade Points ÷ Total Credits.' }
    ]
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter & CSV Converter',
    shortDescription: 'Validate, beautify, minify JSON code, and convert JSON arrays directly into CSV format.',
    fullDescription: 'Essential developer and analyst utility to inspect messy JSON, detect syntax errors with line numbers, format with 2 or 4 spaces, compact payloads, and export data structures to CSV spreadsheets.',
    category: 'developer',
    route: '/tools/json-formatter',
    icon: 'code',
    badge: 'Dev Utility',
    isPopular: false,
    keywords: ['json formatter', 'json beautifier', 'json validator', 'json to csv', 'format json online', 'json parser', 'minify json'],
    features: [
      'Instant JSON syntax error detection with error message and line position',
      'Prettify with custom indentation (2 spaces or 4 spaces)',
      'One-click JSON minification for API payloads',
      'Convert JSON arrays directly into downloadable CSV tables',
      'Copy to clipboard and direct file download'
    ],
    howToSteps: [
      { name: 'Paste JSON', text: 'Paste your raw or minified JSON text into the code input editor.' },
      { name: 'Format or Convert', text: 'Click Format JSON to beautify, or Convert to CSV for table export.' },
      { name: 'Copy or Download', text: 'Copy the result with one click or download the formatted file.' }
    ],
    faqs: [
      { question: 'Is my JSON data safe?', answer: 'Completely. All parsing occurs strictly inside your web browser. No JSON data is ever sent over the network.' },
      { question: 'Can it convert nested JSON to CSV?', answer: 'Flat and 1-level nested object arrays convert seamlessly into standard CSV rows.' }
    ]
  }
];
