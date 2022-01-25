<script>
	import { spring } from 'svelte/motion'
	import Icon from './Icon.svelte'

	const maxDist = 250,
		springsettings = {
			stiffness: 0.05,
			damping: 0.75,
		}

	let x = spring(0, springsettings),
		y = spring(0, springsettings),
		dist = spring(0, springsettings)

	const onMousemove = e => {
		const r = el.getBoundingClientRect(),
			w = r.width / 2,
			h = r.height / 2,
			d = Math.hypot(e.pageX - (r.x + w), e.pageY - (r.y + h)),
			factor = maxDist / (maxDist - d)

		if (d < maxDist) {
			$x = (e.pageX - (r.x + w)) / factor + w
			$y = (e.pageY - (r.y + h)) / factor + h
		} else {
			$x = w
			$y = h
		}
		$dist = Math.hypot($x - w, $y - h) * 1.025
	}
	let el

	$: s = `
	transform: translate(${$x}px, ${$y}px);
	opacity:${$dist / 100 + 0.15}; 
	width:	${$dist * 2 + 50}px; 
	height:	${$dist * 2 + 50}px; 
	top: 	${-$dist - 25}px; 
	left: 	${-$dist - 25}px;`
</script>

<svelte:body on:mousemove={onMousemove} />
<div class="wrapper" bind:this={el}>
	<Icon type="comment" color="light" />
	<div class="dot" style={s} />
</div>

<style lang="scss">
	.wrapper {
		position: relative;
		width: 50px;
		height: 50px;
		display: grid;
		place-items: center;
		background: var(--clrPrimary);
		border-radius: 100px;
		cursor: pointer;
		transition: all 0.5s;
		&:hover {
			transform: scale(1.1);
		}
	}
	.dot {
		pointer-events: none;
		position: absolute;
		top: -0.5rem;
		left: -0.5rem;
		width: 1rem;
		height: 1rem;
		z-index: 100000;
		border-radius: 50%;
		background: radial-gradient(
			50% 50% at 50% 50%,
			rgba(0, 0, 0, 0) 50%,
			var(--clrPrimaryAccent) 98%,
			rgba(0, 0, 0, 0) 100%
		);
	}
</style>
