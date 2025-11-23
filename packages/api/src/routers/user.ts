import { protectedProcedure } from "../index";
import { db } from "@la-cocina-del-patito/db";
import { user } from "@la-cocina-del-patito/db/schema/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { uploadProfileImage, validateImage } from "../utils/s3";

const updateProfileSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    bio: z.string().max(500).optional(),
});

const uploadImageSchema = z.object({
    image: z.string(), // base64 encoded image
    contentType: z.string(),
});

const deleteAccountSchema = z.object({
    confirmationToken: z.string().min(1),
});

export const userRouter = {
    getProfile: protectedProcedure.handler(async ({ context }) => {
        const userId = context.session.user.id;

        const [userProfile] = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                bio: user.bio,
            })
            .from(user)
            .where(eq(user.id, userId));

        if (!userProfile) {
            throw new Error("User not found");
        }

        return {
            success: true,
            user: userProfile,
        };
    }),

    updateProfile: protectedProcedure
        .input(updateProfileSchema)
        .handler(async ({ context, input }) => {
            const userId = context.session.user.id;

            // Build the update object with only provided fields
            const updateData: Record<string, any> = {
                updatedAt: new Date(),
            };

            if (input.name !== undefined) {
                updateData.name = input.name;
            }

            if (input.bio !== undefined) {
                updateData.bio = input.bio;
            }

            // Update the user in the database
            const [updatedUser] = await db
                .update(user)
                .set(updateData)
                .where(eq(user.id, userId))
                .returning();

            if (!updatedUser) {
                throw new Error("Failed to update user");
            }

            return {
                success: true,
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    image: updatedUser.image,
                    bio: updatedUser.bio,
                },
            };
        }),

    uploadProfileImage: protectedProcedure
        .input(uploadImageSchema)
        .handler(async ({ context, input }) => {
            const userId = context.session.user.id;

            // Decode base64 image
            const base64Data = input.image.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64Data, "base64");

            // Validate the image
            await validateImage(imageBuffer, input.contentType);

            // Upload to S3
            const imageUrl = await uploadProfileImage({
                userId,
                file: imageBuffer,
                contentType: input.contentType,
            });

            // Update user in database
            const [updatedUser] = await db
                .update(user)
                .set({
                    image: imageUrl,
                    updatedAt: new Date(),
                })
                .where(eq(user.id, userId))
                .returning();

            if (!updatedUser) {
                throw new Error("Failed to update user image");
            }

            return {
                success: true,
                imageUrl,
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    image: updatedUser.image,
                    bio: updatedUser.bio,
                },
            };
        }),

    deleteAccount: protectedProcedure
        .input(deleteAccountSchema)
        .handler(async ({ context, input }) => {
            const userId = context.session.user.id;

            // Validate confirmation token (should be "DELETE" for extra security)
            if (input.confirmationToken !== "DELETE") {
                throw new Error("Invalid confirmation token. Please type DELETE to confirm.");
            }

            // Delete the user - cascade delete will handle:
            // - saved_recipe (onDelete: cascade)
            // - session (onDelete: cascade)
            // - account (onDelete: cascade)
            const [deletedUser] = await db
                .delete(user)
                .where(eq(user.id, userId))
                .returning();

            if (!deletedUser) {
                throw new Error("Failed to delete account");
            }

            return {
                success: true,
                message: "Account successfully deleted",
            };
        }),
};
