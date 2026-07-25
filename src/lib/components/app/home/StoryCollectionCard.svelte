<script lang="ts">
	import { Library, ChevronRight } from '@lucide/svelte';

	interface Props {
		storiesLearned: number;
		href?: string;
	}

	let { storiesLearned, href = '/story-studio' }: Props = $props();
</script>

<a
	{href}
	class="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition hover:bg-muted sm:p-6"
>
	<div class="flex items-center gap-3">
		<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-primary">
			<Library class="h-5 w-5" />
		</div>
		<div>
			<p class="text-sm font-semibold text-foreground">Koleksi Cerita</p>
			<p class="text-sm text-muted-foreground">{storiesLearned} Cerita Dipelajari</p>
		</div>
	</div>
	<ChevronRight class="h-5 w-5 text-muted-foreground" />
</a>
