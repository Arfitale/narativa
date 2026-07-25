<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { Sun, Moon } from '@lucide/svelte'; // atau @lucide/svelte

	function handleToggle(event: MouseEvent) {
		// Periksa apakah browser mendukung View Transitions API
		if (!document.startViewTransition) {
			toggleMode();
			return;
		}

		// Ambil posisi koordinat klik dari mouse/tombol
		const x = event.clientX;
		const y = event.clientY;

		// Hitung radius maksimum lingkaran hingga mencakup seluruh layar
		const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 500;

		// Jalankan transisi visual
		const transition = document.startViewTransition(() => {
			toggleMode(); // Mengubah mode lewat mode-watcher
		});

		transition.ready.then(() => {
			// Jalankan animasi ekspansi lingkaran (Circular Clip Path)
			document.documentElement.animate(
				{
					clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
				},
				{
					duration: 450,
					easing: 'ease-in-out',
					pseudoElement: '::view-transition-new(root)'
				}
			);
		});
	}
</script>

<button
	onclick={handleToggle}
	class="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
	aria-label="Toggle Theme"
>
	<Sun class="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
	<Moon class="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
</button>
