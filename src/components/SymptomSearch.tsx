
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, Search, X } from 'lucide-react';
import { Symptom } from '@/types/health';
import { searchSymptoms } from '@/data/symptoms';

interface SymptomSearchProps {
  onSelectSymptom: (symptom: Symptom) => void;
  placeholder?: string;
  className?: string;
}

const SymptomSearch: React.FC<SymptomSearchProps> = ({ 
  onSelectSymptom, 
  placeholder = "Search symptoms...", 
  className = "" 
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<Symptom[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim().length >= 2) {
      const results = searchSymptoms(inputValue);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [inputValue]);

  const handleSelect = (symptom: Symptom) => {
    onSelectSymptom(symptom);
    setInputValue('');
    setOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    }
  };

  // No changes needed to the component body, just ensuring it's properly using hooks
  return (
    <div className={`w-full ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={handleInputKeyDown}
              className="w-full focus-visible:ring-emerald-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {inputValue ? (
                <button onClick={handleClear} className="text-gray-400 hover:text-gray-500">
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <Search className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No symptoms found</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {searchResults.map((symptom) => (
                  <CommandItem
                    key={symptom.id}
                    onSelect={() => handleSelect(symptom)}
                    className="flex items-center cursor-pointer hover:bg-emerald-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{symptom.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{symptom.description}</div>
                      <div className="text-[10px] text-muted-foreground italic">Category: {symptom.category}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SymptomSearch;
