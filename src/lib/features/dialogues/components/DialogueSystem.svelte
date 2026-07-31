<script lang="ts">
	import { dialogue } from '../dialogue.svelte';
</script>

{#if dialogue.visible}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-dark-amethyst/70 p-3 sm:p-5 lg:p-10"
		onclick={() => dialogue.canAdvance && dialogue.next()}
	>
		<div class="relative w-full max-w-7xl">
			<!-- Character -->
			<img
				src={dialogue.currentCharacter?.image}
				alt={dialogue.currentCharacter?.name}
				class="
                pointer-events-none
                absolute
                bottom-28
                left-0

                h-[45vh]
                max-h-162.5
                min-h-55

                w-auto
                object-contain
            "
			/>

			<!-- Dialogue -->
			<div
				class="
                relative
                min-h-45
                rounded-3xl
                bg-gray-200
                px-5
                py-10
                shadow-2xl
                lg:px-10
            "
			>
				<!-- Name -->
				<div
					class="
                    absolute
                    -top-5
                    left-5

                    min-w-32
                    rounded-xl

                    bg-primary
                    px-5

                    py-2
                    text-center

                    text-lg
                    font-bold
                    text-white
                    shadow-lg

                    sm:text-xl
                "
				>
					{dialogue.currentCharacter?.name}
				</div>

				<p
					class="
                    text-base
                    leading-relaxed
                    text-black

                    sm:text-lg
                    lg:text-xl
                "
				>
					{dialogue.currentNode?.text}
				</p>
			</div>
		</div>
	</div>
{/if}
