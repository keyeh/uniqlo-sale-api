const SCROLL_TIMEOUT_MS = 30 * 1000
const AJAX_LOAD_DELAY_MS = 2 * 1000

export default async function autoScroll(page) {
	let isBottom = false;
	const startTime = Date.now()

	while (!isBottom) {
		await page.evaluate(`$('html').animate({scrollTop: document.body.scrollHeight}, 100, 'linear')`)
		await page.waitFor(AJAX_LOAD_DELAY_MS);
		isBottom = await page.evaluate(`(window.innerHeight + window.scrollY) >= document.body.offsetHeight`);

		if (Date.now() > startTime + SCROLL_TIMEOUT_MS) {
			throw "Infinite scroll timeout - cannot reach bottom of page"
		}
	}
}