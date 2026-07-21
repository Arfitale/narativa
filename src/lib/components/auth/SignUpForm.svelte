<script lang="ts">
	import { Eye, EyeOff } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Logo from './Logo.svelte';

	export interface SignUpData {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	}

	interface Props {
		onSubmit?: (data: SignUpData) => void;
		loginUrl?: string;
		termsUrl?: string;
	}

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let agreed = $state(false);
	let submitting = $state(false);

	let { onSubmit, loginUrl = '/login', termsUrl = '/terms' }: Props = $props();

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!agreed || submitting) return;
		submitting = true;
		onSubmit?.({ firstName, lastName, email, password });
		submitting = false;
	}

	function handleGoogle() {
		window.location.href = '/auth/google';
	}
</script>

<div
	class="mx-auto flex w-full max-w-md flex-col justify-center bg-card px-6 py-10 text-card-foreground sm:px-10"
>
	<!-- logo sits above the heading -->
	<Logo class="mb-8" />

	<div class="mb-8">
		<h1 class="font-display text-3xl font-semibold text-foreground sm:text-4xl">
			Create an account
		</h1>
		<p class="mt-2 text-sm text-muted-foreground">
			Already have an account?
			<a
				href={loginUrl}
				class="font-medium text-primary underline underline-offset-4 hover:opacity-80"
			>
				Log in
			</a>
		</p>
	</div>

	<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="flex flex-col gap-1.5">
				<Label for="firstName" class="sr-only">First name</Label>
				<Input
					id="firstName"
					placeholder="First name"
					bind:value={firstName}
					autocomplete="given-name"
					required
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="lastName" class="sr-only">Last name</Label>
				<Input
					id="lastName"
					placeholder="Last name"
					bind:value={lastName}
					autocomplete="family-name"
					required
				/>
			</div>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="email" class="sr-only">Email</Label>
			<Input
				id="email"
				type="email"
				placeholder="Email"
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
					placeholder="Enter your password"
					bind:value={password}
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
				I agree to the
				<a
					href={termsUrl}
					class="font-medium text-primary underline underline-offset-4 hover:opacity-80"
				>
					Terms &amp; Conditions
				</a>
			</Label>
		</div>

		<Button
			type="submit"
			disabled={!agreed || submitting}
			class="mt-2 h-11 w-full bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] font-medium text-primary-foreground shadow-lg shadow-royal-violet-500/20 transition hover:opacity-95 disabled:opacity-50"
		>
			{submitting ? 'Creating account…' : 'Create account'}
		</Button>
	</form>

	<div class="my-6 flex items-center gap-3">
		<span class="h-px flex-1 bg-border"></span>
		<span class="text-xs text-muted-foreground">Or register with</span>
		<span class="h-px flex-1 bg-border"></span>
	</div>

	<Button type="button" variant="outline" onclick={handleGoogle} class="h-11 w-full gap-2">
		<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
			<path
				fill="#4285F4"
				d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.55-5.17 3.55-8.66Z"
			/>
			<path
				fill="#34A853"
				d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.87-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
			/>
			<path
				fill="#FBBC05"
				d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.27a12 12 0 0 0 0 10.8l4-3.11Z"
			/>
			<path
				fill="#EA4335"
				d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.6l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
			/>
		</svg>
		Google
	</Button>
</div>
