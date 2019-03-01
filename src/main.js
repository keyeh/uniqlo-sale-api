import xChrome from './xChrome';

xChrome('https://www.uniqlo.com/us/en/men/sale/30inch%7C31inch%7Cone-size%7Cs?ptid=men-sale',
		'.product-tile',
		[{
			title: 'a.name-link | trim',
			url: 'a@href',
			originalPrice: '.product-standard-price',
			salePrice: '.product-sales-price',
			variants: xChrome('.swatch-list li', [{
				name: 'img@data-thumb | extractVariantName',
				url: 'a@href',
				thumbnail: 'img@data-thumb | extractThumbnailUrl',
				stock: xRequest('a@href | ajaxifyVariantUrl', ['select.variation-select option | trim | extractStock']),
			}]),
		}]
	)
	.write('results.json')