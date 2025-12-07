"use client";

import { SavedRecipesList } from "@/components/saved-recipes-list";
import { SearchBar } from "@/components/search-bar";
import { FilterChips, type FilterOption } from "@/components/filter-chips";
import { RecommendedRecipes } from "@/components/recommended-recipes";
import { TrendingRecipes } from "@/components/trending-recipes";
import { SaveRecipeDialog } from "@/components/save-recipe-dialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/utils/orpc";
import { toast } from "sonner";
import type { Recipe } from "@/lib/mock-recipes";

export default function DashboardPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState<FilterOption>("Todos");
	const [saveDialogOpen, setSaveDialogOpen] = useState(false);
	const [recipeToSave, setRecipeToSave] = useState<Recipe | null>(null);
	const queryClient = useQueryClient();

	const saveMutation = useMutation({
		mutationFn: async (data: { title: string; content: any; isPublic: boolean; imageUrl?: string }) => {
			return await client.savedRecipes.create(data);
		},
		onSuccess: () => {
			toast.success("¡Receta guardada exitosamente!");
			setSaveDialogOpen(false);
			setRecipeToSave(null);
			// Refrescar todas las listas de recetas
			queryClient.invalidateQueries({ queryKey: ['savedRecipes'] });
		},
		onError: (error: Error) => {
			toast.error(`Error al guardar: ${error.message}`);
		},
	});

	const handleSaveRecipe = (recipe: Recipe) => {
		console.log("Opening save dialog for recipe:", recipe);
		setRecipeToSave(recipe);
		setSaveDialogOpen(true);
	};

	const handleConfirmSave = (title: string, isPublic: boolean, imageUrl?: string) => {
		if (!recipeToSave) return;

		// Crear el contenido de la receta en formato estructurado
		const recipeContent = {
			originalId: recipeToSave.id,
			description: recipeToSave.description || "",
			cookTime: recipeToSave.cookTime,
			calories: recipeToSave.calories,
			difficulty: recipeToSave.difficulty,
			category: recipeToSave.category,
			tags: recipeToSave.tags,
			// Aquí podrías agregar más detalles como ingredientes, pasos, etc.
		};

		saveMutation.mutate({
			title: title.trim(),
			content: recipeContent,
			isPublic,
			imageUrl: imageUrl || recipeToSave.imageUrl, // Usar la imagen provista o la original
		});
	};

	return (
		<div className="w-full">
			<div className="max-w-7xl mx-auto p-6 lg:p-8">
				{/* Hero Section */}
				<section className="mb-8">
					<h1 className="text-foreground text-2xl md:text-3xl font-black leading-tight tracking-[-0.033em] mb-2">
						¿Qué cocinamos hoy?
					</h1>
					<p className="text-muted-foreground text-base max-w-2xl">
						Descubre sugerencias personalizadas y encuentra tu próxima receta favorita.
					</p>
				</section>

				{/* Search & Filters */}
				<section className="mb-8">
					<div className="flex flex-col md:flex-row gap-4 items-center justify-start mb-4">
						<div className="w-full md:max-w-xl">
							<SearchBar
								value={searchQuery}
								onChange={setSearchQuery}
								placeholder="Buscar recetas, ingredientes o cocinas..."
							/>
						</div>
					</div>
					<FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
				</section>

				{/* Recetas Recomendadas */}
				<RecommendedRecipes
					activeFilter={activeFilter}
					searchQuery={searchQuery}
					onSaveRecipe={handleSaveRecipe}
				/>

				{/* Recetas en Tendencia */}
				<TrendingRecipes
					activeFilter={activeFilter}
					searchQuery={searchQuery}
					onSaveRecipe={handleSaveRecipe}
				/>

				{/* Tus Recetas Guardadas */}
				<section className="mb-8">
					<h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
						Tus Recetas Guardadas
					</h2>
					<SavedRecipesList />
				</section>
			</div>

			{/* Save Recipe Dialog */}
			<SaveRecipeDialog
				isOpen={saveDialogOpen}
				onClose={() => {
					setSaveDialogOpen(false);
					setRecipeToSave(null);
				}}
				onSave={handleConfirmSave}
				initialTitle={recipeToSave?.title || ""}
			/>
		</div>
	);
}
