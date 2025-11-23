import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import sharp from "sharp";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export interface UploadImageParams {
    userId: string;
    file: Buffer;
    contentType: string;
    filename?: string;
}

/**
 * Upload a profile image to S3
 * @returns The public URL of the uploaded image
 */
export async function uploadProfileImage({
    userId,
    file,
    contentType,
    filename = "avatar.jpg",
}: UploadImageParams): Promise<string> {
    const key = `profile-images/${userId}/${filename}`;

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file,
            ContentType: contentType,
        },
    });

    await upload.done();

    // Return the public URL
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

/**
 * Validate image file - checks size, type, and dimensions
 */
export async function validateImage(file: Buffer, contentType: string): Promise<void> {
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_WIDTH = 1024;
    const MAX_HEIGHT = 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

    // Check file size
    if (file.length > MAX_SIZE) {
        const sizeMB = (file.length / (1024 * 1024)).toFixed(2);
        throw new Error(`Image size exceeds 2MB limit. Your image is ${sizeMB}MB`);
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(contentType)) {
        throw new Error("Invalid image type. Only JPEG, PNG, and WebP are allowed");
    }

    // Check dimensions using sharp
    try {
        const metadata = await sharp(file).metadata();
        const width = metadata.width || 0;
        const height = metadata.height || 0;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            throw new Error(
                `Image dimensions exceed the maximum allowed (${MAX_WIDTH}x${MAX_HEIGHT}px). Your image is ${width}x${height}px`
            );
        }
    } catch (error: any) {
        // If it's already our error, re-throw it
        if (error.message.includes("dimensions exceed")) {
            throw error;
        }
        // Otherwise, it's a sharp error (invalid image)
        throw new Error("Invalid or corrupted image file");
    }
}
