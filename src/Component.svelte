<script>
	import { isSmallScreen } from './stores';
	import lörem from 'loerem';
	import * as ö from 'ouml';

	const p = {
			useLörem: false,
			numberOfParagraphs: 2,
			maxSentenceLength: 6,
			sentencesPerParagraph: 4,
		},
		preamble = {
			useLörem: false,
			numberOfParagraphs: 1,
			maxSentenceLength: 6,
			sentencesPerParagraph: 4,
		},
		headline = {
			useLörem: false,
			isHeadline: true,
			numberOfParagraphs: 1,
			maxSentenceLength: 6,
			sentencesPerParagraph: 1,
		};

	export let props;
</script>

<section class="full">
	<div>
		{#each Array(3) as _}
			<article>
				<h2>{@html lörem(headline)}</h2>
				<p>{@html lörem(preamble)}</p>
			</article>
		{/each}
	</div>
</section>
<h2>{props.hello}</h2>
<p>{@html lörem(p)}</p>

<h3>{props.hello}</h3>
<p>{@html lörem(p)}</p>

<h4>{props.hello}</h4>
<p>{@html lörem(p)}</p>

<h5>{props.hello}</h5>
<p>{@html lörem(p)}</p>

<h6>{props.hello}</h6>
<p>{@html lörem(p)}</p>

<style lang="scss">
	section {
		--g: calc(var(--baseGap) * 4);

		padding: var(--g) 0;
		background: var(--clrPrimary);
		color: var(--clrTextLight);

		div {
			display: grid;
			grid: auto / repeat(auto-fill, minmax(40rem, 1fr));

			gap: var(--g);
		}
	}
</style>
