<script>
	// https://swiperjs.com/svelte
	// import Swiper core and required modules
	import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'

	import { Swiper, SwiperSlide } from 'swiper/svelte'

	// Import Swiper styles
	import 'swiper/css'
	import 'swiper/css/navigation'
	import 'swiper/css/pagination'
	import 'swiper/css/scrollbar'
</script>

<div class="needs_to_be_wrapped_with_something_that_has_no_display_grid_on_it">
	<Swiper
		modules={[Navigation, Pagination, Scrollbar, A11y]}
		spaceBetween={24}
		slidesPerView={3}
		navigation
		pagination={{ clickable: true }}
		on:slideChange={() => console.log('slide change')}
		on:swiper={e => console.log(e.detail[0])}
	>
		<SwiperSlide><div class="test">YOLO</div></SwiperSlide>
		<SwiperSlide><div class="test">YOLO</div></SwiperSlide>
		<SwiperSlide><div class="test">YOLO</div></SwiperSlide>
		<SwiperSlide><div class="test">YOLO</div></SwiperSlide>
		...
	</Swiper>
</div>

<style>
	.test {
		background-color: var(--clrPrimary);
		height: 200px;
	}
</style>
