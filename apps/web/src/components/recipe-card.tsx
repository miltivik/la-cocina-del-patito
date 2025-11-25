"use client";

import { Bookmark, Clock, BarChart3 } from "lucide-react";
import type { Recipe } from "@/lib/mock-recipes";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
    recipe: Recipe;
    variant?: "recommended" | "trending" | "saved";
    onSave?: () => void;
}

export function RecipeCard({ recipe, variant = "recommended", onSave }: RecipeCardProps) {
    const handleSaveClick = () => {
        if (onSave) {
            onSave();
        }
    };

    return (
        <div className="group relative flex flex-col rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-300 border border-border">
            {/* Imagen */}
            <div className="relative h-32 w-full">
                <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                />

                {/* Botón de guardar */}
                <button
                    onClick={handleSaveClick}
                    className="absolute top-2 right-2 bg-black/40 text-white rounded-full p-1.5 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    aria-label={recipe.isSaved ? "Guardada" : "Guardar receta"}
                >
                    <Bookmark
                        className={cn(
                            "w-5 h-5",
                            recipe.isSaved && "fill-current"
                        )}
                    />
                </button>

                {/* Badge contextual */}
                {recipe.contextLabel && (
                    <div className="absolute bottom-0 left-0 bg-black/80 dark:bg-white/90 text-white dark:text-black text-[10px] font-semibold px-2 py-1 rounded-tr-md backdrop-blur-sm">
                        {recipe.contextLabel}
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-foreground mb-1 leading-tight line-clamp-2 min-h-[40px]">
                    {recipe.title}
                </h3>

                {/* Metadatos */}
                <div className="flex items-center gap-3 text-muted-foreground text-xs mt-auto pt-1">
                    <div className="flex items-center gap-0.5" title="Tiempo de preparación">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-0.5" title="Dificultad">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>{recipe.difficulty}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
