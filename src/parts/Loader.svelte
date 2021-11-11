<div class="loader">
	<div />
</div>

<style lang="scss">
	.loader {
		margin-bottom: var(--baseTextMargin);
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: conic-gradient(#0000, var(--clrSecondary));
		color: var(--clrSecondary);
		animation: snurro 2s infinite linear;

		display: flex;
		justify-content: center;
		align-items: center;
		mix-blend-mode: multiply;

		div {
			width: 1rem;
			height: 1rem;
			border-radius: 50%;
			background: var(--clrTextLight);
		}
	}
	@keyframes snurro {
		from {
			transform: rotate(0);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
