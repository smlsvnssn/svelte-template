<script>
	import { fly } from 'svelte/transition';

	export let title,
		pos,
		x = null,
		y = null,
		delay,
		on = false;

	let followMouse;

	$: if (x !== null) {
		followMouse = `top: ${y + 5}px; left: ${x + 5}px;`;
	}
</script>

{#if on}
	<div class={pos} in:fly={{ y: 4, delay: delay }} out:fly={{ y: 4 }} style={followMouse}>
		{#if pos == 'top' || pos == 'left'}
			<span>{title}</span>
		{/if}
		<svg width="12" height="12" viewBox="0 0 12 12">
			<path
				d="M4.58579 3.58579L1.58579 0.585786C1.21071 0.210714 0.702006 0 0.171573 0H11.8284C11.298 0 10.7893 0.210713 10.4142 0.585786L7.41421 3.58579C6.63316 4.36684 5.36684 4.36684 4.58579 3.58579Z"
			/>
		</svg>

		{#if pos == 'bottom' || pos == 'right' || pos == 'follow'}
			<span>{title}</span>
		{/if}
	</div>
{/if}

<style lang="scss">
	@import '../scss/mixins';

	div {
		--x: -50%;
		--y: -50%;
		top: 50%;
		left: 50%;
		transform: translate(var(--x), var(--y));
		position: absolute;

		z-index: 1000;

		margin: 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-items: center;

		&.right,
		&.left,
		&.follow {
			flex-direction: row;
		}

		font: 1.5rem/1 var(--baseFont);
		letter-spacing: 0;

		pointer-events: none;
		filter: drop-shadow(0 0.125rem 0.125rem var(--clrShadow));

		span {
			background: var(--clrText);
			color: var(--clrBg);
			border-radius: var(--cornerRadius);
			padding: 0.5rem;
			flex: 0 0 auto;
		}

		svg {
			flex: 0 0 auto;
			fill: var(--clrText);
		}

		&.top {
			top: 0;
			--y: -100%;
		}

		&.bottom {
			top: 100%;
			--y: 0;
			svg {
				transform: rotate(180deg);
			}
		}

		&.right,
		&.follow {
			left: 100%;
			--x: 0;
			svg {
				transform: rotate(90deg);
			}
		}
		&.left {
			left: 0;
			--x: -100%;
			svg {
				transform: rotate(-90deg);
			}
		}
		&.follow {
			--x: 2rem;
			--y: -50%;
		}
	}
</style>
