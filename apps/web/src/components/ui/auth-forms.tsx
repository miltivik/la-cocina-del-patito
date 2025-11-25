import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "../loader";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const router = useRouter();
	const { isPending } = authClient.useSession();
	const [showPassword, setShowPassword] = useState(false);
	const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

	async function handleSocialSignIn(provider: "google" | "apple") {
		try {
			setLoadingProvider(provider);
			await authClient.signIn.social({
				provider,
				callbackURL: window.location.origin + "/"
			});
		} catch (err: any) {
			toast.error(err?.message ?? "Social sign-in failed");
		} finally {
			setLoadingProvider(null);
		}
	}

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						router.push("/");
						toast.success("Sign in successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="flex items-center justify-center bg-background px-4">
			<div className="w-full max-w-md">
				<h1 className="mb-6 text-center text-3xl font-bold">Bienvenida Princesa</h1>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<div>
						<form.Field name="email">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Email</Label>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors.map((error) => (
										<p key={error?.message} className="text-red-500">
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field name="password">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Contraseña</Label>
									<div className="relative">
										<Input
											id={field.name}
											name={field.name}
											type={showPassword ? "text" : "password"}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className="pr-10"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
									{field.state.meta.errors.map((error) => (
										<p key={error?.message} className="text-red-500">
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>
					</div>

					<form.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="w-full cursor-pointer"
								isDisabled={!state.canSubmit || state.isSubmitting}
							>
								{state.isSubmitting ? "Submitting..." : "Sign In"}
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center mb-6">
					<Button
						variant="link"
						onClick={onSwitchToSignUp}
						className="text-pink-600 hover:text-pink-800 hover:no-underline hover:scale-105 transition-all duration-100 cursor-pointer"
					>
						Aun no tienes cuenta mi amor? Crea una
					</Button>
				</div>

				{/* Social login buttons */}
				<div className="flex flex-col gap-3">
					<Button
						variant="outline"
						className="w-full h-12 rounded-lg flex cursor-pointer items-center justify-center gap-3"
						onClick={() => handleSocialSignIn("google")}
						isDisabled={loadingProvider !== null}
					>
						<Image
							src="/svg/google.svg"
							alt="Google"
							width={20}
							height={20}
						/>
						Continue with Google
					</Button>
				</div>
			</div>
		</div>
	);
}

export function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const router = useRouter();
	const { isPending } = authClient.useSession();
	const [showPassword, setShowPassword] = useState(false);
	const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

	async function handleSocialSignIn(provider: "google" | "apple") {
		try {
			setLoadingProvider(provider);
			await authClient.signIn.social({
				provider,
				callbackURL: window.location.origin + "/"
			});
		} catch (err: any) {
			toast.error(err?.message ?? "Social sign-in failed");
		} finally {
			setLoadingProvider(null);
		}
	}

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onSuccess: () => {
						router.push("/");
						toast.success("Sign up successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="flex items-center justify-center bg-background px-4">
			<div className="w-full max-w-md">
				<h1 className="mb-6 text-center text-3xl font-bold">Crear Cuenta</h1>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4 mb-6"
				>
					<div>
						<form.Field name="name">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Nombre</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors.map((error) => (
										<p key={error?.message} className="text-red-500">
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field name="email">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Email</Label>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									{field.state.meta.errors.map((error) => (
										<p key={error?.message} className="text-red-500">
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field name="password">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Contraseña</Label>
									<div className="relative">
										<Input
											id={field.name}
											name={field.name}
											type={showPassword ? "text" : "password"}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className="pr-10"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
									{field.state.meta.errors.map((error) => (
										<p key={error?.message} className="text-red-500">
											{error?.message}
										</p>
									))}
								</div>
							)}
						</form.Field>
					</div>

					<form.Subscribe>
						{(state) => (
							<Button
								type="submit"
								className="w-full cursor-pointer"
								isDisabled={!state.canSubmit || state.isSubmitting}
							>
								{state.isSubmitting ? "Submitting..." : "Sign Up"}
							</Button>
						)}
					</form.Subscribe>
				</form>

				<div className="mt-4 text-center mb-6 ">
					<Button
						variant="link"
						onClick={onSwitchToSignIn}
						className="text-pink-600 hover:text-pink-800 hover:no-underline hover:scale-105 transition-all duration-100 cursor-pointer"
					>
						Ya tienes una cuenta preciosa? Inicia sesión
					</Button>
				</div>

				{/* Social login buttons */}
				<div className="flex flex-col gap-3">
					<Button
						variant="outline"
						className="w-full h-12 rounded-lg cursor-pointer flex items-center justify-center gap-3"
						onClick={() => handleSocialSignIn("google")}
						isDisabled={loadingProvider !== null}
					>
						<Image
							src="/svg/google.svg"
							alt="Google"
							width={20}
							height={20}
						/>
						Continue with Google
					</Button>
				</div>
			</div>
		</div>
	);
}
