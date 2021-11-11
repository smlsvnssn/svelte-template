<script>
	export let title = 'Title';
	export let value = 0;
	export let min = 0;
	export let max = 100;
	export let step = 1;

	// sanitize
	$: value = Math.max(min, Math.min(value, max));

	/*- (value % step)*/
</script>

<div>
	<legend> {title} </legend><span
		><input type="range" class="slider {title}" bind:value {min} {max} {step} /><input
			type="number"
			class="slider"
			bind:value
			{min}
			{max}
			{step}
		/></span
	>
</div>

<style lang="scss">
	div {
		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			//margin: 0;
		}

		legend {
			flex: 100%;
			padding-top: 0.7rem;
			padding-bottom: 0.2rem;
		}

		span {
			display: flex;
			align-items: center;
			gap: 1rem;
		}

		input[type='range'] {
			flex: 0 1 auto;
		}

		input[type='number'] {
			-moz-appearance: textfield;
			flex: 6rem;
			border: none;
			text-align: right;
		}
	}
</style>
