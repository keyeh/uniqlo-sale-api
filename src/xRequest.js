import xRay from 'x-ray';
import filters from './filters'
import requestDriver from 'request-x-ray';

export default xRay({
        filters
    }).driver(requestDriver())
    .concurrency(5)
    .throttle(5, 1000);