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
    contextLabel?: string; // "Porque te gustan las ensaladas", "Nueva receta trending", etc.
}

// Recetas Recomendadas Mock
export const recommendedRecipes: Recipe[] = [
    {
        id: "rec-1",
        title: "Ensalada Quinoa Vibrante",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
        cookTime: 20,
        calories: 350,
        difficulty: "Fácil",
        category: "Almuerzo",
        tags: ["vegano", "saludable", "ensalada"],
        contextLabel: "Porque te gustan las ensaladas",
    },
    {
        id: "rec-2",
        title: "Pizza Clásica de Pepperoni",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
        cookTime: 45,
        calories: 800,
        difficulty: "Media",
        category: "Cena",
        tags: ["italiana", "pizza"],
    },
    {
        id: "rec-3",
        title: "Panqueques Esponjosos de Suero de Leche",
        imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
        cookTime: 25,
        calories: 500,
        difficulty: "Fácil",
        category: "Desayuno",
        tags: ["desayuno", "dulce"],
    },
    {
        id: "rec-4",
        title: "Ensalada Mediterránea de Garbanzos",
        imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
        cookTime: 15,
        calories: 320,
        difficulty: "Fácil",
        category: "Almuerzo",
        tags: ["vegano", "mediterránea", "ensalada"],
        contextLabel: "Nueva receta trending",
    },
    {
        id: "rec-5",
        title: "Pollo al Limón y Hierbas en una Sartén",
        imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
        cookTime: 40,
        calories: 650,
        difficulty: "Media",
        category: "Cena",
        tags: ["pollo", "rápido"],
    },
    {
        id: "rec-6",
        title: "Tacos de Pescado con Salsa de Mango",
        imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
        cookTime: 30,
        calories: 450,
        difficulty: "Media",
        category: "Cena",
        tags: ["mexicana", "pescado"],
        contextLabel: "Popular esta semana",
    },
    {
        id: "rec-7",
        title: "Brownies de Chocolate y Nueces",
        imageUrl: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=300&fit=crop",
        cookTime: 35,
        calories: 550,
        difficulty: "Fácil",
        category: "Postre",
        tags: ["postre", "chocolate"],
    },
];

// Recetas en Tendencia Mock
export const trendingRecipes: Recipe[] = [
    {
        id: "trend-1",
        title: "Sopa Cremosa de Tomate y Albahaca",
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
        cookTime: 30,
        calories: 400,
        difficulty: "Fácil",
        category: "Almuerzo",
        tags: ["sopa", "vegetariana"],
    },
    {
        id: "trend-2",
        title: "Bowl de Smoothie Verde Detox",
        imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
        cookTime: 10,
        calories: 250,
        difficulty: "Fácil",
        category: "Desayuno",
        tags: ["smoothie", "vegano", "saludable"],
    },
    {
        id: "trend-3",
        title: "Salmón a la Plancha con Espárragos",
        imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
        cookTime: 25,
        calories: 450,
        difficulty: "Media",
        category: "Cena",
        tags: ["pescado", "saludable"],
    },
    {
        id: "trend-4",
        title: "Pasta Carbonara Tradicional",
        imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop",
        cookTime: 20,
        calories: 720,
        difficulty: "Media",
        category: "Cena",
        tags: ["italiana", "pasta"],
    },
    {
        id: "trend-5",
        title: "Bowl de Açaí con Granola",
        imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
        cookTime: 10,
        calories: 380,
        difficulty: "Fácil",
        category: "Desayuno",
        tags: ["bowl", "saludable", "vegano"],
    },
    {
        id: "trend-6",
        title: "Curry Tailandés de Pollo",
        imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
        cookTime: 35,
        calories: 580,
        difficulty: "Media",
        category: "Cena",
        tags: ["tailandesa", "curry", "pollo"],
    },
];

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
