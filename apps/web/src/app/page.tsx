"use client";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Footer } from "@/components/ui/large-name-footer";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { ScanIcon, GlobeIcon, TimerIcon, SaladIcon, Sparkles, ChefHat, ShoppingCart, Timer } from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";

const features = [
	{
		Icon: ScanIcon,
		name: "Escáner de Ingredientes",
		description: "Toma una foto del contenido de tu refrigerador y obtén ideas de recetas al instante.",
		href: "/ai",
		cta: "Probar ahora",
		background: <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=800&auto=format&fit=crop" alt="Ingredients" />,
		className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
	},
	{
		Icon: GlobeIcon,
		name: "Exploración de Cocina Global",
		description: "Descubre platillos auténticos y técnicas de todo el mundo.",
		href: "/ai",
		cta: "Explorar cocinas",
		background: <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop" alt="Global cuisine" />,
		className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
	},
	{
		Icon: TimerIcon,
		name: "Técnicas para Ahorrar Tiempo",
		description: "Aprende trucos inteligentes y atajos para preparar comidas gourmet más rápido.",
		href: "/ai",
		cta: "Ver técnicas",
		background: <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop" alt="Cooking" />,
		className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
	},
	{
		Icon: SaladIcon,
		name: "Adaptabilidad Dietética",
		description: "Modifica fácilmente las recetas para ajustarse a cualquier dieta, alergia o preferencia.",
		href: "/ai",
		cta: "Personalizar dieta",
		background: <img className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop" alt="Healthy food" />,
		className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-4",
	},
];

export default function Home() {
	const healthCheck = useQuery(orpc.healthCheck.queryOptions());

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<main className="text-center py-24 lg:py-40 relative overflow-hidden">
				<h1 className="text-5xl md:text-7xl lg:text-8xl font-black max-w-5xl mx-auto leading-tight text-gray-950 dark:text-gray-100 uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
					Eleva <br /> Tu Maestría <br /> Culinaria.
				</h1>
				<p className="mt-8 max-w-xl mx-auto text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed px-4">
					Desata tu chef interior con conocimientos potenciados por IA, recetas personalizadas y planificación inteligente de comidas.
				</p>
				<Button asChild size="lg" className="mt-12 px-10 py-6 text-xl font-bold bg-[#f4c6c6] text-gray-950 dark:text-gray-300 rounded-full hover:opacity-90 hover:dark:bg-white dark:hover:text-gray-950 transition-all shadow-lg uppercase tracking-wide">
					<Link href="/ai">Comienza Tu Viaje Culinario</Link>
				</Button>

				{/* Decorative blur effects */}
				<div className="absolute top-0 left-0 w-64 h-64 bg-[#f4c6c6]/20 dark:bg-[#f4c6c6]/10 rounded-full -translate-x-1/3 -translate-y-1/3 z-[-1] opacity-70 blur-3xl"></div>
				<div className="absolute bottom-0 right-0 w-80 h-80 bg-[#f4c6c6]/20 dark:bg-[#f4c6c6]/10 rounded-full translate-x-1/3 translate-y-1/3 z-[-1] opacity-70 blur-3xl"></div>
			</main>

			{/* The Culinary Process */}
			<section className="py-24 border-t border-b border-gray-200 dark:border-gray-800">
				<h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-gray-950 dark:text-gray-100 uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
					El Proceso Culinario
				</h2>
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto relative">
						{/* Step 01 */}
						<div className="flex flex-col items-center text-center relative px-4">
							<div className="font-bold text-7xl md:text-8xl text-[#f4c6c6] mb-6 drop-shadow-lg leading-none" style={{ fontFamily: 'var(--font-display)' }}>01</div>
							<h3 className="font-bold text-2xl mt-2 text-gray-950 dark:text-gray-100 uppercase tracking-wide">Define Tu Paladar</h3>
							<p className="mt-4 text-gray-700 dark:text-gray-300 max-w-xs">Comparte tus preferencias, necesidades dietéticas e ingredientes disponibles.</p>
							<div className="absolute top-1/2 right-0 w-px h-2/3 bg-gray-300 dark:bg-gray-700 hidden md:block translate-x-1/2 -translate-y-1/2"></div>
						</div>

						{/* Step 02 */}
						<div className="flex flex-col items-center text-center relative px-4">
							<div className="font-bold text-7xl md:text-8xl text-[#f4c6c6] mb-6 drop-shadow-lg leading-none" style={{ fontFamily: 'var(--font-display)' }}>02</div>
							<h3 className="font-bold text-2xl mt-2 text-gray-950 dark:text-gray-100 uppercase tracking-wide">Creación con IA</h3>
							<p className="mt-4 text-gray-700 dark:text-gray-300 max-w-xs">Recibe recetas personalizadas y planes de comida, diseñados inteligentemente para ti.</p>
							<div className="absolute top-1/2 right-0 w-px h-2/3 bg-gray-300 dark:bg-gray-700 hidden md:block translate-x-1/2 -translate-y-1/2"></div>
						</div>

						{/* Step 03 */}
						<div className="flex flex-col items-center text-center relative px-4">
							<div className="font-bold text-7xl md:text-8xl text-[#f4c6c6] mb-6 drop-shadow-lg leading-none" style={{ fontFamily: 'var(--font-display)' }}>03</div>
							<h3 className="font-bold text-2xl mt-2 text-gray-950 dark:text-gray-100 uppercase tracking-wide">Domina Tu Cocina</h3>
							<p className="mt-4 text-gray-700 dark:text-gray-300 max-w-xs">Ejecuta platillos sin esfuerzo con guía paso a paso y herramientas inteligentes.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Smart Culinary Co-Pilot */}
			<section className="py-24 container mx-auto px-4">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-4xl md:text-5xl font-extrabold text-gray-950 dark:text-gray-100 uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
						Tu Co-Piloto Culinario Inteligente
					</h2>
					<p className="mt-6 text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
						Desde la concepción inspirada hasta el plato exquisito, nuestro asistente de IA refina cada etapa de tu viaje culinario.
					</p>
				</div>

				<DisplayCards cards={[
					{
						icon: <ChefHat className="size-4 text-[#f4c6c6]" />,
						title: "Recetas Personalizadas",
						description: "Adaptadas a tu gusto único",
						date: "Potenciado por IA",
						iconClassName: "text-[#f4c6c6]",
						titleClassName: "text-gray-950 dark:text-gray-100",
						className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
					},
					{
						icon: <ShoppingCart className="size-4 text-[#f4c6c6]" />,
						title: "Lista de Compras Inteligente",
						description: "Optimiza tu preparación",
						date: "Auto-generada",
						iconClassName: "text-[#f4c6c6]",
						titleClassName: "text-gray-950 dark:text-gray-100",
						className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
					},
					{
						icon: <Timer className="size-4 text-[#f4c6c6]" />,
						title: "Guía de Cocina de Precisión",
						description: "Ejecución culinaria impecable",
						date: "Paso a paso",
						iconClassName: "text-[#f4c6c6]",
						titleClassName: "text-gray-950 dark:text-gray-100",
						className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
					},
				]} />
			</section>

			{/* Beyond the Basics */}
			<section className="py-24 border-t border-gray-200 dark:border-gray-800">
				<div className="container mx-auto px-4">
					<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-20 text-gray-950 dark:text-gray-100 uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
						Más Allá de lo Básico
					</h2>

					<BentoGrid className="lg:grid-rows-3 max-w-6xl mx-auto">
						{features.map((feature) => (
							<BentoCard key={feature.name} {...feature} />
						))}
					</BentoGrid>
				</div>
			</section>

			{/* Final CTA */}
			<section className="text-center py-24 lg:py-32 border-t border-gray-200 dark:border-gray-800">
				<div className="container mx-auto px-4">
					<h2 className="text-4xl md:text-5xl font-extrabold max-w-3xl mx-auto text-gray-950 dark:text-gray-100 uppercase tracking-wide leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
						¿Listo para Redefinir Tu Experiencia Culinaria?
					</h2>
					<p className="mt-8 max-w-xl mx-auto text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
						Únete a entusiastas culinarios exigentes y embarca en un viaje hacia comidas sofisticadas, sin esfuerzo y deliciosas.
					</p>
					<Button asChild size="lg" className="mt-12 px-10 py-6 text-xl font-bold bg-[#f4c6c6] text-gray-950 dark:text-gray-200 rounded-full hover:bg-[#f4c6c6]/80 hover:dark:bg-white hover:dark:text-gray-950 transition-all  shadow-lg uppercase tracking-wide">
						<Link href="/dashboard">Comienza Ahora</Link>
					</Button>
				</div>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
}
