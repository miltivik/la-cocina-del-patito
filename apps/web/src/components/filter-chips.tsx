"use client";

import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterOption = "Todos" | "Cena" | "Rápido y Fácil" | "Vegano" | "Más Filtros";

interface FilterChipsProps {
    activeFilter: FilterOption;
    onFilterChange: (filter: FilterOption) => void;
}

const filters: FilterOption[] = ["Todos", "Cena", "Rápido y Fácil", "Vegano", "Más Filtros"];

export function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={cn(
                        "flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm font-medium leading-normal transition-colors duration-200",
                        activeFilter === filter
                            ? "bg-[#ffc5d3] text-[#8b0040] dark:bg-[#ffc5d3]/20 dark:text-[#ffc5d3]"
                            : "bg-muted text-foreground hover:bg-muted/80"
                    )}
                >
                    <span>{filter}</span>
                    {filter === "Más Filtros" && <SlidersHorizontal className="w-4 h-4" />}
                </button>
            ))}
        </div>
    );
}
