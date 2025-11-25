"use client";

import { RecipeCard } from "./recipe-card";
import { recommendedRecipes, filterRecipes, searchRecipes, type Recipe } from "@/lib/mock-recipes";
import type { FilterOption } from "./filter-chips";
import { UtensilsCrossed } from "lucide-react";
import { useMemo } from "react";

interface RecommendedRecipesProps {
    activeFilter: FilterOption;
    searchQuery: string;
    onSaveRecipe: (recipe: Recipe) => void;
}

export function RecommendedRecipes({ activeFilter, searchQuery, onSaveRecipe }: RecommendedRecipesProps) {
    // Aplicar filtros y búsqueda
    const filteredRecipes = useMemo(() => {
        // Primero aplicar filtro por categoría/tipo
        let result = filterRecipes(recommendedRecipes, activeFilter);

        // Luego aplicar búsqueda
        result = searchRecipes(result, searchQuery);

        return result;
    }, [activeFilter, searchQuery]);

    return (
        <section className="mb-12">
            <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
                Recetas Recomendadas
            </h2>

            {filteredRecipes.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground font-semibold mb-1">
                        No encontramos recetas que coincidan
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Intenta con otro filtro o palabra clave
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            variant="recommended"
                            onSave={() => onSaveRecipe(recipe)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
