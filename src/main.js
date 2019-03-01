import xRay from 'x-ray';
import xRayChrome from 'x-ray-chrome';
import filters from './filters'
const SCROLL_TIMEOUT_MS = 30 * 1000

const x = xRay({filters}).driver(xRayChrome({
  viewPort:{ width:1366, height:768 },
  headless: false,
  cl: async (page, ctx)=>{
          let isBottom = false;
          const startTime = Date.now()
          while(!isBottom) {
            await page.evaluate(`$('html').animate({scrollTop: document.body.scrollHeight}, 100, 'linear')`)
            await page.waitFor(1500);
            isBottom = await page.evaluate(`(window.innerHeight + window.scrollY) >= document.body.offsetHeight`);
            if(Date.now() > startTime + SCROLL_TIMEOUT_MS) {
              throw "Infinite scroll timeout"
            }
          }
          await page.screenshot({path: 'screenshot.jpg', fullPage: true});
  },
  navigationOptions:{
      timeout: 10000,
  }
}))
.concurrency(1)
.throttle(5, 1000);



x('https://www.uniqlo.com/us/en/men/sale/30inch%7C31inch%7Cone-size%7Cs?ptid=men-sale', '.product-tile', [{
  title: 'a.name-link | trim',
  url: 'a@href',
  variants: x('.swatch-list li', [{
      name: 'img@data-thumb | extractVariantName',
      url: 'a@href',
      thumbnail: 'img@data-thumb | extractThumbnailUrl',
      // stock: x('a@href | ajaxifyVariantUrl', ['select.variation-select option | trim | extractStock']),
  }]),
}])
.write('results.json')