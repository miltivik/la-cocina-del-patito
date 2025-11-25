"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Settings,
    CreditCard,
    Bell,
    Shield,
    LogOut,
    Moon,
    Sun,
    Laptop,
    ChevronRight,
    Camera,
    Mail,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "account", label: "Account", icon: Shield },
    // { id: "notifications", label: "Notifications", icon: Bell },
    // { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    };

    if (isPending) {
        return (
            <div className="container max-w-6xl mx-auto p-6 space-y-8">
                <Skeleton className="h-12 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        );
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    return (
        <div className="container max-w-6xl mx-auto p-6 min-h-[calc(100vh-4rem)]">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                {/* Sidebar */}
                <nav className="space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Icon
                                    className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                        }`}
                                />
                                {item.label}
                                {isActive && (
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Content Area */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === "profile" && (
                                <ProfileTab
                                    session={session}
                                />
                            )}

                            {activeTab === "appearance" && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Appearance</CardTitle>
                                            <CardDescription>
                                                Customize how the application looks on your device.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <Label>Theme</Label>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <button
                                                        onClick={() => setTheme("light")}
                                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === "light"
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:border-muted-foreground/50"
                                                            }`}
                                                    >
                                                        <div className="p-2 rounded-full bg-white border shadow-sm">
                                                            <Sun className="w-5 h-5 text-orange-500" />
                                                        </div>
                                                        <span className="text-sm font-medium">Light</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setTheme("dark")}
                                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === "dark"
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:border-muted-foreground/50"
                                                            }`}
                                                    >
                                                        <div className="p-2 rounded-full bg-slate-950 border shadow-sm">
                                                            <Moon className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <span className="text-sm font-medium">Dark</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setTheme("system")}
                                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === "system"
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:border-muted-foreground/50"
                                                            }`}
                                                    >
                                                        <div className="p-2 rounded-full bg-muted border shadow-sm">
                                                            <Laptop className="w-5 h-5 text-foreground" />
                                                        </div>
                                                        <span className="text-sm font-medium">System</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}


                            {activeTab === "account" && (
                                <AccountTab
                                    session={session}
                                    handleSignOut={handleSignOut}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}


// ProfileTab Component
function ProfileTab({ session }: { session: any }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const fileInputRef = useState<HTMLInputElement | null>(null);

    // Load profile data from backend on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { client } = await import("@/utils/orpc");
                const response = await client.user.getProfile();

                if (response.success && response.user) {
                    setName(response.user.name || "");
                    setBio(response.user.bio || "");
                    setPreviewImage(response.user.image || null);
                }
            } catch (error) {
                console.error("Failed to load profile:", error);
                // Fallback to session data
                setName(session.user.name || "");
                setBio("");
                setPreviewImage(session.user.image || null);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        loadProfile();
    }, [session.user.name, session.user.image]);

    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        setIsUpdating(true);
        try {
            const { client } = await import("@/utils/orpc");
            await client.user.updateProfile({
                name: name.trim(),
                bio: bio.trim() || undefined,
            });

            toast.success("Profile updated successfully!");
            // Refresh the profile data
            const response = await client.user.getProfile();
            if (response.success && response.user) {
                setName(response.user.name || "");
                setBio(response.user.bio || "");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleImageClick = () => {
        if (fileInputRef[0]) {
            fileInputRef[0].click();
        }
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error("Only JPG, PNG, and WebP images are supported");
            return;
        }

        // Validate file size (2MB max)
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > MAX_SIZE) {
            toast.error("Image must be smaller than 2MB");
            return;
        }

        // Validate dimensions (1024x1024 max)
        const validateDimensions = () => new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                if (img.width > 1024 || img.height > 1024) {
                    toast.error("Image dimensions must not exceed 1024x1024px");
                    resolve(false);
                } else {
                    resolve(true);
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                toast.error("Failed to validate image");
                resolve(false);
            };
            img.src = URL.createObjectURL(file);
        });

        const isDimensionsValid = await validateDimensions();
        if (!isDimensionsValid) return;

        setIsUploadingImage(true);

        try {
            // Dynamically import the compression library
            const imageCompression = (await import('browser-image-compression')).default;

            // Compress and resize image
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 512,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);

            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                setPreviewImage(base64String);

                // Upload to server
                try {
                    const { client } = await import("@/utils/orpc");
                    await client.user.uploadProfileImage({
                        image: base64String,
                        contentType: compressedFile.type,
                    });

                    toast.success("Profile picture updated!");
                    // Refresh the profile data
                    const response = await client.user.getProfile();
                    if (response.success && response.user) {
                        setPreviewImage(response.user.image || null);
                    }
                } catch (error: any) {
                    toast.error(error.message || "Failed to upload image");
                    // Restore original image on error
                    setPreviewImage(session.user.image || null);
                }
            };

            reader.readAsDataURL(compressedFile);
        } catch (error: any) {
            toast.error("Failed to process image");
            console.error(error);
        } finally {
            setIsUploadingImage(false);
            // Reset input so same file can be uploaded again
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        Update your profile details and public information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div
                            className="relative group cursor-pointer"
                            onClick={handleImageClick}
                        >
                            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt={session.user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-muted-foreground" />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {isUploadingImage ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Camera className="w-6 h-6 text-white" />
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-medium">Profile Picture</h3>
                            <p className="text-sm text-muted-foreground">
                                Click to upload a new photo. JPG, PNG or WebP.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Max size: 2MB, max dimensions: 1024x1024px. Image will be resized to 512x512px.
                            </p>
                        </div>
                        <input
                            ref={(el) => fileInputRef[1](el)}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                maxLength={100}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us a little about yourself"
                                maxLength={500}
                            />
                            <p className="text-xs text-muted-foreground">
                                {bio.length}/500 characters
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t px-6 py-4">
                    <Button
                        onClick={handleUpdateProfile}
                        isDisabled={isUpdating}
                    >
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

// AccountTab Component
function AccountTab({ session, handleSignOut }: { session: any; handleSignOut: () => void }) {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== "DELETE") {
            toast.error("Please type DELETE to confirm");
            return;
        }

        setIsDeleting(true);
        try {
            const { client } = await import("@/utils/orpc");
            await client.user.deleteAccount({
                confirmationToken: deleteConfirmation,
            });

            toast.success("Account deleted successfully");

            // Sign out and redirect to home
            await handleSignOut();
            router.push("/");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete account");
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>
                            Manage your account credentials and security.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        defaultValue={session.user.email}
                                        disabled
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Your email address is managed via your sign-in provider.
                            </p>
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="text-sm font-medium mb-4 text-destructive">
                                Danger Zone
                            </h3>
                            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                                <div className="space-y-1">
                                    <p className="font-medium text-destructive">
                                        Delete Account
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently remove your account and all data.
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t px-6 py-4 bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                            Need to sign out?
                        </p>
                        <Button variant="outline" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-background border rounded-lg shadow-lg max-w-md w-full mx-4"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-destructive/10 rounded-full">
                                    <Trash2 className="w-6 h-6 text-destructive" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">Delete Account</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="delete-confirm">
                                    Type <span className="font-mono font-bold">DELETE</span> to confirm
                                </Label>
                                <Input
                                    id="delete-confirm"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="DELETE"
                                    className="font-mono"
                                    disabled={isDeleting}
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmation("");
                                    }}
                                    isDisabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteAccount}
                                    isDisabled={isDeleting || deleteConfirmation !== "DELETE"}
                                >
                                    {isDeleting ? "Deleting..." : "Delete Account"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
