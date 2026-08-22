<script lang="ts">
	import ImagePanel, { type Slide } from '$lib/features/auth/components/ImagePanel.svelte';
	import SignUpForm from '$lib/features/auth/components/SignUpForm.svelte';
	import ModeToggle from '$lib/features/app/components/ModeToggle.svelte';

	// Swap these for your own photos any time — omit `image` on a slide to
	// fall back to the generated dune art instead.
	const slides: Slide[] = [
		{
			image:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvUcw0JJ5NGjvy9iI3XApdWsTywN1bNdnoR8BBlgPrLQ&s=10',
			alt: 'Desert dunes at twilight',
			caption: ['Capturing Moments,', 'Creating Memories']
		},
		{
			image: 'https://media.craiyon.com/2025-09-16/lOtPl91qR1C-1CZxwBFmXw.webp',
			alt: 'Layered mountain ridgelines at dusk',
			caption: ['Every Frame Tells', 'A Quiet Story']
		},
		{
			image:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR85ZJaqTjIU3Zk7d5w6ZylhdKQKXKywxuLGYu7YMn8YDWg7cKeym5GesyM&s=10',
			alt: 'Soft purple sky over rolling hills',
			caption: ['Made For The Way', 'You Remember']
		}
	];
</script>

<svelte:head>
	<title>Create an account · Narativa</title>
</svelte:head>

<div class="min-h-screen w-full bg-background transition-colors">
	<div class="flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
		<div
			class="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-card shadow-2xl shadow-black/40 lg:grid-cols-2"
		>
			<SignUpForm />
			<!-- image slider: hidden on small screens, shown from lg up -->
			<div class="hidden p-3 lg:block">
				<ImagePanel {slides} />
			</div>
		</div>
	</div>

	<div class="fixed right-5 bottom-5">
		<ModeToggle />
	</div>
</div>
