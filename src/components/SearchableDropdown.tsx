import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';

interface SearchableDropdownProps {
  name: string;
  placeholder: string;
  options: string[];
  defaultValue?: string;
  required?: boolean;
}

export default function SearchableDropdown({
  name,
  placeholder,
  options,
  defaultValue = '',
  required = false
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // If defaultValue changes, update selectedValue
  useEffect(() => {
    setSelectedValue(defaultValue);
    if (defaultValue) {
      setSearchTerm(defaultValue);
    } else {
      setSearchTerm('');
    }
  }, [defaultValue]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset search term to selected value on close
        setSearchTerm(selectedValue);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedValue]);

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    
    return options
      .filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const aStart = a.toLowerCase().startsWith(searchTerm.toLowerCase());
        const bStart = b.toLowerCase().startsWith(searchTerm.toLowerCase());
        
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        return a.localeCompare(b);
      });
  }, [options, searchTerm]);

  const handleSelect = (val: string) => {
    setSelectedValue(val);
    setSearchTerm(val);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
    // If user cleared the input, also clear the selected value
    if (!e.target.value) {
      setSelectedValue('');
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
    // Auto-select text for easier editing
    inputRef.current?.select();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValue('');
    setSearchTerm('');
    inputRef.current?.focus();
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input to ensure native form submission works */}
      <input type="hidden" name={name} value={selectedValue} required={required} />
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 z-10 pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={() => setIsOpen(true)}
          className="w-full h-14 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer placeholder:text-slate-400"
          autoComplete="off"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              title="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              inputRef.current?.focus();
            }}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-185' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-64 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = option === selectedValue;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${
                    isSelected 
                      ? 'bg-emerald-50 text-emerald-700 font-bold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{option}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-4 py-4 text-sm text-slate-400 text-center font-medium">
              No cities found / کوئی شہر نہیں ملا
            </div>
          )}
        </div>
      )}
    </div>
  );
}
