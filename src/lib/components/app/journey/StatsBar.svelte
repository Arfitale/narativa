<script lang="ts">
	import { Flame, Sparkles } from '@lucide/svelte';

	const completedChapters = 3;
	const totalChapters = 8;
	const progressPercent = (completedChapters / totalChapters) * 100;
</script>

<aside
	class="sticky top-0 hidden h-screen w-80 flex-col gap-6 border-l border-border bg-card p-6 lg:flex"
>
	<!-- Stats Top Bar -->
	<div class="flex items-center justify-between rounded-2xl border border-border bg-muted/50 p-3">
		<div class="flex items-center gap-2">
			<Flame class="h-6 w-6 fill-orange-500 text-orange-500" />
			<span class="text-sm font-extrabold">3 Hari</span>
		</div>
		<div class="flex items-center gap-2">
			<Sparkles
				class="text-royal_violet-600 fill-royal_violet-600 dark:text-mauve_magic-500 dark:fill-mauve_magic-500 h-6 w-6"
			/>
			<span class="text-sm font-extrabold">240 XP</span>
		</div>
	</div>

	<!-- Card: Progress Journey -->
	<div class="space-y-4 rounded-2xl border border-border bg-muted/30 p-5">
		<h3 class="text-base font-extrabold">Perjalanan Belajar</h3>

		<div class="space-y-2">
			<div class="flex justify-between text-xs font-bold text-muted-foreground">
				<span>Progres Selesai</span>
				<span>{completedChapters} / {totalChapters} Chapter</span>
			</div>
			<!-- Progress Bar -->
			<div class="h-3 w-full overflow-hidden rounded-full border border-border bg-muted">
				<div
					class="from-royal_violet-600 to-mauve_magic-500 h-full rounded-full bg-gradient-to-r transition-all duration-500"
					style="width: {progressPercent}%"
				></div>
			</div>
		</div>

		<p class="text-xs leading-relaxed text-muted-foreground">
			Selesaikan seluruh chapter untuk membuka <span
				class="text-royal_violet-600 dark:text-mauve_magic-500 font-bold">Story Studio</span
			> akhir!
		</p>
	</div>

	<!-- Card: Badge Terbaru -->
	<div class="space-y-3 rounded-2xl border border-border bg-muted/30 p-5">
		<div class="flex items-center justify-between">
			<h3 class="text-base font-extrabold">Badge Terbuka</h3>
			<a
				href="/badges"
				class="text-royal_violet-600 dark:text-mauve_magic-500 text-xs font-bold hover:underline"
				>Lihat Semua</a
			>
		</div>

		<div class="grid grid-cols-3 gap-3 pt-2">
			<div
				class="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-2 shadow-xs"
			>
				<div
					class="bg-royal_violet-600 flex h-10 w-10 items-center justify-center rounded-full text-xl"
				>
					✍️
				</div>
				<span class="text-center text-[10px] font-bold text-muted-foreground">Pembuka Kata</span>
			</div>
			<div
				class="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-2 shadow-xs"
			>
				<div
					class="bg-royal_violet-600 flex h-10 w-10 items-center justify-center rounded-full text-xl"
				>
					🔍
				</div>
				<span class="text-center text-[10px] font-bold text-muted-foreground">Analis Plot</span>
			</div>
			<!-- Badge terkunci -->
			<div
				class="flex flex-col items-center gap-1 rounded-xl border border-border bg-muted/50 p-2 opacity-40"
			>
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">
					🔒
				</div>
				<span class="text-center text-[10px] font-bold text-muted-foreground">Penulis Cerpen</span>
			</div>
		</div>
	</div>
</aside>
