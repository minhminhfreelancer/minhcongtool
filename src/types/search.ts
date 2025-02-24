export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
  htmlContent?: string;
  markdownContent?: string;
  error?: string;
}

export interface CountryCode {
  code: string;
  name: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "us", name: "United States" },
  { code: "uk", name: "United Kingdom" },
  { code: "au", name: "Australia" },
  { code: "ca", name: "Canada" },
  { code: "in", name: "India" },
  { code: "sg", name: "Singapore" },
  { code: "vn", name: "Vietnam" },
];
