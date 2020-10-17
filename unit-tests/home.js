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

export let options = {
  scenarios: {
    demo_test: {
      exec: 'demo',
      executor: 'per-vu-iterations',
      iterations: 5,
      vus: 20,
      tags: { scenario_name: 'demo_test' },
    },
  },
  thresholds: {
    'requests{scenario_name:demo_test}': ['count < 100'],
    'http_req_connecting{scenario_name:demo_test}': ['p(95)<450'],
    'http_req_duration{scenario_name:demo_test}': ['p(95)<3000'],
    RTT: ['p(99)<300', 'p(70)<250', 'avg<200', 'med<150', 'min<100'],
    'Content OK': ['rate>0.95'],
    ContentSize: ['value<4000'],
    'Errors{scenario_name:demo_test}': ['count<100'],
  },
};

export function demo() {
  console.log(__VU, JSON.stringify(data[__VU - 1]));
  // our HTTP request, note that we are saving the response to res, which can be accessed later
  homeService(check, checkFailureRate);
}
