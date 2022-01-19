<script>
	import Card from './Card.svelte';
	import FormFields from './FormFields.svelte';
	import Component from './Component.svelte';
	import * as Parts from './parts/';

	import { isSmallScreen, isDarkMode, mobileMenuVisible } from './stores';

	import tooltip from './js/tooltip.js';
	import * as ö from 'ouml';
	import ProximityAlert from './parts/ProximityAlert.svelte';

	let props = { hello: 'Hello world!' },
		users = ö.load('https://randomuser.me/api/?results=8'),
		innerWidth;

	// Read/write local storage
	//localStorage.clear();
	props = ö.getLocal('props') ?? props;
	$: ö.setLocal('props', props);

	// "Media queries"
	$: $isSmallScreen = innerWidth < 600;

	$isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	window
		.matchMedia('(prefers-color-scheme: dark)')
		.addEventListener('change', (e) => ($isDarkMode = e.matches));
	$: {
		if ($isDarkMode) document.documentElement.classList.add('darkMode');
		else document.documentElement.classList.remove('darkMode');
	}

	// Menu
	$: {
		if ($mobileMenuVisible) document.body.classList.add('noScroll');
		else document.body.classList.remove('noScroll');
	}
</script>

<ProximityAlert />
<p />
<p />
<p />
<p />
<p />

<Parts.Switch bind:value={$isDarkMode} title="Dark mode" />
<div class="full">
	<h1 title="this is a greeting from action" use:tooltip>Testing testing.</h1>
</div>
<section class="users">
	{#await users}
		<Parts.Loader />
	{:then users}
		{#each users.results as user, i}
			<Card {user} index={i} />
		{/each}
	{/await}
</section>
<section class="avatars">
	{#each Array(36) as _}
		<Parts.Avataaar seed={Math.random()} width="40" />
	{/each}
</section>

{#if $isSmallScreen}
	<Component props={{ hello: 'Hello mobile!' }} />
{:else}
	<Component {props} />
{/if}

<Parts.Slider />
<Parts.Switch />

<FormFields />

<!-- 
	
Globals

 -->
<svelte:window bind:innerWidth />

<svelte:head>
	<!-- google fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&family=DM+Serif+Display&family=DM+Serif+Text:ital@0;1&family=Manuale:ital,wght@0,400;0,600;1,400;1,600&family=DM+Mono&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<style lang="scss">
	// global styles
	:global {
		@import './scss/global.scss';
	}

	.avatars {
		grid-area: 5 / main;
		display: flex;
		flex-wrap: wrap;
	}

	.users {
		display: grid;
		gap: var(--baseGap);
		grid: var(--grid4Col);
		padding-bottom: calc(var(--baseGap) * 4);
	}
</style>
