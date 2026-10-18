<script lang="ts">
	import { Eye, EyeOff } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Logo from '$lib/features/app/components/Logo.svelte';
	import { enhance } from '$app/forms';
	import GoogleAuthButton from './GoogleAuthButton.svelte';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let agreed = $state(false);
	let submitting = $state(false);
	let errorMessage = $state('');
</script>

<div
	class="mx-auto flex w-full max-w-md flex-col justify-center bg-card px-6 py-10 text-card-foreground sm:px-10"
>
	<div class="mb-8">
		<h1 class="font-display text-3xl font-semibold text-foreground sm:text-4xl">Buat akun baru</h1>
		<p class="mt-2 text-sm text-muted-foreground">
			Sudah punya akun?&nbsp;
			<a
				href="/signin"
				class="font-medium text-primary underline underline-offset-4 hover:opacity-80"
			>
				Log in
			</a>
		</p>
	</div>

	<form
		class="flex flex-col gap-4"
		action="?/signUpWithEmail"
		method="POST"
		use:enhance={() => {
			submitting = true;
			errorMessage = '';

			return async ({ update, result }) => {
				submitting = false;
				if (result.type === 'failure') {
					const message =
						typeof result.data?.message === 'string'
							? result.data.message
							: 'Failed to create account';
					errorMessage = message;
				}
				await update();
				goto('/app/onboarding');
			};
		}}
	>
		{#if errorMessage}
			<p class="text-red-500">{errorMessage}</p>
		{/if}

		<div class="flex flex-col gap-1.5">
			<Label for="email" class="sr-only">Email</Label>
			<Input
				id="email"
				type="email"
				placeholder="Email"
				name="email"
				bind:value={email}
				autocomplete="email"
				required
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="password" class="sr-only">Password</Label>
			<div class="relative">
				<Input
					id="password"
					type={showPassword ? 'text' : 'password'}
					placeholder="Masukkan password"
					bind:value={password}
					name="password"
					autocomplete="new-password"
					minlength={8}
					class="pr-10"
					required
				/>
				<button
					type="button"
					class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					onclick={() => (showPassword = !showPassword)}
					aria-label={showPassword ? 'Hide password' : 'Show password'}
				>
					{#if showPassword}
						<EyeOff class="h-4 w-4" />
					{:else}
						<Eye class="h-4 w-4" />
					{/if}
				</button>
			</div>
		</div>

		<div class="flex items-start gap-2.5 pt-1">
			<Checkbox id="terms" bind:checked={agreed} class="mt-0.5" required />
			<Label for="terms" class="text-sm font-normal text-muted-foreground">
				Saya setuju dengan&nbsp;
				<a
					href="/terms"
					class="font-medium text-primary underline underline-offset-4 hover:opacity-80"
				>
					syarat dan ketentuan
				</a>
			</Label>
		</div>

		<Button
			type="submit"
			disabled={!agreed || submitting}
			class="mt-2 h-11 w-full bg-linear-to-r from-(--gradient-from) to-(--gradient-to) font-medium text-primary-foreground shadow-lg shadow-royal-violet-500/20 transition hover:opacity-95 disabled:opacity-50"
		>
			{submitting ? 'Membuat akun…' : 'Buat akun'}
		</Button>
	</form>

	<div class="my-6 flex items-center gap-3">
		<span class="h-px flex-1 bg-border"></span>
		<span class="text-xs text-muted-foreground">atau masuk dengan</span>
		<span class="h-px flex-1 bg-border"></span>
	</div>

	<GoogleAuthButton />
</div>
