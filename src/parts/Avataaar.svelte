<script>
	import { createAvatar } from '@dicebear/avatars';
	import * as style from '@dicebear/avatars-avataaars-sprites';

	export let seed = Math.random(),
		gender = undefined,
		width = 48;

	const settings = {
		unknown: {
			backgroundColor: '#ccc0',
			style: 'circle',
			top: [
				'longHair',
				'shortHair',
				'hijab',
				'turban',
				'bigHair',
				'bob',
				'bun',
				'curly',
				'curvy',
				'dreads',
				'fro',
				'froAndBand',
				'miaWallace',
				'longButNotTooLong',
				'shavedSides',
				'straight01',
				'straight02',
				'straightAndStrand',
				'dreads01',
				'dreads02',
				'frizzle',
				'shaggy',
				'shaggyMullet',
				'shortCurly',
				'shortFlat',
				'shortRound',
				'shortWaved',
				'sides',
				'theCaesar',
				'theCaesarAndSidePart',
			],
			topChance: 90,
			accessories: ['prescription01', 'prescription02', 'round'],
			accessoriesChance: 30,
			facialHairChance: 0,
			eyes: ['default'],
			eyebrow: [
				'default',
				'defaultNatural',
				'flat',
				'flatNatural',
				'raised',
				'raisedExcited',
				'raisedExcitedNatural',
				'unibrowNatural',
				'up',
				'upDown',
				'upDownNatural',
				'frownNatural',
			],
			mouth: ['serious'],
		},
		male: {
			top: [
				'shortHair',
				//'turban',
				'dreads01',
				'dreads02',
				'frizzle',
				'shaggy',
				'shaggyMullet',
				'shortCurly',
				'shortFlat',
				'shortRound',
				'shortWaved',
				'sides',
				'theCaesar',
				'theCaesarAndSidePart',
			],
			topChance: 75,
			facialHairChance: 25,
			clothes: [
				'blazer',
				'blazerAndShirt',
				'blazerAndSweater',
				'sweater',
				'collarAndSweater',
				'shirt',
				'graphicShirt',
				'shirtCrewNeck',
				'shirtVNeck',
				'hoodie',
			],
		},
		female: {
			top: [
				'longHair',
				'hijab',
				'bigHair',
				'bob',
				'bun',
				'curly',
				'curvy',
				'dreads',
				'fro',
				'froAndBand',
				'miaWallace',
				'longButNotTooLong',
				'shavedSides',
				'straight01',
				'straight02',
				'straightAndStrand',
				'frizzle',
				'shaggy',
				'shaggyMullet',
				'shortCurly',
				'shortFlat',
				'shortRound',
				'shortWaved',
			],
			topChance: 100,
		},
	};

	const avatar = (seed) =>
		// https://avatars.dicebear.com/styles/avataaars#base-options
		createAvatar(style, { seed: '' + seed, ...settings.unknown, ...settings?.[gender] });

	let svg = avatar(seed);
</script>

<div
	style="width:{width}px"
	on:click={() => {
		svg = avatar(String(Math.random()));
	}}
>
	{@html svg}
</div>
