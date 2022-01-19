<script>
	import * as Parts from './parts/';
	import { fade } from 'svelte/transition';
	import { title, corporation } from './js/randomTitle';
	import tooltip from './js/tooltip.js';
	import * as ö from 'ouml';

	export let user,
		index = 0;
</script>

<article transition:fade={{ delay: index * 30 }} title="{user.name.first} {user.name.last}" use:tooltip>
	<div class="avatar">
		<Parts.Avataaar seed={user.login.md5} gender={user.gender} width="64" />
	</div>

	<h4>{user.name.first} {user.name.last}</h4>
	<h6>{title()}</h6>
	<h6 class="corp">{corporation()}</h6>

	<p>
		<a href="#void">{user.email}</a><br />
		{user.cell}<br />
		<!-- {user.nat}<br /> -->
		{new Date(user.dob.date).toLocaleDateString('sv-SE')}<br />
	</p>
	<!-- {ö.log(user)} -->
</article>

<style lang="scss">
	@import './scss/mixins';
	article {
		padding: var(--baseGap);
		margin-top: 6.5rem;

		background: var(--clrPrimaryAlpha);
		border-radius: 0.5rem;
		box-shadow: var(--dropShadowCloser);
		transition: var(--transitionPrimary);

		&:hover {
			box-shadow: var(--dropShadowClose);
			transform: translateY(-0.5rem);
		}

		.avatar {
			margin-top: -6.5rem;
		}

		p {
			padding-top: 2rem;
			margin-top: calc(var(--baseGap) * 0.5);
		}

		h4,
		h6 {
			margin-top: 0;
			padding-bottom: 0;
		}

		h6 {
			color: var(--clrTextSecondary);
			@include sans(2rem, 1);
		}

		h6.corp {
			@include sans(1.75rem, 1);
		}
	}
</style>
