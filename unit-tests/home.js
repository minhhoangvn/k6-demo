var check = require('k6').check;
var Counter = require('k6/metrics').Counter;
var Rate = require('k6/metrics').Rate;
var Trend = require('k6/metrics').Trend;
var apiService = require('../services/home.js').apiService;
var storefrontService = require('../services/home.js').storefrontService;
var dashboardService = require('../services/home.js').dashboardService;
var papaparse = require('https://jslib.k6.io/papaparse/5.1.1/index.js');

var data = papaparse.parse(open('../data/sample.csv'), { header: true }).data;
// A simple counter for http requests

module.exports.requests = new Counter('http_reqs');
// Custom rate metric
var checkFailureAPIRate = new Rate('check_failure_rate_api');
var checkFailureDashboardRate = new Rate('check_failure_rate_dashboard');
var checkFailureStoreFrontRate = new Rate('check_failure_rate_storefront');
// Custom counter metrics
var apiErrors = new Counter('api_errors');
var dashboardErrors = new Counter('dashboard_errors');
var storefrontErrors = new Counter('storefront_errors');
// Custom trend metrics
var apiTrend = new Trend('api_waiting_timing');
var dashboardTrend = new Trend('dashboard_waiting_timing');
var storefrontTrend = new Trend('storefront_waiting_timing');
// you can specify stages of your test (ramp up/down patterns) through the options object
// target is the number of VUs you are aiming for
var DURATION = '30s';
var VUs = 2000;

var thresholdConfig = {
  'http_req_connecting{scenario_name:api_test}': ['p(90)<450'],
  'http_req_connecting{scenario_name:storefront_test}': ['p(90)<100'],
  'http_req_connecting{scenario_name:dashboard_test}': ['p(90)<100'],
  'http_req_duration{scenario_name:api_test}': ['p(90)<4500'],
  'http_req_duration{scenario_name:storefront_test}': ['p(90)<3000'],
  'http_req_duration{scenario_name:dashboard_test}': ['p(90)<3000'],
  //RTT: ['p(99)<300', 'p(70)<250', 'avg<200', 'med<150', 'min<100'],
  'Content OK': ['rate>0.95'],
  http_reqs: ['count > 30000'],
  checks: ['rate>0.9'],
  check_failure_rate_api: ['rate<0.1'],
  check_failure_rate_dashboard: ['rate<0.1'],
  check_failure_rate_storefront: ['rate<0.1'],
  api_errors: ['count< 5'],
  dashboard_errors: ['count< 5'],
  storefront_errors: ['count< 5'],
  api_waiting_timing: ['p(90)<300', 'p(70)<250', 'avg<200', 'med<90'],
  dashboard_waiting_timing: ['p(90)<300', 'p(70)<250', 'avg<200', 'med<90'],
  storefront_waiting_timing: ['p(90)<300', 'p(70)<250', 'avg<200', 'med<90'],
};

var apiTestScenario = {
  exec: 'api',
  executor: 'constant-vus',
  duration: DURATION,
  vus: VUs,
  startTime: '0s',
  tags: { scenario_name: 'api_test' },
};

var dashboardTestScenario = {
  exec: 'dashboard',
  executor: 'constant-vus',
  duration: DURATION,
  vus: VUs,
  startTime: '0s',
  tags: { scenario_name: 'dashboard_test' },
};

var storefrontTestScenario = {
  exec: 'storefront',
  executor: 'constant-vus',
  duration: DURATION,
  vus: VUs,
  startTime: '0s',
  tags: { scenario_name: 'storefront_test' },
};

module.exports.options = {
  scenarios: {
    api_test: apiTestScenario,
    dashboard_test: dashboardTestScenario,
    storefront_test: storefrontTestScenario,
  },
};

module.exports.api = function () {
  // our HTTP request, note that we are saving the response to res, which can be accessed later
  apiService(check, checkFailureAPIRate, apiErrors, apiTrend);
};

module.exports.dashboard = function () {
  // our HTTP request, note that we are saving the response to res, which can be accessed later
  dashboardService(check, checkFailureDashboardRate, dashboardErrors, dashboardTrend);
};

module.exports.storefront = function () {
  // our HTTP request, note that we are saving the response to res, which can be accessed later
  storefrontService(check, checkFailureStoreFrontRate, storefrontErrors, storefrontTrend);
};
