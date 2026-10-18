<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	// import { authClient } from '$lib/features/auth/client/auth-client';

	let loading = $state(false);
	let errorMessage = $state('');

	async function handleGoogleLogin() {
		loading = true;
		errorMessage = '';

		// const { error } = await authClient.signIn.social({
		// 	provider: 'google',
		// 	callbackURL: '/app/' // Where user lands AFTER successful login
		// });

		// if (error) {
		// 	errorMessage = error.message || 'Failed to initiate Google login.';
		// 	loading = false;
		// }
	}
</script>

<Button type="button" variant="outline" onclick={handleGoogleLogin} class="h-11 w-full gap-2">
	<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
		<path
			fill="#4285F4"
			d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.55-5.17 3.55-8.66Z"
		/>
		<path
			fill="#34A853"
			d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.87-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
		/>
		<path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.27a12 12 0 0 0 0 10.8l4-3.11Z" />
		<path
			fill="#EA4335"
			d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.6l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
		/>
	</svg>
	Google
</Button>
