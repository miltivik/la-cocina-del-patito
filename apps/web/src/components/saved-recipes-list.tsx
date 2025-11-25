"use client";

import { client } from "@/utils/orpc";
import { Pencil, Trash, Share2, ExternalLink, Lock, Globe, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function SavedRecipesList() {
    const { data: recipes, isLoading, refetch } = useQuery({
        queryKey: ['savedRecipes', 'list'],
        queryFn: async () => {
            return await client.savedRecipes.list({});
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (data: { id: string }) => {
            return await client.savedRecipes.delete(data);
        },
        onSuccess: () => {
            toast.success("Receta eliminada");
            refetch();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: { id: string; title?: string; isPublic?: boolean }) => {
            return await client.savedRecipes.update(data);
        },
        onSuccess: () => {
            toast.success("Receta actualizada");
            refetch();
            setEditingId(null);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const toggleVisibilityMutation = useMutation({
        mutationFn: async (data: { id: string; isPublic: boolean }) => {
            return await client.savedRecipes.update(data);
        },
        onSuccess: (_, variables) => {
            toast.success(variables.isPublic ? "Receta ahora es pública" : "Receta ahora es privada");
            refetch();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);

    const handleShare = (recipe: any) => {
        if (!recipe.isPublic) {
            toast.warning("Esta receta es privada. Hazla pública para compartirla.", {
                duration: 4000,
            });
            return;
        }
        const url = `${window.location.origin}/share/${recipe.id}`;
        navigator.clipboard.writeText(url);
        toast.success("¡Link copiado! Cualquiera puede ver esta receta.");
    };

    const toggleVisibility = (id: string, currentState: boolean) => {
        toggleVisibilityMutation.mutate({ id, isPublic: !currentState });
    };

    const handleDeleteClick = (id: string) => {
        console.log("Delete button clicked for recipe:", id);
        setRecipeToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (recipeToDelete) {
            console.log("Confirming delete for:", recipeToDelete);
            deleteMutation.mutate({ id: recipeToDelete });
            setShowDeleteModal(false);
            setRecipeToDelete(null);
        }
    };

    const cancelDelete = () => {
        console.log("Delete cancelled");
        setShowDeleteModal(false);
        setRecipeToDelete(null);
    };

    const startEditing = (id: string, currentTitle: string) => {
        setEditingId(id);
        setEditTitle(currentTitle);
    };

    const saveEdit = (id: string) => {
        updateMutation.mutate({ id, title: editTitle });
    };

    if (isLoading) {
        return <div className="text-center py-8">Cargando recetas guardadas...</div>;
    }

    if (!recipes?.length) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground">No tienes recetas guardadas aún.</p>
                <p className="text-sm text-muted-foreground mt-1">
                    ¡Ve al Chat AI para crear y guardar algunas!
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe: any) => (
                    <div
                        key={recipe.id}
                        className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                {editingId === recipe.id ? (
                                    <div className="flex items-center gap-2 w-full">
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="flex-1 bg-background border rounded px-2 py-1 text-sm"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => saveEdit(recipe.id)}
                                            className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg truncate pr-2" title={recipe.title}>
                                            {recipe.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${recipe.isPublic
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                }`}>
                                                {recipe.isPublic ? (
                                                    <><Globe className="w-3 h-3" /> Pública</>
                                                ) : (
                                                    <><Lock className="w-3 h-3" /> Privada</>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-4">
                                {new Date(recipe.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t mt-2">
                            <div className="flex gap-1">
                                <button
                                    onClick={() => toggleVisibility(recipe.id, recipe.isPublic)}
                                    className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                                    title={recipe.isPublic ? "Hacer Privada" : "Hacer Pública"}
                                >
                                    {recipe.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => handleShare(recipe)}
                                    className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                                    title="Compartir Link"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                                <Link
                                    href={`/share/${recipe.id}` as any}
                                    target="_blank"
                                    className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                                    title="Abrir Página Pública"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => startEditing(recipe.id, recipe.title)}
                                    className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                                    title="Renombrar"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(recipe.id)}
                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-muted-foreground hover:text-red-600 transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-background border rounded-xl shadow-lg max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <Trash className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">Eliminar Receta</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    ¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <button
                                onClick={cancelDelete}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
