export interface Recipe {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    cookTime: number; // en minutos
    calories: number;
    difficulty: "Fácil" | "Media" | "Difícil";
    category: "Cena" | "Desayuno" | "Almuerzo" | "Postre" | "Snack";
    tags: string[];
    isSaved?: boolean;
    contextLabel?: string; // "Por Juan García", "Reciente", etc.
}

// Utility functions for filtering and searching
import type { FilterOption } from "@/components/filter-chips";

export function filterRecipes(recipes: Recipe[], filter: FilterOption): Recipe[] {
    switch (filter) {
        case "Todos":
            return recipes;

        case "Cena":
            return recipes.filter(recipe => recipe.category === "Cena");

        case "Rápido y Fácil":
            return recipes.filter(recipe =>
                recipe.cookTime <= 30 && recipe.difficulty === "Fácil"
            );

        case "Vegano":
            return recipes.filter(recipe =>
                recipe.tags.some(tag => tag.toLowerCase().includes("vegano"))
            );

        case "Más Filtros":
            // Por ahora retorna todo, en el futuro abrirá un modal
            return recipes;

        default:
            return recipes;
    }
}

export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
    if (!query || query.trim() === "") {
        return recipes;
    }

    const searchLower = query.toLowerCase().trim();

    return recipes.filter(recipe => {
        // Buscar en el título
        if (recipe.title.toLowerCase().includes(searchLower)) {
            return true;
        }

        // Buscar en los tags
        if (recipe.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
            return true;
        }

        // Buscar en la categoría
        if (recipe.category.toLowerCase().includes(searchLower)) {
            return true;
        }

        return false;
    });
}

