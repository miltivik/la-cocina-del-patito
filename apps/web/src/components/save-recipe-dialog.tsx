"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SaveRecipeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, isPublic: boolean) => void;
    initialTitle?: string;
}

export function SaveRecipeDialog({ isOpen, onClose, onSave, initialTitle = "" }: SaveRecipeDialogProps) {
    const [title, setTitle] = useState(initialTitle);
    const [isPublic, setIsPublic] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border rounded-xl shadow-lg w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <h2 className="text-xl font-semibold mb-4">Save Recipe</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Give your recipe a name to save it to your dashboard.
                </p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="text-sm font-medium block mb-1.5">
                            Recipe Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Delicious Pasta Carbonara"
                            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-md">
                        <input
                            id="isPublic"
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2"
                        />
                        <label htmlFor="isPublic" className="flex-1 cursor-pointer">
                            <div className="text-sm font-medium">Make this recipe public</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                                Public recipes can be shared with anyone via link
                            </div>
                        </label>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-md">
                        <input
                            id="isPrivate"
                            type="checkbox"
                            checked={!isPublic}
                            onChange={(e) => setIsPublic(!e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2"
                        />
                        <label htmlFor="isPrivate" className="flex-1 cursor-pointer">
                            <div className="text-sm font-medium">Make this recipe private</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                                Private recipes can only be shared with users you invite
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (title.trim()) {
                                    onSave(title, isPublic);
                                    setTitle("");
                                    setIsPublic(false);
                                }
                            }}
                            disabled={!title.trim()}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Recipe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
