import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { COUNTRY_CODES } from "@/types/search";
import { SearchResult } from "@/types/search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchGoogle, fetchPageContent, htmlToMarkdown } from "@/lib/search";

export interface Step2SearchProps {
  config: {
    apiKey: string;
    searchEngineId: string;
  };
  onNext: (results: SearchResult[]) => void;
}

const Step2Search = ({ config, onNext }: Step2SearchProps) => {
  const [keyword, setKeyword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setIsLoading(true);
    try {
      // Search Google
      const results = await searchGoogle(
        keyword,
        selectedCountry,
        config.apiKey,
        config.searchEngineId,
      );

      // Fetch and process content for each result
      const processedResults = await Promise.all(
        results.map(async (result) => {
          const { content: htmlContent, error } = await fetchPageContent(
            result.url,
          );
          const markdownContent = htmlContent
            ? htmlToMarkdown(htmlContent)
            : "";
          return {
            ...result,
            htmlContent,
            markdownContent,
            error,
          };
        }),
      );

      onNext(processedResults);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Search Content</h2>
        <p className="text-sm text-muted-foreground">
          Enter a keyword and select region to search for content
        </p>
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

      {isLoading && (
        <div className="flex items-center justify-center py-8 text-slate-500">
          Searching and processing results...
        </div>
      )}
    </div>
  );
};

export default Step2Search;
