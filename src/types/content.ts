export interface Step {
  title: string;
  description: string;
}

export interface WorkedExample {
  title: string;
  scenario: string;
  inputs: { label: string; value: string }[];
  steps: string[];
  output: { label: string; value: string }[];
  explanation: string;
}

export interface ContentBlock {
  heading: string;
  body: string;
}

export interface SourceCitation {
  name: string;
  url: string;
  notes?: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface UseCase {
  title: string;
  description: string;
  audience: string;
}

export interface Methodology {
  formulaTitle: string;
  formulaDescription: string;
  mathFormula: string;
  datum: string;
  precision: string;
  limitations: string[];
  sources: SourceCitation[];
}

export interface PersonRef {
  name: string;
  role: string;
  profileUrl?: string;
}

export interface ToolContent {
  slug: string;
  primaryKeyword: string;
  searchIntent: string;
  directAnswer: string;
  howTo: Step[];
  examples: WorkedExample[];
  resultExplanation: ContentBlock[];
  methodology: Methodology;
  limitations: string[];
  useCases: UseCase[];
  troubleshooting: QA[];
  faqs: QA[];
  sources: SourceCitation[];
  reviewer: PersonRef;
  reviewedAt: string;
  contentHash: string;
}
