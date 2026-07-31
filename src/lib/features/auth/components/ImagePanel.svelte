<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';

	export interface Slide {
		/** Real image URL. Omit to fall back to the generated dune art below. */
		image?: string;
		alt?: string;
		caption?: [string, string];
		/** CSS art fallback (used only when `image` isn't provided) */
		sky?: string;
		ridge?: string;
	}

	interface Props {
		slides?: Slide[];
		websiteUrl?: string;
		/** ms per slide */
		intervalMs?: number;
	}

	const defaultSlides: Slide[] = [
		{
			caption: ['Capturing Moments,', 'Creating Memories'],
			sky: 'linear-gradient(180deg, #47137c 0%, #300757 38%, #16002b 70%, #07000e 100%)',
			ridge: 'linear-gradient(100deg, #d5a7ff 0%, #8843ff 22%, #5400e4 45%, #240046 70%)'
		},
		{
			caption: ['Every Frame Tells', 'A Quiet Story'],
			sky: 'linear-gradient(180deg, #601d98 0%, #3c096c 38%, #18042b 70%, #07000e 100%)',
			ridge: 'linear-gradient(100deg, #ecdcf8 0%, #b078e0 24%, #7b2cbf 48%, #240046 72%)'
		},
		{
			caption: ['Made For The Way', 'You Remember'],
			sky: 'linear-gradient(180deg, #7a21d4 0%, #47137c 38%, #16002b 70%, #07000e 100%)',
			ridge: 'linear-gradient(100deg, #f4e5ff 0%, #d399ff 22%, #9d4edd 46%, #300757 70%)'
		}
	];

	let { slides = defaultSlides, websiteUrl = '/', intervalMs = 5000 }: Props = $props();

	let active = $state(0);

	function goTo(index: number) {
		active = ((index % slides.length) + slides.length) % slides.length;
	}

	// Re-runs (and resets the timer) every time `active` changes, whether
	// that change came from the interval below or a manual dot click.
	$effect(() => {
		const current = active;
		void current;
		const id = setInterval(() => {
			active = (active + 1) % slides.length;
		}, intervalMs);
		return () => clearInterval(id);
	});
</script>

<div class="relative h-full w-full overflow-hidden rounded-2xl">
	{#each slides as slide, i (slide.image ?? i)}
		<div
			class="absolute inset-0 transition-opacity duration-700 ease-out"
			style:opacity={i === active ? 1 : 0}
			aria-hidden={i !== active}
		>
			{#if slide.image}
				<img
					src={slide.image}
					alt={slide.alt ?? ''}
					class="h-full w-full object-cover"
					loading={i === 0 ? 'eager' : 'lazy'}
				/>
			{:else}
				<div class="absolute inset-0" style:background={slide.sky}></div>
				<div
					class="absolute inset-x-0 bottom-0 h-2/3"
					style:background={slide.ridge}
					style:clip-path="polygon(0% 55%, 22% 38%, 46% 58%, 68% 30%, 100% 50%, 100% 100%, 0% 100%)"
					style:animation="duneDrift 18s ease-in-out infinite alternate"
				></div>
				<div
					class="absolute inset-x-0 bottom-0 h-1/2 bg-dark-amethyst-200/70"
					style:clip-path="polygon(0% 70%, 30% 55%, 60% 78%, 100% 60%, 100% 100%, 0% 100%)"
				></div>
			{/if}
		</div>
	{/each}

	<!-- vignette for text legibility -->
	<div
		class="pointer-events-none absolute inset-0 bg-linear-to-t from-dark-amethyst-100/90 via-transparent to-dark-amethyst-100/30"
	></div>

	<!-- back to website: top-left, no logo in this panel -->
	<a
		href={websiteUrl}
		class="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-mauve-500 focus-visible:outline-none"
	>
		<ArrowLeft class="h-4 w-4" />
		Back to website
	</a>

	<!-- caption -->
	<div class="absolute inset-x-8 bottom-8">
		{#if slides[active]?.caption}
			{#key active}
				<h2
					class="animate-[fadeSlide_0.5s_ease-out] font-display text-3xl leading-tight font-semibold text-white"
				>
					{slides[active].caption?.[0]}<br />
					{slides[active].caption?.[1]}
				</h2>
			{/key}
		{/if}

		<!-- progress indicators: clickable, gradient-fill instead of plain dots -->
		<div class="mt-5 flex gap-2">
			{#each slides as _, i (i)}
				<button
					type="button"
					aria-label={`Go to slide ${i + 1}`}
					aria-current={i === active}
					class="h-1 max-w-10 flex-1 overflow-hidden rounded-full bg-white/20"
					onclick={() => goTo(i)}
				>
					{#if i === active}
						{#key active}
							<span
								class="block h-full rounded-full bg-white"
								style:animation={`slideFill ${intervalMs}ms linear`}
							></span>
						{/key}
					{:else if i < active}
						<span class="block h-full w-full rounded-full bg-white/70"></span>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</div>
