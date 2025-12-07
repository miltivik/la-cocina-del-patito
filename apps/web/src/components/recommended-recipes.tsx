"use client";

import { RecipeCard } from "./recipe-card";
import { filterRecipes, searchRecipes, type Recipe } from "@/lib/mock-recipes";
import type { FilterOption } from "./filter-chips";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/utils/orpc";

interface RecommendedRecipesProps {
    activeFilter: FilterOption;
    searchQuery: string;
    onSaveRecipe: (recipe: Recipe) => void;
}

export function RecommendedRecipes({ activeFilter, searchQuery, onSaveRecipe }: RecommendedRecipesProps) {
    // Fetch public recipes from API
    const { data: apiRecipes, isLoading, error } = useQuery({
        queryKey: ['savedRecipes', 'listPublic'],
        queryFn: () => client.savedRecipes.listPublic({ limit: 20, offset: 0 }),
    });

    // Transform API recipes to match Recipe type and apply filters
    const filteredRecipes = useMemo(() => {
        if (!apiRecipes || apiRecipes.length === 0) return [];

        // Transform API response to Recipe format
        const recipes: Recipe[] = apiRecipes.map((r) => ({
            id: r.id,
            title: r.title,
            imageUrl: r.imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb0d6f87a?w=400&h=300&fit=crop",
            cookTime: (r.content as any)?.cookTime || 30,
            calories: (r.content as any)?.calories || 400,
            difficulty: (r.content as any)?.difficulty || "Media",
            category: (r.content as any)?.category || "Cena",
            tags: (r.content as any)?.tags || [],
            description: (r.content as any)?.description || "",
            contextLabel: r.authorName ? `Por ${r.authorName}` : undefined,
        }));

        // Apply category filter
        let result = filterRecipes(recipes, activeFilter);

        // Apply search
        result = searchRecipes(result, searchQuery);

        return result;
    }, [apiRecipes, activeFilter, searchQuery]);

    if (isLoading) {
        return (
            <section className="mb-12">
                <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
                    Recetas de la Comunidad
                </h2>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            </section>
        );
    }

    return (
        <section className="mb-12">
            <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
                Recetas de la Comunidad
            </h2>

            {filteredRecipes.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground font-semibold mb-1">
                        {apiRecipes?.length === 0
                            ? "Aún no hay recetas compartidas"
                            : "No encontramos recetas que coincidan"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {apiRecipes?.length === 0
                            ? "¡Sé el primero en compartir una receta!"
                            : "Intenta con otro filtro o palabra clave"}
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

