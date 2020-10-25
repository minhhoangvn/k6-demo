var check = require('k6').check;
var Counter = require('k6/metrics').Counter;
var Rate = require('k6/metrics').Rate;
var Trend = require('k6/metrics').Trend;
var search = require('../services/search-items/index.js');

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
  'check_errors{scenario_name:unregister_user}': ['count < 5'],
  'check_waiting_timing{scenario_name:unregister_user}': [
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
  'check_errors{scenario_name:register_user}': ['count < 5'],
  'check_waiting_timing{scenario_name:register_user}': [
    'p(90) < 600',
    'p(70) < 500',
    'avg < 450',
    'med < 450',
  ],
  // Search Shirt
  'http_req_connecting{userAction:Search Code Division T-shirt}': ['p(90) < 450'],
  'http_req_duration{userAction:Search Code Division T-shirt}': ['p(90) < 4500'],
  'http_reqs{userAction:Search Code Division T-shirt}': ['count >= 1'],
  'checks{userAction:Search Code Division T-shirt}': ['rate > 0.9'],
  'check_failure_rate{userAction:Search Code Division T-shirt}': ['rate < 0.1'],
  'check_errors{userAction:Search Code Division T-shirt}': ['count < 5'],
  'check_waiting_timing{userAction:Search Code Division T-shirt}': [
    'p(90) < 600',
    'p(70) < 500',
    'avg < 450',
    'med < 450',
  ],
  // Search Wine
  'http_req_connecting{userAction:Select Code Division T-shirt}': ['p(90) < 450'],
  'http_req_duration{userAction:Select Code Division T-shirt}': ['p(90) < 4500'],
  'http_reqs{userAction:Select Code Division T-shirt}': ['count >= 1'],
  'checks{userAction:Select Code Division T-shirt}': ['rate > 0.9'],
  'check_failure_rate{userAction:Select Code Division T-shirt}': ['rate < 0.1'],
  'check_errors{userAction:Select Code Division T-shirt}': ['count < 5'],
  'check_waiting_timing{userAction:Select Code Division T-shirt}': [
    'p(90) < 600',
    'p(70) < 500',
    'avg < 450',
    'med < 450',
  ],
};

module.exports.requests = new Counter('http_reqs');
// Custom rate metric
var checkFailureRate = new Rate('check_failure_rate');
// Custom counter metrics
var countErrors = new Counter('check_errors');

// Custom trend metrics
var waitingTimingTrend = new Trend('check_waiting_timing');

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
  var searchDynamicId = search.searchAndSelectItemFlow(
    'Code Division T-shirt',
    check,
    checkFailureRate,
    countErrors,
    waitingTimingTrend,
    1
  );
  console.log(JSON.stringify(searchDynamicId));
};
