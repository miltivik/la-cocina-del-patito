import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../procedures";
import { db, savedRecipe, user, eq, and, desc } from "@la-cocina-del-patito/db";

export const savedRecipesRouter = {
    create: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                content: z.any(), // Using any for JSON content, or could be specific schema
                imageUrl: z.string().url().optional(),
                isPublic: z.boolean().optional().default(false),
            }),
        )
        .handler(async ({ input, context }) => {
            const [recipe] = await db
                .insert(savedRecipe)
                .values({
                    userId: context.session.user.id,
                    title: input.title,
                    content: input.content,
                    imageUrl: input.imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb0d6f87a?w=400&h=300&fit=crop",
                    isPublic: input.isPublic,
                })
                .returning();
            return recipe;
        }),

    list: protectedProcedure.handler(async ({ context }) => {
        return await db
            .select()
            .from(savedRecipe)
            .where(eq(savedRecipe.userId, context.session.user.id))
            .orderBy(desc(savedRecipe.createdAt));
    }),

    // List all public recipes from all users (for community/recommended section)
    listPublic: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(50).optional().default(20),
                offset: z.number().min(0).optional().default(0),
            }).optional(),
        )
        .handler(async ({ input }) => {
            const limit = input?.limit ?? 20;
            const offset = input?.offset ?? 0;

            const recipes = await db
                .select({
                    id: savedRecipe.id,
                    title: savedRecipe.title,
                    content: savedRecipe.content,
                    imageUrl: savedRecipe.imageUrl,
                    isPublic: savedRecipe.isPublic,
                    createdAt: savedRecipe.createdAt,
                    updatedAt: savedRecipe.updatedAt,
                    userId: savedRecipe.userId,
                    authorName: user.name,
                    authorImage: user.image,
                })
                .from(savedRecipe)
                .leftJoin(user, eq(savedRecipe.userId, user.id))
                .where(eq(savedRecipe.isPublic, true))
                .orderBy(desc(savedRecipe.createdAt))
                .limit(limit)
                .offset(offset);

            return recipes;
        }),

    // List recent public recipes (for trending section)
    listRecent: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(20).optional().default(10),
            }).optional(),
        )
        .handler(async ({ input }) => {
            const limit = input?.limit ?? 10;

            const recipes = await db
                .select({
                    id: savedRecipe.id,
                    title: savedRecipe.title,
                    content: savedRecipe.content,
                    imageUrl: savedRecipe.imageUrl,
                    isPublic: savedRecipe.isPublic,
                    createdAt: savedRecipe.createdAt,
                    updatedAt: savedRecipe.updatedAt,
                    userId: savedRecipe.userId,
                    authorName: user.name,
                    authorImage: user.image,
                })
                .from(savedRecipe)
                .leftJoin(user, eq(savedRecipe.userId, user.id))
                .where(eq(savedRecipe.isPublic, true))
                .orderBy(desc(savedRecipe.createdAt))
                .limit(limit);

            return recipes;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().optional(),
                imageUrl: z.string().url().optional(),
                isPublic: z.boolean().optional(),
            }),
        )
        .handler(async ({ input, context }) => {
            const [updated] = await db
                .update(savedRecipe)
                .set({
                    ...(input.title ? { title: input.title } : {}),
                    ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
                    ...(input.isPublic !== undefined ? { isPublic: input.isPublic } : {}),
                })
                .where(
                    and(
                        eq(savedRecipe.id, input.id),
                        eq(savedRecipe.userId, context.session.user.id),
                    ),
                )
                .returning();
            return updated;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .handler(async ({ input, context }) => {
            await db
                .delete(savedRecipe)
                .where(
                    and(
                        eq(savedRecipe.id, input.id),
                        eq(savedRecipe.userId, context.session.user.id),
                    ),
                );
            return { success: true };
        }),

    getPublic: publicProcedure
        .input(z.object({ id: z.string() }))
        .handler(async ({ input, context }) => {
            const recipe = await db.query.savedRecipe.findFirst({
                where: eq(savedRecipe.id, input.id),
            });

            if (!recipe) {
                throw new Error("Recipe not found");
            }

            // Allow access if public OR if the user is the owner
            if (recipe.isPublic) {
                return recipe;
            }

            if (context.session?.user?.id === recipe.userId) {
                return recipe;
            }

            throw new Error("Unauthorized");
        }),
};

