<script>
	export let type,
		color = '';
</script>

<span class={color} tabindex="-1" on:click>
	{#if type === 'checkmark'}
		<svg
			width="16"
			height="16"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M6.20264 13.9247L8.65264 17.4017C8.84119 17.6833 9.15422 17.8565 9.49301 17.8666C9.8318 17.8768 10.1546 17.7226 10.3596 17.4527L18.2026 7.52966"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12.2026 23.9507C18.4158 23.9507 23.4526 18.9139 23.4526 12.7007C23.4526 6.48748 18.4158 1.45068 12.2026 1.45068C5.98943 1.45068 0.952637 6.48748 0.952637 12.7007C0.952637 18.9139 5.98943 23.9507 12.2026 23.9507Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if type === 'email'}
		<svg
			width="24"
			height="25"
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M1.5 6.4502C1.5 5.62177 2.17157 4.9502 3 4.9502H21C21.8284 4.9502 22.5 5.62177 22.5 6.4502V18.4502C22.5 19.2786 21.8284 19.9502 21 19.9502H3C2.17157 19.9502 1.5 19.2786 1.5 18.4502V6.4502Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M22.1609 5.50024L14.0169 11.7642C12.8278 12.679 11.172 12.679 9.98287 11.7642L1.83887 5.50024"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if type === 'phone'}
		<svg
			width="24"
			height="25"
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M4.285 2.44006H4.274C2.21422 2.8977 0.749008 4.72505 0.750001 6.83506V7.72506C0.750001 8.12289 0.908036 8.50442 1.18934 8.78572C1.47064 9.06703 1.85218 9.22506 2.25 9.22506H6C6.82843 9.22506 7.5 8.55349 7.5 7.72506V7.72506C7.5 6.89663 8.17157 6.22506 9 6.22506H15C15.8284 6.22506 16.5 6.89663 16.5 7.72506V7.72506C16.5 8.55349 17.1716 9.22506 18 9.22506H21.75C22.5784 9.22506 23.25 8.55349 23.25 7.72506V6.83506C23.2501 4.7258 21.7851 2.89954 19.726 2.44206H19.715C14.6191 1.45488 9.38116 1.4542 4.285 2.44006Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M3.75 12.2251V18.2251C3.75 20.7104 5.76472 22.7251 8.25 22.7251H15.75C18.2353 22.7251 20.25 20.7104 20.25 18.2251V12.2251"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M7.875 13.7251C7.66789 13.7251 7.5 13.893 7.5 14.1001C7.5 14.3072 7.66789 14.4751 7.875 14.4751C8.08211 14.4751 8.25 14.3072 8.25 14.1001C8.25 13.893 8.08211 13.7251 7.875 13.7251"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M12 13.7251C11.7929 13.7251 11.625 13.893 11.625 14.1001C11.625 14.3072 11.7929 14.4751 12 14.4751C12.2071 14.4751 12.375 14.3072 12.375 14.1001C12.375 13.893 12.2071 13.7251 12 13.7251"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M16.125 13.7251C15.9179 13.7251 15.75 13.893 15.75 14.1001C15.75 14.3072 15.9179 14.4751 16.125 14.4751C16.3321 14.4751 16.5 14.3072 16.5 14.1001C16.5 13.893 16.3321 13.7251 16.125 13.7251"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M7.875 17.4751C7.66789 17.4751 7.5 17.643 7.5 17.8501C7.5 18.0572 7.66789 18.2251 7.875 18.2251C8.08211 18.2251 8.25 18.0572 8.25 17.8501C8.25 17.643 8.08211 17.4751 7.875 17.4751"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M12 17.4751C11.7929 17.4751 11.625 17.643 11.625 17.8501C11.625 18.0572 11.7929 18.2251 12 18.2251C12.2071 18.2251 12.375 18.0572 12.375 17.8501C12.375 17.643 12.2071 17.4751 12 17.4751"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M16.125 17.4751C15.9179 17.4751 15.75 17.643 15.75 17.8501C15.75 18.0572 15.9179 18.2251 16.125 18.2251C16.3321 18.2251 16.5 18.0572 16.5 17.8501C16.5 17.643 16.3321 17.4751 16.125 17.4751"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if type === 'comment'}
		<svg
			width="24"
			height="25"
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8.22 20.1002L3.75 23.4502V18.9502H2.25C1.42157 18.9502 0.75 18.2786 0.75 17.4502V2.4502C0.75 1.62177 1.42157 0.950195 2.25 0.950195H21.75C22.5784 0.950195 23.25 1.62177 23.25 2.4502V8.4502"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M22.63 15.0671L15 22.7001L11.25 23.4501L12 19.7001L19.63 12.0691C20.456 11.2432 21.795 11.2432 22.621 12.0691L22.63 12.0781C23.4546 12.9039 23.4546 14.2414 22.63 15.0671Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if type === 'close'}
		<svg
			width="25"
			height="25"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12.2006 23.9517C18.4138 23.9517 23.4506 18.9149 23.4506 12.7017C23.4506 6.48846 18.4138 1.45166 12.2006 1.45166C5.98742 1.45166 0.950623 6.48846 0.950623 12.7017C0.950623 18.9149 5.98742 23.9517 12.2006 23.9517Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M7.70062 17.2017L16.6996 8.20166"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M16.7006 17.2017L7.69965 8.20166"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if type === 'bin'}
		<svg
			width="25"
			height="25"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M17.4526 21.7017H6.95264C6.12421 21.7017 5.45264 21.0301 5.45264 20.2017V6.70166H18.9526V20.2017C18.9526 21.0301 18.2811 21.7017 17.4526 21.7017Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M9.95264 17.2017V11.2017"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M14.4526 17.2017V11.2017"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M2.45264 6.70166H21.9526"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M14.4526 3.70166H9.95264C9.12421 3.70166 8.45264 4.37323 8.45264 5.20166V6.70166H15.9526V5.20166C15.9526 4.37323 15.2811 3.70166 14.4526 3.70166Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if type === 'add-user'}
		<svg
			width="24"
			height="25"
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M17.25 23.4502C20.5637 23.4502 23.25 20.7639 23.25 17.4502C23.25 14.1365 20.5637 11.4502 17.25 11.4502C13.9363 11.4502 11.25 14.1365 11.25 17.4502C11.25 20.7639 13.9363 23.4502 17.25 23.4502Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M17.25 14.4502V20.4502"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M14.25 17.4502H20.25"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M0.75 17.4501C0.751544 15.1835 1.89011 13.0688 3.78149 11.8197C5.67287 10.5706 8.06476 10.3536 10.15 11.2421"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M7.5 9.2002C9.77817 9.2002 11.625 7.35337 11.625 5.0752C11.625 2.79702 9.77817 0.950195 7.5 0.950195C5.22183 0.950195 3.375 2.79702 3.375 5.0752C3.375 7.35337 5.22183 9.2002 7.5 9.2002Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if type === 'more-menu'}
		<svg
			class="filled"
			width="25"
			height="25"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M3.57764 15.3496C5.02738 15.3496 6.20264 14.1744 6.20264 12.7246C6.20264 11.2749 5.02738 10.0996 3.57764 10.0996C2.12789 10.0996 0.952637 11.2749 0.952637 12.7246C0.952637 14.1744 2.12789 15.3496 3.57764 15.3496Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M20.8276 15.3496C22.2774 15.3496 23.4526 14.1744 23.4526 12.7246C23.4526 11.2749 22.2774 10.0996 20.8276 10.0996C19.3779 10.0996 18.2026 11.2749 18.2026 12.7246C18.2026 14.1744 19.3779 15.3496 20.8276 15.3496Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12.2026 15.3496C13.6524 15.3496 14.8276 14.1744 14.8276 12.7246C14.8276 11.2749 13.6524 10.0996 12.2026 10.0996C10.7529 10.0996 9.57764 11.2749 9.57764 12.7246C9.57764 14.1744 10.7529 15.3496 12.2026 15.3496Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if type === 'linkedin'}
		<svg
			width="25"
			height="25"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M3.26172 6.58008C4.64243 6.58008 5.76172 5.46079 5.76172 4.08008H5.74172C5.74176 2.70714 4.63461 1.59106 3.26172 1.58008C1.88101 1.58008 0.761719 2.69937 0.761719 4.08008C0.761719 5.46079 1.88101 6.58008 3.26172 6.58008Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M15.7617 13.4401C14.5798 13.4401 13.6217 14.3982 13.6217 15.5801V22.8301H8.51172V8.90008H13.6217V10.4901C14.8194 9.47613 16.3326 8.91047 17.9017 8.89008C21.0717 8.89008 23.2717 11.2401 23.2717 15.7001V22.8301H17.9017V15.5801C17.9044 15.0108 17.6801 14.4639 17.2785 14.0604C16.8769 13.6569 16.331 13.4301 15.7617 13.4301V13.4401Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M5.67172 22.8301H0.811719V8.90008H5.67172V22.8301Z"
				stroke="black"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
</span>

<style>
	span {
		--s: var(--baseGap);
		position: relative;
		width: var(--s);
		height: var(--s);
		display: inline-block;
		vertical-align: middle;
	}
	.filled path {
		fill: var(--clrText);
	}
	svg {
		position: absolute;
		width: var(--s);
		height: var(--s);
		transform: translateY(-1px);
	}
	path {
		stroke: var(--clrPrimary);
		stroke-width: var(--iconStrokeWidth);
	}
	.light path {
		stroke: var(--clrTextLight);
	}
	.dark path {
		stroke: var(--clrText);
	}
</style>
