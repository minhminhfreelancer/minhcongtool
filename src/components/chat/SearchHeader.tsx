import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { COUNTRY_CODES } from "@/types/search";
import ConfigGuide from "./ConfigGuide";
import ConfigManager from "./ConfigManager";
import { GoogleSearchConfig } from "@/lib/config";

export interface SearchHeaderProps {
  onConfigChange: (config: GoogleSearchConfig) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  onSearch: () => void;
}

const SearchHeader = ({
  keyword,
  onKeywordChange,
  selectedCountry,
  onCountryChange,
  onSearch,
  onConfigChange,
}: SearchHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
      <div className="flex items-center gap-4 flex-1">
        <ConfigGuide />
        <ConfigManager onConfigChange={onConfigChange} />
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Enter search keyword..."
          className="flex-1"
        />
        <Select value={selectedCountry} onValueChange={onCountryChange}>
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
        <Button onClick={onSearch} className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchHeader;
