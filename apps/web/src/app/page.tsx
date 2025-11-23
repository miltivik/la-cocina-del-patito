"use client";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Footer } from "@/components/ui/large-name-footer";


export default function Home() {
	const healthCheck = useQuery(orpc.healthCheck.queryOptions());

	return (
		<div className="min-h-screen from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950">
			{/* Hero Section */}
			<section className="container mx-auto px-4 py-16 text-center">
				<h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
					Bienvenida a la Cocina del Patito
				</h1>
				<p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
					Descubre, crea y comparte las mejores recetas culinarias. Con la ayuda de la inteligencia artificial,
					guarda tus recetas favoritas y compártelas con tus amigos.
				</p>
				<div className="flex gap-4 justify-center">
					<Button asChild size="lg">
						<Link href="/dashboard">Comenzar a Cocinar</Link>
					</Button>
					<Button variant="outline" size="lg" asChild>
						<Link href="/ai">Pedir Ayuda a AI</Link>
					</Button>
				</div>
			</section>

			{/* Features Section */}
			<section className="container mx-auto px-4 py-16">
				<h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
					¿Que puedes hacer?
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					<Card className="text-center">
						<CardHeader>
							<CardTitle className="text-2xl">🍳 Guardar Recetas</CardTitle>
							<CardDescription>
								Crea y guarda tus recetas favoritas en tu colección personal
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground mb-4">
								Organiza tus recetas por categorías, añade ingredientes y pasos detallados.
							</p>
							<Button variant="outline" asChild>
								<Link href="/dashboard">Ver Recetas</Link>
							</Button>
						</CardContent>
					</Card>

					<Card className="text-center">
						<CardHeader>
							<CardTitle className="text-2xl">🤖 Ayuda con AI</CardTitle>
							<CardDescription>
								Pide consejos a modelos de IA para mejorar tus recetas
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground mb-4">
								Obtén sugerencias de ingredientes, técnicas de cocina y variaciones creativas.
							</p>
							<Button variant="outline" asChild>
								<Link href="/ai">Chatear con AI</Link>
							</Button>
						</CardContent>
					</Card>

					<Card className="text-center">
						<CardHeader>
							<CardTitle className="text-2xl">👥 Compartir con Amigos</CardTitle>
							<CardDescription>
								Comparte tus creaciones culinarias con la comunidad
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground mb-4">
								Comparte recetas, fotos y consejos con otros amantes de la cocina.
							</p>
							<Button variant="outline">Próximamente</Button>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* CRUD Preview Section */}
			<section className="container mx-auto px-4 py-16">
				<h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
					Gestiona tus Recetas
				</h2>
				<Card className="max-w-4xl mx-auto">
					<CardHeader>
						<CardTitle>Panel de Recetas (Vista Previa)</CardTitle>
						<CardDescription>
							Aquí podrás crear, leer, actualizar y eliminar tus recetas favoritas
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<h3 className="font-semibold">Funcionalidades CRUD:</h3>
								<ul className="space-y-2 text-sm">
									<li>✅ <strong>Crear:</strong> Añade nuevas recetas con ingredientes y pasos</li>
									<li>✅ <strong>Leer:</strong> Visualiza todas tus recetas guardadas</li>
									<li>✅ <strong>Actualizar:</strong> Edita recetas existentes</li>
									<li>✅ <strong>Eliminar:</strong> Borra recetas que ya no necesites</li>
								</ul>
							</div>
							<div className="space-y-4">
								<h3 className="font-semibold">Características:</h3>
								<ul className="space-y-2 text-sm">
									<li>📝 Notas personales en cada receta</li>
									<li>🏷️ Etiquetas y categorías</li>
									<li>⭐ Sistema de calificación</li>
									<li>🔍 Búsqueda avanzada</li>
								</ul>
							</div>
						</div>
						<div className="mt-6 text-center">
							<Button asChild>
								<Link href="/dashboard">Ir al Dashboard</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
}
