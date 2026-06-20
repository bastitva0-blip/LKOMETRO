import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Landmark, X } from "lucide-react";
import { searchAll, SearchResult } from "@/lib/stationSearch";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSelectStation: (stationId: string) => void;
  className?: string;
}

export const SearchBar = ({ placeholder = "Search stations or landmarks…", onSelectStation, className }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(searchAll(query));
  }, [query]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    const stationId = result.type === "station" ? result.id : result.landmark?.nearestStationId;
    if (stationId) {
      onSelectStation(stationId);
      setQuery(result.label);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-11 rounded-lg border border-input bg-background pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-[1200] mt-1.5 w-full rounded-lg border border-border bg-popover shadow-lg max-h-72 overflow-y-auto">
          {results.map((r) => (
            <button
              key={`${r.type}-${r.id}`}
              onClick={() => handleSelect(r)}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-accent/10 transition-colors border-b border-border last:border-0"
            >
              {r.type === "station" ? (
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              ) : (
                <Landmark className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.label}</p>
                {r.sublabel && <p className="text-xs text-muted-foreground truncate">{r.sublabel}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute z-[1200] mt-1.5 w-full rounded-lg border border-border bg-popover shadow-lg px-3 py-3 text-sm text-muted-foreground">
          No stations or landmarks found for "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
