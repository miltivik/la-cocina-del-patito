import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";
import { db, savedRecipe, eq, and, desc } from "@la-cocina-del-patito/db";

export const savedRecipesRouter = {
    create: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                content: z.any(), // Using any for JSON content, or could be specific schema
            }),
        )
        .handler(async ({ input, context }) => {
            const [recipe] = await db
                .insert(savedRecipe)
                .values({
                    userId: context.session.user.id,
                    title: input.title,
                    content: input.content,
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

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().optional(),
                isPublic: z.boolean().optional(),
            }),
        )
        .handler(async ({ input, context }) => {
            const [updated] = await db
                .update(savedRecipe)
                .set({
                    ...(input.title ? { title: input.title } : {}),
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
