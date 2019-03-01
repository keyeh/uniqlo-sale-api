import xRay from 'x-ray';
import xRayChrome from 'x-ray-chrome';
import autoScroll from './autoScroll';
import filters from './filters'

const x = xRay({
		filters
	})
	.driver(xRayChrome({
		viewPort: {
			width: 1366,
			height: 768
		},
		headless: false,
		cl: async (page, ctx) => {
			await autoScroll(page);
			await page.screenshot({
				path: 'screenshot.jpg',
				fullPage: true
			});
		},
		navigationOptions: {
			timeout: 10000,
		}
	}))
	.concurrency(1)
	.throttle(5, 1000);



x('https://www.uniqlo.com/us/en/men/sale/30inch%7C31inch%7Cone-size%7Cs?ptid=men-sale',
		'.product-tile',
		[{
			title: 'a.name-link | trim',
			url: 'a@href',
			variants: x('.swatch-list li', [{
				name: 'img@data-thumb | extractVariantName',
				url: 'a@href',
				thumbnail: 'img@data-thumb | extractThumbnailUrl',
				// stock: x('a@href | ajaxifyVariantUrl', ['select.variation-select option | trim | extractStock']),
			}]),
		}]
	)
	.write('results.json')