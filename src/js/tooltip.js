import Tooltip from '../parts/Tooltip.svelte'
import * as ö from 'ouml'

const position = ö.createEnum(['top', 'bottom', 'right', 'left', 'follow']),

	tooltip = (node, { pos = position.top, delay = 200 } = {}) => {
		let title = node.getAttribute('title'), cachedpos = getComputedStyle(node).position,
			tooltip = new Tooltip({
				props: {
					title: title,
					pos: pos,
					delay: delay
				},
				target: node,
			})

		node.removeAttribute('title')

		// Potential issue overwriting position
		node.style.setProperty('position', 'relative')

		const
			mouseOver = (e) => {
				tooltip.$set({ on: true })
				if (pos === position.follow)
					node.addEventListener('mousemove', mouseMove)
			},

			mouseMove = (e) => {
				const rect = node.getBoundingClientRect()
				tooltip.$set({ x: e.pageX - rect.x, y: e.pageY - rect.y, })
			},

			mouseLeave = () => {
				tooltip.$set({ on: false })
				node.removeEventListener('mousemove', mouseMove)
			}

		node.addEventListener('mouseover', mouseOver)
		node.addEventListener('mouseleave', mouseLeave)

		return {
			destroy() {
				tooltip.$destroy()
				node.style.setProperty('position', cachedpos)
				node.removeEventListener('mouseover', mouseOver)
				node.removeEventListener('mouseleave', mouseLeave)
				node.removeEventListener('mousemove', mouseMove)
			}
		}
	}

export default tooltip
