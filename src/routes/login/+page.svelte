<script lang="ts">
	import ImagePanel, { type Slide } from '$lib/components/auth/ImagePanel.svelte';
	import SignUpForm, { type SignUpData } from '$lib/components/auth/SignUpForm.svelte';
	import { Sun, Moon } from '@lucide/svelte';

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

	// dark is the shipped default theme; toggling removes the `dark` class
	let isDark = $state(true);

	function handleSignUp(data: SignUpData) {
		console.log('sign up', data);
	}
</script>

<svelte:head>
	<title>Create an account · Narativa</title>
</svelte:head>

<div class={isDark ? 'dark' : ''}>
	<div class="min-h-screen w-full bg-background transition-colors">
		<div class="flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
			<div
				class="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-card shadow-2xl shadow-black/40 lg:grid-cols-2"
			>
				<!-- image slider: hidden on small screens, shown from lg up -->
				<div class="hidden p-3 lg:block">
					<ImagePanel {slides} />
				</div>

				<SignUpForm onSubmit={handleSignUp} />
			</div>
		</div>

		<!-- demo-only theme toggle so you can preview both modes -->
		<button
			type="button"
			class="fixed right-5 bottom-5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg"
			onclick={() => (isDark = !isDark)}
			aria-label="Toggle light/dark preview"
		>
			{#if isDark}
				<Sun class="h-4 w-4" />
			{:else}
				<Moon class="h-4 w-4" />
			{/if}
		</button>
	</div>
</div>
