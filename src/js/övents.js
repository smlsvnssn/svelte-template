//
// Custom events
//
/* 
Usage:
<element use:clickoutside on:clickoutside={callback}></element>
*/
import * as ö from "ouml";

let enteredview, exitedview, stickToTop, stickToBottom;

const
	// resize
	sizeChange = entries => {
		for (const entry of entries)
			entry.target.dispatchEvent(
				new CustomEvent('resize', { detail: { entry } })
			)
	},
	observeResize = element => {
		resize ??= new ResizeObserver(sizeChange);
		resize.observe(element);
	},
	unobserveResize = element => {
		resize.unobserve(element);
	},
	// enterview, exitview
	viewChange = entries => {
		for (const entry of entries)
			entry.target.dispatchEvent(new Event(
				entry.isIntersecting ? 'enterview' : 'exitview'
			))
	},

	observeView = eventType => element => {
		if (eventType === 'enterview') {
			enteredview ??= new IntersectionObserver(viewChange);
			enteredview.observe(element)
		} else {
			exitedview ??= new IntersectionObserver(viewChange);
			exitedview.observe(element)
		}

	},

	unobserveView = eventType => element => {
		if (eventType === 'enterview') enterview.unobserve(element);
		else exitview.unobserve(element);
	},

	// sticktotop, sticktobottom, inspired by https://css-tricks.com/an-explanation-of-how-the-intersection-observer-watches/
	stickyChange = eventType => entries => {
		for (const entry of entries)
			entry.target.dispatchEvent(
				new CustomEvent(eventType,
					{ detail: { sticky: entry.isIntersecting ? true : false } }
				)
			)
	},

	stickyOptions = eventType => ({
		root: document,
		rootMargin: eventType === 'sticktotop' ? '0px 0px -100% 0px' : '-100% 0px 0px 0px',
		threshold: 0
	}),

	observeSticky = eventType => element => {
		if (eventType === 'sticktotop') {
			stickToTop ??= new IntersectionObserver(stickyChange(eventType), stickyOptions(eventType));
			stickToTop.observe(element);
		} else {
			stickToBottom ??= new IntersectionObserver(stickyChange(eventType), stickyOptions(eventType));
			stickToBottom.observe(element);
		}
	},

	unobserveSticky = eventType => element => {
		if (eventType === 'sticktotop') stickToTop.unobserve(element);
		else stickToBottom.unobserve(element);
	},

	// clickoutside
	clickOutsideListeners = new Set(),
	clickOutside = e => {
		for (const element of clickOutsideListeners) {
			if (!element.contains(e.target) && element !== e.target)
				element.dispatchEvent(new Event('clickoutside'));
		}
	},

	observeClickOutside = element => {
		clickOutsideListeners.size || document.addEventListener('click', clickOutside);
		clickOutsideListeners.add(element);
	},

	unobserveClickOutside = element => {
		clickOutsideListeners.delete(element);
		clickOutsideListeners.size || document.removeEventListener('click', clickOutside);
	},

	// swipe, based on https://github.com/scriptex/touchsweep/blob/master/src/touchsweep.js
	swipeThreshold = 30,

	// save start coords
	onTouchStart = element => e => ö.data(element, 'ce_onSwipeStart',
		[e.changedTouches[0].screenX, e.changedTouches[0].screenY]
	),

	onTouchEnd = (element, eventType) => e => {
		const
			[startX, startY] = ö.data(element, 'ce_onSwipeStart'),
			[endX, endY] = [e.changedTouches[0].screenX, e.changedTouches[0].screenY],
			π = Math.PI,
			θ = Math.atan2(endY - startY, endX - startX),
			r = Math.hypot(endX - startX, endY - startY),
			event =
				r > swipeThreshold ?
					ö.between(θ, -π * .25, π * .25) ? 'swiperight' :
						ö.between(θ, π * .25, π * .75) ? 'swipedown' :
							ö.between(θ, -π * .75, -π * .25) ? 'swipeup' :
								'swipeleft' : null;

		if (event === eventType) element.dispatchEvent(new Event(event));
	},

	observeSwipe = eventType => element => {
		// closure for reference to element
		const listeners = [onTouchStart(element), onTouchEnd(element, eventType)];
		// save reference to listeners
		ö.data(element, 'ce_listeners', listeners);
		element.addEventListener('touchstart', listeners[0]);
		element.addEventListener('touchend', listeners[1]);
	},

	unobserveSwipe = eventType => element => {
		const listeners = ö.data(element, 'ce_listeners');
		element.removeEventListener('touchstart', listeners[0]);
		element.removeEventListener('touchend', listeners[1]);
	};

export const
	resize = (node) => {
		observeResize(node);
		return {
			destroy() {
				unobserveResize(node);
			}
		}
	},
	enterview = (node) => {
		observeView('enterview')(node);
		return {
			destroy() {
				unobserveView('enterview')(node);
			}
		}
	},
	exitview = (node) => {
		observeView('exitview')(node);
		return {
			destroy() {
				unobserveView('exitview')(node);
			}
		}
	},
	clickoutside = (node) => {
		observeClickOutside(node);
		return {
			destroy() {
				unobserveClickOutside(node);
			}
		}
	},
	swipe = (node) => {
		observeSwipe('swipeleft')(node);
		observeSwipe('swiperight')(node);
		observeSwipe('swipeup')(node);
		observeSwipe('swipedown')(node);
		return {
			destroy() {
				unobserveSwipe('swipeleft')(node);
				unobserveSwipe('swiperight')(node);
				unobserveSwipe('swipeup')(node);
				unobserveSwipe('swipedown')(node);
			}
		}
	},
	sticktotop = (node, offset) => {
		observeSticky('sticktotop')(node);
		return {
			destroy() {
				unobserveSticky('sticktotop')(node);
			}
		}
	},
	sticktobottom = (node, offset) => {
		observeSticky('sticktobottom')(node);
		return {
			destroy() {
				unobserveSticky('sticktobottom')(node);
			}
		}
	};
