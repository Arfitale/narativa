<script>
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<h1>Onboarding</h1>
<form action="?/onboardFinish" method="POST">
	<input type="text" placeholder="enter your name" required name="display-name" />
	<Button type="submit">Get started</Button>
</form>
