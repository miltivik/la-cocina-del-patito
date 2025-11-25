"use client"

import * as React from "react"
import { Slot as SlotPrimitive } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
	Button as AriaButton,
	composeRenderProps,
	type ButtonProps as AriaButtonProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	[
		"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300",
		/* Disabled */
		"data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ",
		/* Focus Visible */
		"data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
		/* Resets */
		"focus-visible:outline-none",
	],
	{
		variants: {
			variant: {
				default:
					"bg-white text-pink-950 border border-pink-100 shadow-sm data-[hovered]:bg-pink-50 data-[hovered]:shadow-md data-[hovered]:-translate-y-0.5 dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800 dark:data-[hovered]:bg-zinc-900 dark:data-[hovered]:shadow-zinc-900/20",
				destructive:
					"bg-destructive text-destructive-foreground data-[hovered]:bg-destructive/90",
				outline:
					"border border-input bg-background data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground data-[hovered]:bg-secondary/80",
				ghost: "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
				link: "text-primary underline-offset-4 data-[hovered]:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

interface ButtonProps
	extends AriaButtonProps,
	VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = ({ className, variant, size, asChild = false, ...props }: ButtonProps) => {
	if (asChild) {
		return (
			<SlotPrimitive
				className={cn(buttonVariants({ variant, size, className }))}
				{...props as any}
			/>
		)
	}

	return (
		<AriaButton
			className={composeRenderProps(className, (className, renderProps) =>
				cn(
					buttonVariants({
						variant,
						size,
						className,
					})
				)
			)}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
export type { ButtonProps }
