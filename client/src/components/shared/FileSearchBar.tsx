import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FileSearchBar = ({ value, onChange, placeholder = "Search files..." }: FileSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-surface-elevated border-border/60 focus:border-primary focus:ring-primary/20"
      />
    </div>
  );
};