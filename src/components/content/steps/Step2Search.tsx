import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Download } from "lucide-react";
import { COUNTRY_CODES } from "@/types/search";
import { SearchResult } from "@/types/search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  searchGoogle,
  fetchPageContent,
  htmlToMarkdown,
  downloadTextFile,
} from "@/lib/search";
import { ModelConfig, SearchConfig } from "../ContentWizard";

export interface Step2SearchProps {
  config: SearchConfig;
  modelConfig: ModelConfig;
  onNext: (results: SearchResult[]) => void;
  onBack: () => void;
}

const Step2Search = ({
  config,
  modelConfig,
  onNext,
  onBack,
}: Step2SearchProps) => {
  const [keyword, setKeyword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [progressMessage, setProgressMessage] = useState("");
  const [currentProgress, setCurrentProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [hasErrors, setHasErrors] = useState(false);

  const handleSearch = async () => {
    setResults([]);
    setHasErrors(false);
    if (!keyword.trim() || !config) return;

    setIsLoading(true);
    setCurrentProgress(0);
    setTotalProgress(0);

    try {
      const searchResults = await searchGoogle(
        keyword,
        selectedCountry,
        config.apiKey,
        config.searchEngineId,
        (msg) => {
          setProgressMessage(msg);
          // Extract progress numbers from message if available
          const match = msg.match(/(\d+)\s*\/\s*(\d+)/);
          if (match) {
            setCurrentProgress(parseInt(match[1]));
            setTotalProgress(parseInt(match[2]));
          }
        },
      );

      // Check if any results have errors
      const hasContentErrors = searchResults.some((result) => result.error);
      setHasErrors(hasContentErrors);

      setResults(searchResults);

      if (hasContentErrors) {
        setProgressMessage(
          "Some content couldn't be fetched due to access restrictions. Results may be incomplete.",
        );
      } else {
        setProgressMessage("Search complete!");
      }
    } catch (error) {
      console.error("Search failed:", error);
      setProgressMessage(
        `Error: ${error instanceof Error ? error.message : "Search failed"}`,
      );
      setHasErrors(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (results.length === 0) return;

    const content = results
      .map((result) => {
        // Convert HTML content to markdown if available
        const markdownContent = result.content
          ? htmlToMarkdown(result.content)
          : result.snippet || "No content available";

        // Create a formatted markdown document
        return `# ${result.title}\n\nSource: ${result.url}\n\n## Summary\n${result.snippet || "No summary available"}\n\n## Full Content\n${markdownContent}\n\n---\n`;
      })
      .join("\n");

    // Use the search keyword as the filename
    downloadTextFile(`${keyword.replace(/\\s+/g, "-")}.txt`, content);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Step 2: Content Research</h2>
          <p className="text-sm text-muted-foreground">
            Search and analyze content from different regions
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter search keyword..."
          className="flex-1"
        />
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="gap-2" disabled={isLoading}>
          <Search className="h-4 w-4" />
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {(isLoading || progressMessage) && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          )}
          <div
            className={`text-center font-medium ${hasErrors ? "text-amber-600" : "text-slate-500"}`}
          >
            {progressMessage || "Initializing search..."}
          </div>
          {totalProgress > 0 && (
            <div className="w-full max-w-md">
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentProgress / totalProgress) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-slate-500 text-center mt-2">
                {currentProgress} of {totalProgress}
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Search Results</h3>
            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Results
              </Button>
              <Button onClick={() => onNext(results)} className="gap-2">
                Next Step
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-slate-200 space-y-2"
              >
                <h4 className="font-medium text-blue-600">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.title}
                  </a>
                </h4>
                <p className="text-sm text-slate-600">{result.snippet}</p>
                {result.error && (
                  <p className="text-xs text-red-500">Error: {result.error}</p>
                )}
                <div className="text-xs text-slate-400">{result.url}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && !results.length && !progressMessage && (
        <div className="flex items-center justify-center py-8 text-slate-500">
          No results yet. Enter a keyword and select a country to search.
        </div>
      )}
    </div>
  );
};

export default Step2Search;
