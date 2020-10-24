var check = require('k6').check;
var Counter = require('k6/metrics').Counter;
var Rate = require('k6/metrics').Rate;
var Trend = require('k6/metrics').Trend;
var GLOBAL_VARS = require('../helper/constant.js');
var searchRequest = require('../services/search-item.js').searchRequest;

var DURATION = '10s';
var VUs = 1;
var thresholdConfig = {
  'Content OK': ['rate > 0.95'],
  // scenario 1
  'http_req_connecting{scenario_name:unregister_user}': ['p(90) < 450'],
  'http_req_duration{scenario_name:unregister_user}': ['p(90) < 4500'],
  'http_reqs{scenario_name:unregister_user}': ['count >= 1'],
  'checks{scenario_name:unregister_user}': ['rate > 0.9'],
  'check_failure_rate{scenario_name:unregister_user}': ['rate < 0.1'],
  'errors{scenario_name:unregister_user}': ['count < 5'],
  'waiting_timing{scenario_name:unregister_user}': [
    'p(90) < 600',
    'p(70) < 500',
    'avg < 450',
    'med < 450',
  ],
  // scenario 2
  'http_req_connecting{scenario_name:register_user}': ['p(90) < 450'],
  'http_req_duration{scenario_name:register_user}': ['p(90) < 4500'],
  'http_reqs{scenario_name:register_user}': ['count >= 1'],
  'checks{scenario_name:register_user}': ['rate > 0.9'],
  'check_failure_rate{scenario_name:register_user}': ['rate < 0.1'],
  'errors{scenario_name:register_user}': ['count < 5'],
  'waiting_timing{scenario_name:register_user}': [
    'p(90) < 600',
    'p(70) < 500',
    'avg < 450',
    'med < 450',
  ],
  // Search Shirt
  'http_req_connecting{userAction:searchShirt}': ['p(90) < 450'],
  'http_req_duration{userAction:searchShirt}': ['p(90) < 4500'],
  'http_reqs{userAction:searchShirt}': ['count >= 1'],
  'checks{userAction:searchShirt}': ['rate > 0.9'],
  'check_failure_rate{userAction:searchShirt}': ['rate < 0.1'],
  'errors{userAction:searchShirt}': ['count < 5'],
  'waiting_timing{userAction:searchShirt}': [
    'p(90) < 600',
    'p(70) < 500',
    'avg < 450',
    'med < 450',
  ],
  // Search Wine
  'http_req_connecting{userAction:searchWine}': ['p(90) < 450'],
  'http_req_duration{userAction:searchWine}': ['p(90) < 4500'],
  'http_reqs{userAction:searchWine}': ['count >= 1'],
  'checks{userAction:searchWine}': ['rate > 0.9'],
  'check_failure_rate{userAction:searchWine}': ['rate < 0.1'],
  'errors{userAction:searchWine}': ['count < 5'],
  'waiting_timing{userAction:searchWine}': ['p(90) < 600', 'p(70) < 500', 'avg < 450', 'med < 450'],
};

module.exports.requests = new Counter('http_reqs');
// Custom rate metric
var checkFailureRate = new Rate('check_failure_rate');
// Custom counter metrics
var countErrors = new Counter('errors');

// Custom trend metrics
var waitingTimingTrend = new Trend('waiting_timing');

var buyItemWithUnregisterUserTestScenario = {
  exec: 'buyItemWithUnregisterUser',
  executor: 'per-vu-iterations',
  iterations: 1,
  //duration: DURATION,
  vus: VUs,
  startTime: '0s',
  tags: { scenario_name: 'unregister_user' },
};

var buyItemWithRegisterUserTestScenario = {
  exec: 'buyItemWithUnregisterUser',
  executor: 'per-vu-iterations',
  iterations: 1,
  //duration: DURATION,
  vus: VUs,
  startTime: '0s',
  tags: { scenario_name: 'register_user' },
};

module.exports.options = {
  scenarios: {
    buy_item_with_unregisger_user_test: buyItemWithUnregisterUserTestScenario,
  },
  thresholds: thresholdConfig,
};

module.exports.buyItemWithUnregisterUser = function () {
  var searchDynamicId = searchRequest(check, checkFailureRate, countErrors, waitingTimingTrend, 1);
  console.log(JSON.stringify(searchDynamicId));
};
