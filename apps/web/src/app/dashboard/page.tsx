import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { SavedRecipesList } from "@/components/saved-recipes-list";

export default async function DashboardPage() {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
			throw: true,
		},
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">Welcome back, {session.user.name}</p>
				</div>
			</div>

			<div className="space-y-8">
				<section>
					<h2 className="text-xl font-semibold mb-4">Your Saved Recipes</h2>
					<SavedRecipesList />
				</section>
			</div>
		</div>
	);
}
