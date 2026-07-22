<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class={`flex items-center gap-2 ${className}`}>
	<span
		class="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-royal-violet-500 to-indigo-velvet-600 font-display text-lg font-bold text-white"
	>
		N
	</span>
	<span class="font-display text-xl font-semibold tracking-tight text-foreground"> Narativa </span>
</div>
