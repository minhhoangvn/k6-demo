import { check } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import { homeService } from '../services/home.js';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const data = papaparse.parse(open('../data/sample.csv'), { header: true }).data;
// A simple counter for http requests

export const requests = new Counter('http_reqs');
// Custom metric with rate value
let checkFailureRate = new Rate('check_failure_rate');
// you can specify stages of your test (ramp up/down patterns) through the options object
// target is the number of VUs you are aiming for

export const options = {
  stages: [
    { target: 20, duration: '3s' },
    { target: 15, duration: '3s' },
    { target: 0, duration: '3s' },
  ],
  thresholds: {
    requests: ['count < 100'],
    http_req_connecting: ['p(95)<450'],
    'http_req_duration{staticAsset:yes}': ['p(95)<100'],
    RTT: ['p(99)<300', 'p(70)<250', 'avg<200', 'med<150', 'min<100'],
    'Content OK': ['rate>0.95'],
    ContentSize: ['value<4000'],
    Errors: ['count<100'],
  },
};

export default function () {
  console.log(__VU, JSON.stringify(data[__VU - 1]));
  // our HTTP request, note that we are saving the response to res, which can be accessed later
  homeService(check, checkFailureRate);
}
