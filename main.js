var Xray = require('x-ray');
var phantom = require('x-ray-phantom');
// const makeDriver = require('request-x-ray')

const options = {
	method: "GET", 						//Set HTTP method
	headers: {							//Set headers
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
	}
}


// const driver = makeDriver(options)		//Create driver


var x = Xray({
    filters: {
      trim: function (value) {
        return typeof value === 'string' ? value.trim().replace(/\\n/g,'%7C') : value
      },
      extractThumbnailUrl: function (value) {
        if(typeof value !== 'string') {
            return value
        }
        const obj = JSON.parse(value)
        return obj.src.replace('?$prod$', '')
      },
      extractVariantName: function(value) {
        if(typeof value !== 'string') {
            return value
        }
        const obj = JSON.parse(value)
        return obj.title.split(',')[1].trim()
      },
      formatPaginationUrl: function (value) {
          if(typeof value !== 'string') {
              return value
            }
            console.log(value.replace(/\|/g,'%7C'))
          return value.replace(/\|/g,'%7C')
      },
      extractStock: function(value) {
          const OOS = ' - OUT OF STOCK -'
        if(typeof value !== 'string') {
            return value
        }
        if(value === 'Select Size') {
            return undefined
        }
        if(value.includes(OOS)) {
            return { size: value.replace(OOS, ''), inStock: false }
        }
        return {size: value, inStock: true }
      }
    }
  }).driver(phantom());
// x.driver(driver)						//Set driver
// x.throttle(3, '1s')
//   x('https://www.uniqlo.com/us/en/kaws-x-sesame-street-sweatshirt-416115.html?dwvar_416115_color=COL09',
//   ['select.variation-select option | trim | extractStock']).write('results.json')

//   return;


// pagination don't work

x('https://www.uniqlo.com/us/en/men/sale/30inch%7C31inch%7Cone-size%7Cs?ptid=men-sale', '.product-tile', [{
// x('https://www.uniqlo.com/us/en/men/sale/30inch%7C31inch%7Cone-size%7Cs?sz=16&start=16&format=page-element', '.product-tile', [{
  title: 'a.name-link | trim',
  url: 'a@href',
  variants: x('.swatch-list li', [{
      name: 'img@data-thumb | extractVariantName',
      url: 'a@href',
      thumbnail: 'img@data-thumb | extractThumbnailUrl',
      // stock: x('a@href', ['select.variation-select option | trim | extractStock']),
  }]),
}])
// .paginate('li.infinite-scroll-placeholder@data-grid-url | formatPaginationUrl')
//   .limit(1)
.write('results.json')