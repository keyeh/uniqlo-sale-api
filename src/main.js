import xRay from 'x-ray';
import filters from './filters'
import chromeDriver from 'x-ray-chrome';
import requestDriver from 'request-x-ray';
import autoScroll from './autoScroll';

const xChrome = xRay({
		filters
	})
	.driver(chromeDriver({
		viewPort: {
			width: 1366,
			height: 768
		},
		headless: false,
		args: [
			'--blink-settings=imagesEnabled=false', // Don't load images
		],
		navigationOptions: {
			timeout: 10000,
		},
		cl: async (page, ctx, navigationOptions) => {
			await page.setRequestInterception(true);

			page.on('request', (req) => {
				if (req.url().includes(`/lib/jquery/jquery`) ||
					req.url().endsWith(`/js/allinone.js`) ||
					req.url().includes('uniqlo.com/us/en/men/sale') ||
					req.url().includes('&format=page-element')
				) {
					req.continue()
				} else {
					req.abort()
				}
			})
			await page.goto(ctx.url, navigationOptions);
			await autoScroll(page);
			await page.screenshot({
				path: 'screenshot.jpg',
				fullPage: true
			});
		}
	}))

const xRequest = xRay({
		filters
	}).driver(requestDriver())
	.concurrency(5)
	.throttle(5, 1000);

xChrome('https://www.uniqlo.com/us/en/men/sale/30inch%7C31inch%7Cone-size%7Cs?ptid=men-sale',
		'.product-tile',
		[{
			title: 'a.name-link | trim',
			url: 'a@href',
			variants: xChrome('.swatch-list li', [{
				name: 'img@data-thumb | extractVariantName',
				url: 'a@href',
				thumbnail: 'img@data-thumb | extractThumbnailUrl',
				// stock: xRequest('a@href | ajaxifyVariantUrl', ['select.variation-select option | trim | extractStock']),
			}]),
		}]
	)
	.write('results.json')