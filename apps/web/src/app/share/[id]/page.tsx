import { client } from "@/utils/orpc";
import { Response } from "@/components/response";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const recipe = await client.savedRecipes.getPublic({ id });
        return {
            title: `${recipe.title} - La Cocina del Patito`,
            description: `Check out this recipe: ${recipe.title}`,
        };
    } catch (error) {
        return {
            title: "Recipe Not Found",
        };
    }
}

export default async function SharedRecipePage({ params }: PageProps) {
    const { id } = await params;
    let recipe;

    try {
        recipe = await client.savedRecipes.getPublic({ id });
    } catch (error) {
        notFound();
    }

    const content = recipe.content as any;

    return (
        <div className="container mx-auto max-w-3xl py-12 px-4">
            <div className="bg-card border rounded-xl p-8 shadow-lg">
                <header className="mb-8 border-b pb-6">
                    <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                    <p className="text-muted-foreground">
                        Shared by Chef Patito • {new Date(recipe.createdAt).toLocaleDateString()}
                    </p>
                </header>

                <div className="prose dark:prose-invert max-w-none">
                    {content.parts?.map((part: any, index: number) => {
                        if (part.type === "text") {
                            return <Response key={index}>{part.text}</Response>;
                        }
                        return null;
                    })}
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                    Want to create your own recipes?{" "}
                    <a href="/" className="text-primary hover:underline font-medium">
                        Ask Chef Patito
                    </a>
                </p>
            </div>
        </div>
    );
}
