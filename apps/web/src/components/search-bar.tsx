"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export function SearchBar({
    placeholder = "Buscar recetas, ingredientes o cocinas...",
    value,
    onChange,
    className = "",
}: SearchBarProps) {
    return (
        <div className={`w-full ${className}`}>
            <label className="flex flex-col h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-full h-full shadow-sm">
                    <div className="text-muted-foreground flex bg-card border border-r-0 border-border items-center justify-center pl-4 rounded-l-full">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-foreground focus:outline-0 focus:ring-2 focus:ring-ring border border-l-0 border-border bg-card h-full placeholder:text-muted-foreground px-3 rounded-l-none pl-1 text-base font-normal leading-normal"
                        placeholder={placeholder}
                    />
                </div>
            </label>
        </div>
    );
}
