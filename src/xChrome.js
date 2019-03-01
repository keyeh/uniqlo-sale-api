import xRay from 'x-ray';
import filters from './filters'
import chromeDriver from 'x-ray-chrome';
import autoScroll from './autoScroll';

export default xRay({
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
            // await page.screenshot({
            //     path: 'screenshot.jpg',
            //     fullPage: true
            // });
        }
    }))