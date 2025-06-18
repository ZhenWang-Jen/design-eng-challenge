"use client";
import React, { useState, useRef, useEffect } from "react";

type Option = { value: string; label: string };

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
};

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeValue = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div className="relative min-w-[200px]" ref={ref}>
      <div
        className="flex flex-wrap items-center gap-1 border rounded px-2 py-1 bg-white cursor-pointer min-h-[38px]"
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}
      >
        {selected.length === 0 && (
          <span className="text-gray-400">{placeholder || "Select..."}</span>
        )}
        {selected.map((val) => {
          const opt = options.find((o) => o.value === val);
          return (
            <span
              key={val}
              className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
              onClick={e => { e.stopPropagation(); removeValue(val); }}
            >
              {opt?.label || val}
              <button className="ml-1" tabIndex={-1}>&times;</button>
            </span>
          );
        })}
        <span className="ml-auto text-gray-400 text-xs">▼</span>
      </div>
      {open && (
        <div className="absolute left-0 mt-1 w-full bg-white border rounded shadow z-10 max-h-48 overflow-auto">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggleValue(opt.value)}
                className="accent-blue-500"
              />
              <span className="text-gray-800 text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect; 