<script>
	// types defined in css
	import * as ö from 'ouml';

	export let title,
		type,
		url,
		isFullWidth = false;
</script>

<a href={url} class="button {type}" class:isFullWidth>
	{title}
</a>

<style lang="scss">
	@import '../scss/scssvars';

	.button {
		display: inline-block;
		width: auto;
		@media #{$phone} {
			width: 100%;
			flex: 100%;
		}

		border-radius: var(--cornerRadius);

		font-size: 2.5rem;
		font-weight: 700;

		@media #{$phone} {
			font-size: 2rem;
			text-align: center;
		}

		padding: var(--formBasePadding) calc(var(--formBasePadding) * 2);
		color: var(--clrTextLight);
		background: var(--clrPrimary);

		transition: var(--transitionOut);

		&:hover {
			text-decoration: none;

			transition: var(--transitionOver);
			transform: var(--transformHoverRise);
			filter: var(--filterHoverBright);
		}

		&.fullWidth {
			width: 100%;
		}

		&.primary {
			background: var(--clrPrimary);
			color: var(--clrTextLight);
		}

		&.secondary {
			background: var(--morkHavsturkos100);
			color: var(--clrTextLight);
		}

		&.outline {
			background: transparent;
			color: var(--clrTextLight);
			box-shadow: var(--shadowInnerBorder);
			&.primary:hover {
				background: var(--clrPrimary);
			}
			&.secondary:hover {
				background: var(--clrSecondary);
			}
		}
	}
</style>
