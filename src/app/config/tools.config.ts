import { ToolItem } from '../models/tool.model';

export const TOOLS_CONFIG: ToolItem[] = [
  // --- 1. FINANCIAL CALCULATORS ---
  {
    id: 'finance-calculator',
    title: 'Loan EMI, FD, RD & PPF Calculator',
    shortDescription: 'Calculate Home/Car Loan EMI, Fixed Deposits (FD), Recurring Deposits (RD), and Provident Fund (PPF).',
    fullDescription: 'Comprehensive financial planning suite. Calculate reducing balance loan EMIs with amortization schedules, bank FD returns, monthly RD compounding, and 15-year tax-free PPF retirement wealth.',
    category: 'finance',
    route: '/tools/finance-calculator',
    icon: 'dollar-sign',
    badge: 'Finance',
    isPopular: true,
    keywords: ['emi calculator', 'loan calculator', 'fd calculator', 'rd calculator', 'ppf calculator', 'compound interest', 'home loan emi'],
    features: [
      'Loan EMI with principal vs interest ratio breakdown',
      'Bank Fixed Deposit (FD) quarterly compounding returns',
      'Recurring Deposit (RD) monthly deposit calculator',
      'Public Provident Fund (PPF) 15-year wealth estimator',
      'Simple vs Compound interest growth comparison'
    ],
    howToSteps: [
      { name: 'Select Calculator', text: 'Choose between EMI, FD, RD, PPF, or Interest comparison tabs.' },
      { name: 'Adjust Sliders', text: 'Use responsive sliders to choose principal amount, interest rate, and tenure.' },
      { name: 'Review Payoff', text: 'View monthly payments, interest savings, and total maturity wealth.' }
    ],
    faqs: [
      { question: 'How is reducing balance EMI calculated?', answer: 'The formula applies interest to the remaining principal balance each month, ensuring early payments amortize interest while later payments reduce principal.' },
      { question: 'What is the current PPF interest rate benchmark?', answer: 'The Government of India benchmarks PPF interest at 7.1% compounded annually with EEE tax exemption status.' }
    ]
  },

  // --- 2. MEDIA & GRAPHICS UTILITIES ---
  {
    id: 'pdf-merger',
    title: 'PDF Merger & Combiner',
    shortDescription: 'Combine multiple PDF documents into one single file with custom page reordering.',
    fullDescription: 'Fast, client-side PDF merger. Drag and drop multiple PDF files, arrange their sequence, and merge into one downloadable document without uploading confidential papers to cloud servers.',
    category: 'documents',
    route: '/tools/pdf-merger',
    icon: 'file-plus',
    badge: 'Local Only',
    isPopular: true,
    keywords: ['merge pdf', 'combine pdf', 'pdf merger', 'join pdf files', 'pdf joiner', 'reorder pdf'],
    features: [
      '100% In-browser processing with zero server uploads',
      'Drag and drop multiple PDF documents',
      'Arrow buttons to arrange custom file order',
      'Unlimited file merging with zero watermarks',
      'Instant client-side download'
    ],
    howToSteps: [
      { name: 'Add PDF Files', text: 'Click Choose PDF Files or drag multiple PDFs into the drop area.' },
      { name: 'Arrange Order', text: 'Use the up and down arrows to arrange chapters or pages in desired order.' },
      { name: 'Merge & Download', text: 'Click Merge PDF Files to combine and save your unified document.' }
    ],
    faqs: [
      { question: 'Is there any document limit?', answer: 'No limit. Processing uses local browser memory, allowing you to combine large multi-page reports safely.' },
      { question: 'Are my confidential documents uploaded?', answer: 'Never. All PDF merging executes 100% locally on your computer.' }
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
    badge: 'Canvas 2D',
    isPopular: true,
    keywords: ['image compressor', 'reduce image size', 'compress jpg', 'compress png', 'shrink photo size', 'kb reducer', 'photo resizer'],
    features: [
      'Compress JPG, PNG, and WebP images instantly',
      'Target file size reduction (e.g. compress below 200 KB)',
      'Side-by-side before and after quality preview',
      'Zero server upload lag'
    ],
    howToSteps: [
      { name: 'Select Image', text: 'Drag and drop or browse for any image from your device.' },
      { name: 'Adjust Quality', text: 'Use the quality slider or dimension controls.' },
      { name: 'Download File', text: 'Review the instant preview and click Download.' }
    ],
    faqs: [
      { question: 'Are my photos uploaded to external servers?', answer: 'Never. Image compression uses browser Canvas and Blob APIs locally.' }
    ]
  },
  {
    id: 'image-converter',
    title: 'Image Format Converter',
    shortDescription: 'Convert any image instantly between PNG, JPEG, and modern WebP formats.',
    fullDescription: 'Browser-based image converter. Transform bulky PNGs into lightweight WebPs, convert photos to universal JPEGs for form uploads, and adjust quality settings with zero software installation.',
    category: 'media',
    route: '/tools/image-converter',
    icon: 'repeat',
    badge: 'Lossless',
    keywords: ['image converter', 'png to jpg', 'jpg to webp', 'png to webp', 'convert image format'],
    features: [
      'Two-way conversion between PNG, JPG, and WebP',
      'Lossless and quality-controlled compression',
      'Instant conversion in less than 1 second',
      'Completely client-side and free'
    ],
    howToSteps: [
      { name: 'Choose Image', text: 'Select any JPG, PNG, or WebP image.' },
      { name: 'Select Format', text: 'Click your desired output format chip.' },
      { name: 'Download', text: 'Click Download Converted Image.' }
    ],
    faqs: [
      { question: 'Why convert to WebP?', answer: 'WebP provides up to 35% smaller file sizes than JPEG while keeping crisp transparency and color quality.' }
    ]
  },
  {
    id: 'favicon-generator',
    title: 'Favicon & Multi-Res Icon Generator',
    shortDescription: 'Generate standard website favicon.ico and PNG icons (16x16, 32x32, 48x48, 180x180) from SVGs.',
    fullDescription: 'Developer icon utility. Upload vector SVGs or square logo graphics to generate multi-resolution website favicons and Apple Touch Icons formatted for modern browsers.',
    category: 'media',
    route: '/tools/favicon-generator',
    icon: 'grid',
    badge: 'Multi-Res',
    keywords: ['favicon generator', 'svg to favicon', 'apple touch icon', 'ico generator', 'website icon'],
    features: [
      'Generates 16x16, 32x32, 48x48, and 180x180 resolutions',
      'Supports SVG, PNG, and JPEG uploads',
      'Pixel-perfect preview rendering',
      'One-click individual icon downloads'
    ],
    howToSteps: [
      { name: 'Upload Logo', text: 'Choose your SVG or square PNG image.' },
      { name: 'Inspect Icons', text: 'Review auto-rendered previews across all standard sizes.' },
      { name: 'Download PNGs', text: 'Download the exact icon resolutions for your web project.' }
    ],
    faqs: [
      { question: 'What is the recommended size for favicons?', answer: '32×32 is standard for desktop browsers, while 180×180 is used by iOS Apple Touch Icons.' }
    ]
  },
  {
    id: 'color-picker',
    title: 'Image Color Picker & Palette Extractor',
    shortDescription: 'Click any pixel on an uploaded image to copy HEX, RGB, and HSL codes, and extract color palettes.',
    fullDescription: 'Designer color utility. Sample colors from photos, logos, or UI mockups using an interactive canvas dropper. Extracts dominant 5-color palettes with one-click copy.',
    category: 'media',
    route: '/tools/color-picker',
    icon: 'eye-dropper',
    badge: 'Palette',
    keywords: ['color picker', 'image color picker', 'hex picker', 'rgb picker', 'palette extractor', 'extract colors from photo'],
    features: [
      'Interactive pixel-level dropper canvas',
      'One-click copy for HEX, RGB, and HSL values',
      'Auto-extracted 5-swatch dominant palette',
      '100% private in-browser image parsing'
    ],
    howToSteps: [
      { name: 'Upload Image', text: 'Select any image file or use the sample graphic.' },
      { name: 'Click Pixels', text: 'Click anywhere on the image to inspect colors.' },
      { name: 'Copy Color', text: 'Click Copy next to HEX, RGB, or HSL.' }
    ],
    faqs: [
      { question: 'Does this tool work with high-resolution photos?', answer: 'Yes, large images are scaled to fit your screen while preserving exact original pixel color values.' }
    ]
  },

  // --- 3. CONVERTERS & DEVELOPER TOOLS ---
  {
    id: 'unit-converter',
    title: 'Universal Unit Converter',
    shortDescription: 'Convert measurements across Length, Weight, Temperature, Digital Storage, Area, and Speed.',
    fullDescription: 'All-in-one unit and measurement conversion tool. Instant two-way conversions between Metric and Imperial systems with quick swap functionality.',
    category: 'utilities',
    route: '/tools/unit-converter',
    icon: 'activity',
    badge: '6 Units',
    isPopular: true,
    keywords: ['unit converter', 'length converter', 'weight converter', 'temperature converter', 'celsius to fahrenheit', 'bytes to mb'],
    features: [
      '6 Measurement Categories: Length, Weight, Temp, Storage, Area, Speed',
      'Bidirectional live calculation as you type',
      'Quick swap button to reverse from/to units',
      'Precise scientific conversion formulas'
    ],
    howToSteps: [
      { name: 'Select Category', text: 'Choose between Length, Weight, Temperature, Storage, Area, or Speed.' },
      { name: 'Enter Value', text: 'Type a number in the input box.' },
      { name: 'Select Units', text: 'Pick your source and target units to view instant results.' }
    ],
    faqs: [
      { question: 'Why does 1 MB equal 1,024 KB?', answer: 'Digital storage uses base-2 binary math (2^10 = 1,024) rather than base-10 decimal metric prefixes.' }
    ]
  },
  {
    id: 'base64-tool',
    title: 'JWT Decoder & Base64 Converter',
    shortDescription: 'Decode JSON Web Tokens (JWT) with expiry validation, encode/decode Base64 strings, and URL parameters.',
    fullDescription: 'Essential developer security and data tool. Inspect JWT Headers, Payloads, and Signatures with active/expired status alerts, plus two-way UTF-8 Base64 and URL encoding.',
    category: 'developer',
    route: '/tools/base64-tool',
    icon: 'shield',
    badge: 'Developer',
    isPopular: true,
    keywords: ['jwt decoder', 'decode jwt', 'base64 encoder', 'base64 decoder', 'url encode', 'json web token parser'],
    features: [
      'JWT Header, Payload, and Signature colored inspection',
      'Token expiration timestamp calculation with live status',
      'UTF-8 safe Base64 encode and decode',
      'URL component encoding and decoding',
      'One-click section copy buttons'
    ],
    howToSteps: [
      { name: 'Select Tab', text: 'Choose JWT Decoder, Base64, or URL mode.' },
      { name: 'Paste Token or Text', text: 'Enter your string in the editor.' },
      { name: 'View Output', text: 'Inspect formatted JSON claims or copy converted strings.' }
    ],
    faqs: [
      { question: 'Is my secret JWT token uploaded anywhere?', answer: 'No. All string decoding is performed locally inside your browser memory.' }
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
    badge: 'JSON & CSV',
    keywords: ['json formatter', 'json beautifier', 'json validator', 'json to csv', 'format json online', 'json parser', 'minify json'],
    features: [
      'Instant JSON syntax error detection with error message',
      'Prettify with custom indentation (2 or 4 spaces)',
      'One-click JSON minification for API payloads',
      'Convert JSON arrays directly into downloadable CSV tables'
    ],
    howToSteps: [
      { name: 'Paste JSON', text: 'Paste your raw JSON text into the editor.' },
      { name: 'Format or Convert', text: 'Click Format JSON or Export to CSV.' }
    ],
    faqs: [
      { question: 'Is my JSON data safe?', answer: 'Completely. All parsing occurs strictly inside your web browser.' }
    ]
  },
  // --- 4. EVERYDAY & STUDENT TOOLS ---
  {
    id: 'readme-to-pdf',
    title: 'README to PDF Converter',
    shortDescription: 'Convert GitHub README.md or Markdown documentation into styled, printable A4 PDF documents.',
    fullDescription: 'Professional in-browser documentation converter. Formats markdown tables, syntax-highlighted code blocks, and headings into publication-grade multi-page PDFs with zero server uploads.',
    category: 'documents',
    route: '/tools/readme-to-pdf',
    icon: 'file-text',
    badge: 'Markdown A4',
    isPopular: true,
    keywords: ['readme', 'markdown', 'pdf', 'github', 'convert md to pdf', 'documentation', 'markdown to pdf'],
    features: [
      '100% Private in-browser conversion',
      'GitHub-flavored Markdown & syntax highlighting',
      'Clean A4 multi-page pagination',
      'Zero server upload or data storage'
    ],
    howToSteps: [
      { name: 'Upload Markdown', text: 'Select your README.md file or paste raw markdown.' },
      { name: 'Preview', text: 'Inspect the live rendered preview.' },
      { name: 'Download PDF', text: 'Click Convert to save your formatted PDF.' }
    ],
    faqs: [
      { question: 'Is my documentation uploaded to a server?', answer: 'No. All parsing and PDF rendering happen entirely in your browser.' }
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
    badge: 'Text Metrics',
    isPopular: true,
    keywords: ['word counter', 'character count', 'reading time', 'essay counter', 'case converter', 'uppercase lowercase', 'sentence counter'],
    features: [
      'Real-time word, character, and sentence calculation',
      'Estimated reading and speaking time metrics',
      'Character counts with and without spaces',
      'One-click Case Converters'
    ],
    howToSteps: [
      { name: 'Paste Text', text: 'Enter your essay or article text.' },
      { name: 'View Metrics', text: 'Review live statistics and reading duration.' }
    ],
    faqs: [
      { question: 'What is the reading time calculation based on?', answer: 'Based on the average adult reading speed of 200 words per minute.' }
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
    badge: '4.0 & 10.0',
    keywords: ['gpa calculator', 'cgpa calculator', 'grade calculator', 'college gpa', 'semester gpa', 'credit hours'],
    features: [
      'Supports 4.0 Standard Scale and 10.0 CGPA Scale',
      'Weighted credit hours calculation',
      'Add unlimited course rows with instant updates',
      'Auto-saves courses in browser storage'
    ],
    howToSteps: [
      { name: 'Choose Scale', text: 'Select between 4.0 GPA scale or 10.0 CGPA scale.' },
      { name: 'Enter Courses', text: 'Input course names, credit hours, and letter grades.' }
    ],
    faqs: [
      { question: 'Does this save my entered courses?', answer: 'Yes! Course lists are saved in your local browser storage.' }
    ]
  },
  {
    id: 'age-calculator',
    title: 'Age & Date Duration Calculator',
    shortDescription: 'Calculate exact age in years, months, days, hours, and minutes, plus days until next birthday.',
    fullDescription: 'Accurate date of birth calculator. Verifies exact age down to hours and minutes for government job applications, visa requirements, school admissions, and birthday countdowns.',
    category: 'utilities',
    route: '/tools/age-calculator',
    icon: 'calendar',
    badge: 'Date Math',
    keywords: ['age calculator', 'date calculator', 'calculate age', 'birthday countdown', 'exact age in days'],
    features: [
      'Exact age breakdown in Years, Months, and Days',
      'Upcoming birthday countdown in days',
      'Total lifetime metrics in months, weeks, days, and hours',
      'Leap year and calendar day accurate'
    ],
    howToSteps: [
      { name: 'Enter Date of Birth', text: 'Select your birth date.' },
      { name: 'Pick Target Date', text: 'Leave as today or choose a custom target date.' }
    ],
    faqs: [
      { question: 'Does this account for leap years?', answer: 'Yes, leap years and varying month lengths are calculated dynamically.' }
    ]
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage & Discount Calculator',
    shortDescription: 'Calculate percentage of any number, percentage increase or decrease, and final sale prices.',
    fullDescription: 'Multi-mode percentage calculator. Quickly compute X% of any value, calculate percentage change from original to new numbers, and determine final prices with discounts and taxes.',
    category: 'utilities',
    route: '/tools/percentage-calculator',
    icon: 'percent',
    badge: 'Math',
    keywords: ['percentage calculator', 'discount calculator', 'percent change', 'percent increase', 'sale price calculator'],
    features: [
      'Percentage of a number (What is X% of Y?)',
      'Percentage change (Increase / Decrease between two values)',
      'Shopping discount and sales tax calculator',
      'Instant live calculation'
    ],
    howToSteps: [
      { name: 'Choose Mode', text: 'Find percentage of a value, percent change, or sale discount.' },
      { name: 'Enter Numbers', text: 'Type values in the input boxes to view instant results.' }
    ],
    faqs: [
      { question: 'How is percentage increase calculated?', answer: 'Formula: ((New Value - Old Value) / |Old Value|) × 100.' }
    ]
  },
  {
    id: 'tip-calculator',
    title: 'Tip & Bill Splitter',
    shortDescription: 'Calculate tip amounts and split restaurant or party bills evenly between friends.',
    fullDescription: 'Everyday dining companion. Enter your total bill, choose from common tip percentages (10%, 15%, 18%, 20%), and adjust the guest counter to see the exact share per person.',
    category: 'utilities',
    route: '/tools/tip-calculator',
    icon: 'users',
    badge: 'Bill Splitter',
    keywords: ['tip calculator', 'bill splitter', 'split bill', 'restaurant tip', 'tip per person'],
    features: [
      'Preset tip percentage chips and custom slider',
      'Interactive guest counter to split bills evenly',
      'Total bill, total tip, and individual share breakdown',
      'Mobile-friendly for quick table calculations'
    ],
    howToSteps: [
      { name: 'Enter Bill', text: 'Type total bill amount before tip.' },
      { name: 'Select Tip %', text: 'Choose a tip percentage preset or slider.' },
      { name: 'Select Guests', text: 'Set number of people to calculate share per person.' }
    ],
    faqs: [
      { question: 'What is standard tipping etiquette?', answer: '15% to 20% is customary in North America for standard table service.' }
    ]
  }
];
