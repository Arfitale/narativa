<script lang="ts">
	import { Sun, Moon, Sunset } from '@lucide/svelte';

	interface Props {
		name: string;
		quote?: string;
	}

	let { name, quote = 'Setiap cerita dimulai dari satu kata.' }: Props = $props();

	const hour = new Date().getHours();
	const greeting =
		hour < 11
			? 'Selamat pagi'
			: hour < 15
				? 'Selamat siang'
				: hour < 18
					? 'Selamat sore'
					: 'Selamat malam';
	const TimeIcon = hour < 11 ? Sun : hour < 18 ? Sunset : Moon;
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
		<TimeIcon class="h-5 w-5 text-primary" />
		<span>{greeting} kembali, {name}</span>
	</div>
	<p class="text-sm text-muted-foreground italic sm:text-base">"{quote}"</p>
</div>
