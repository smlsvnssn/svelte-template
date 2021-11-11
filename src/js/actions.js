import * as ö from 'ouml';

// use kebab-case for input props
export const css = (node, props) => {
	const setProps = props => {
		for (const [prop, val] of Object.entries(props))
			node.style.setProperty(prop, val)
	};
	setProps(props);

	return {
		update(newProps) {
			setProps(newProps);
		},
	};
}

// vanilla js for "content query":
const fancyLists = new WeakMap(),
	remToPx = (n) =>
		n * parseFloat(getComputedStyle(document.documentElement).fontSize),
	onResize = new ResizeObserver((entries) => {
		for (let entry of entries) {
			const data = fancyLists.get(entry.target),
				cols = Math.min(Math.ceil(entry.contentRect.width / data.colWidthPx), 6);
			if (cols !== data.prevCols) {
				// only run when needed
				entry.target.querySelectorAll(data.childSelector).forEach((el) => {
					el.classList.remove(`col${data.prevCols}`);
					el.classList.add(`col${cols}`);
				});
			}
			data.prevCols = cols;
		}
	});

export const contextAwareFancySchmanzyList = (
	element,
	{ colWidth = 10 /* in rems, bcus I like it */, childSelector = "li" } = {}
) => {
	fancyLists.set(element, {
		prevCols: 0,
		colWidthPx: remToPx(colWidth),
		childSelector
	});
	onResize.observe(element);
};

export const clickOutside = (node, cb) => {
	const handleOutsideClick = ({ target }) => {
		if (!node.contains(target)) {
			if (cb) cb();
			else target.dispatchEvent(new Event('clickoutside'));
		}
	};
	window.addEventListener('click', handleOutsideClick);
	return {
		destroy() {
			window.removeEventListener('click', handleOutsideClick);
		}
	};

}

export const clickOutsideSpecifiedElements = (node, args = { nodelist: [], cb: () => null }) => {
	const handleOutsideClick = ({ target }) => {
		let isOutside = true;
		args.nodelist.forEach(e => {
			if (e.contains(target)) isOutside = false;
		});
		if (isOutside) {
			if (args.cb) args.cb();
			else target.dispatchEvent(new Event('clickoutside'));
		}
	};
	window.addEventListener('click', handleOutsideClick);
	return {
		destroy() {
			window.removeEventListener('click', handleOutsideClick);
		}
	};

}

export const copyText = node => {
	const range = document.createRange(),
		selection = window.getSelection();

	range.selectNodeContents(node);
	selection.removeAllRanges();
	selection.addRange(range);
	navigator.clipboard.writeText(node.innerHTML);
}