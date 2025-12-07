"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Response } from "@/components/response";
import { useEffect, useRef, useState } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { SaveRecipeDialog } from "@/components/save-recipe-dialog";
import { client } from "@/utils/orpc";
import { toast } from "sonner";

export default function AIPage() {
	const { messages, sendMessage, stop } = useChat({
		transport: new DefaultChatTransport({
			api: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat`,
		}),
	});
	const [isLoading, setIsLoading] = useState(false);
	const [saveDialogOpen, setSaveDialogOpen] = useState(false);
	const [messageToSave, setMessageToSave] = useState<any>(null);

	const saveMutation = useMutation({
		mutationFn: async (data: { title: string; content: any; isPublic?: boolean; imageUrl?: string }) => {
			return await client.savedRecipes.create(data);
		},
		onSuccess: () => {
			toast.success("Recipe saved successfully!");
			setSaveDialogOpen(false);
		},
		onError: (error: Error) => {
			toast.error(`Failed to save: ${error.message}`);
		},
	});

	console.log("Messages:", messages);

	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		// Reset loading state when a new assistant message is received
		const lastMessage = messages[messages.length - 1];
		if (lastMessage?.role === "assistant") {
			setIsLoading(false);
		}
	}, [messages]);

	const handleSaveClick = (message: any) => {
		setMessageToSave(message);
		setSaveDialogOpen(true);
	};

	const handleSaveConfirm = (title: string, isPublic: boolean, imageUrl?: string) => {
		if (messageToSave) {
			saveMutation.mutate({
				title,
				content: messageToSave,
				isPublic,
				imageUrl,
			});
		}
	};

	return (
		<div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
			<SaveRecipeDialog
				isOpen={saveDialogOpen}
				onClose={() => setSaveDialogOpen(false)}
				onSave={handleSaveConfirm}
			/>
			<div className="flex-1 overflow-y-auto p-4">
				<div className="max-w-3xl mx-auto space-y-6 pb-4">
					{messages.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center space-y-4 mt-20">
							<h2 className="text-2xl font-semibold text-foreground">
								Que es lo que quieres cocinar ahora preciosa?
							</h2>
						</div>
					) : (
						messages.map((message) => (
							<div
								key={message.id}
								className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`flex gap-3 max-w-[85%] ${message.role === "user"
										? "flex-row-reverse"
										: "flex-row"
										}`}
								>
									<div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
										{message.role === "user" ? (
											<div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
												U
											</div>
										) : (
											<img src="/images/Logo-patito.jpg" alt="AI Logo" className="w-full h-full object-cover" />
										)}
									</div>
									<div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
										<span className="text-md font-bold text-black mb-2 dark:text-white">
											{message.role === "user" ? "Tú" : "Chef Patito"}
										</span>
										<div className={`prose dark:prose-invert max-w-none p-4 rounded-xl relative group ${message.role === "user" ? "bg-rose-300/80 dark:bg-primary/10 " : "bg-red-300/80 dark:bg-secondary/40"}`}>
											{message.role === "assistant" && (
												<button
													onClick={() => handleSaveClick(message)}
													className="absolute top-2 right-2 p-1.5 bg-background/50 hover:bg-background rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
													title="Save Recipe"
												>
													<Save className="w-4 h-4 text-foreground" />
												</button>
											)}
											{message.parts?.map((part, index) => {
												if (part.type === "text") {
													return message.role === "assistant" ? (
														<Response key={index}>{part.text}</Response>
													) : (
														<p key={index} className="whitespace-pre-wrap">{part.text}</p>
													);
												}
												return null;
											})}
										</div>
									</div>
								</div>
							</div>
						))
					)}
					<div ref={messagesEndRef} />
				</div>
			</div>

			<div className="p-4 ">
				<div className="max-w-3xl mx-auto w-full">
					<PromptInputBox
						onSend={async (message, files, signal) => {
							if (message.trim()) {
								console.log("Sending message:", message);
								setIsLoading(true);
								await sendMessage({ role: "user", parts: [{ type: "text", text: message }] });
							}
						}}
						onCancel={() => {
							console.log("Cancelling generation");
							stop();
							setIsLoading(false);
						}}
						isLoading={isLoading}
						placeholder="Que comida rica haremos hoy?"
					/>
					<div className="text-center mt-2">
						<p className="text-xs text-foreground">
							Nuestro patito puede cometer errores. Revisa la informacion importante.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
