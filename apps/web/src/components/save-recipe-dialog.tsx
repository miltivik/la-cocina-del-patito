"use client";

import { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface SaveRecipeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, isPublic: boolean, imageUrl?: string) => void;
    initialTitle?: string;
}

export function SaveRecipeDialog({ isOpen, onClose, onSave, initialTitle = "" }: SaveRecipeDialogProps) {
    const [title, setTitle] = useState(initialTitle);
    const [isPublic, setIsPublic] = useState(false);
    const [imageBase64, setImageBase64] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error("Solo se admiten imágenes JPG, PNG y WebP");
            return;
        }

        // Validate file size (5MB max)
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            toast.error("La imagen debe ser menor a 5MB");
            return;
        }

        setIsUploadingImage(true);

        try {
            // Dynamically import the compression library
            const imageCompression = (await import('browser-image-compression')).default;

            // Compress and resize image
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);

            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImageBase64(base64String);
                setPreviewImage(base64String);
                toast.success("Imagen cargada correctamente");
            };

            reader.readAsDataURL(compressedFile);
        } catch (error: any) {
            toast.error("Error al procesar la imagen");
            console.error(error);
        } finally {
            setIsUploadingImage(false);
            // Reset input
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    const handleSave = () => {
        if (title.trim()) {
            onSave(title, isPublic, imageBase64 || undefined);
            setTitle("");
            setIsPublic(false);
            setImageBase64("");
            setPreviewImage(null);
        }
    };

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
                    Give your recipe a name and optionally add an image.
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

                    <div>
                        <label className="text-sm font-medium block mb-1.5">
                            Recipe Image (optional)
                        </label>
                        <div className="flex gap-3">
                            {previewImage && (
                                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-border flex-shrink-0">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <button
                                onClick={handleImageClick}
                                disabled={isUploadingImage}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                            >
                                {isUploadingImage ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm">Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        {previewImage ? (
                                            <>
                                                <ImageIcon className="w-4 h-4" />
                                                <span className="text-sm">Cambiar imagen</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                <span className="text-sm">Subir imagen</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG o WebP. Máx 5MB. La imagen se optimizará automáticamente.
                        </p>
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
                            onClick={handleSave}
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
