"use client";

import { type ComponentProps, memo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ResponseProps = ComponentProps<"div">;

export const Response = memo(
	({ className, children, ...props }: ResponseProps) => {
		const [displayedText, setDisplayedText] = useState("");
		const prevTextRef = useRef("");

		useEffect(() => {
			const currentText = children as string;
			if (currentText !== prevTextRef.current) {
				setDisplayedText(currentText);
				prevTextRef.current = currentText;
			}
		}, [children]);

		// Función para renderizar markdown básico
		const renderMarkdown = (text: string) => {
			return text
				// Headers
				.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
				.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
				.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
				// Bold
				.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
				// Italic
				.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
				// Lists
				.replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
				.replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
				// Code blocks (simple)
				.replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-md my-3 overflow-x-auto"><code>$1</code></pre>')
				// Inline code
				.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
				// Line breaks
				.replace(/\n/g, '<br/>')
				// Horizontal rules
				.replace(/^---$/gm, '<hr class="my-4 border-border"/>');
		};

		return (
			<div
				className={cn(
					"size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose prose-sm max-w-none",
					className,
				)}
				{...props}
				dangerouslySetInnerHTML={{ __html: renderMarkdown(displayedText) }}
			/>
		);
	},
	(prevProps, nextProps) => prevProps.children === nextProps.children,
);

Response.displayName = "Response";
