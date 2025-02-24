import { Button } from "@/components/ui/button";
import { SearchResult } from "@/types/search";
import { Download } from "lucide-react";

interface SearchResultsProps {
  results: SearchResult[];
  onDownload: () => void;
  onNextStep?: () => void;
  isLoading: boolean;
}

const SearchResults = ({
  results,
  onDownload,
  onNextStep,
  isLoading,
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Searching and processing results...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        No results yet. Enter a keyword and select a country to search.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Search Results</h3>
        <div className="flex gap-2">
          <Button onClick={onDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download Results
          </Button>
          {onNextStep && (
            <Button
              onClick={onNextStep}
              variant="default"
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              Next Step
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-slate-200 space-y-2"
          >
            <h4 className="font-medium text-blue-600">
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
            </h4>
            <p className="text-sm text-slate-600">{result.snippet}</p>
            <div className="text-xs truncate">
              <span className="text-slate-400">{result.url}</span>
              {result.error && (
                <span className="text-red-500 ml-2">
                  (Error: {result.error})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
