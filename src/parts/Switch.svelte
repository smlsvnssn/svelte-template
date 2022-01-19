<script>
	import * as ö from 'ouml';

	export let title = 'Title';
	export let id = ö.randomChars();
	export let value = 0;
</script>

<div>
	<input type="checkbox" class="switch" {id} bind:checked={value} />
	<label for={id}>{title}</label>
</div>

<style lang="scss">
	div {
		display: flex;
		align-items: center;
		label {
			margin-left: var(--formBasePadding);
		}
	}
</style>
