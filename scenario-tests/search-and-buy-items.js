var check = require('k6').check;
var Counter = require('k6/metrics').Counter;
var Rate = require('k6/metrics').Rate;
var Trend = require('k6/metrics').Trend;
var random = require('../helper/random.js');
var search = require('../services/search-items/index.js');
var select = require('../services/select-items/index.js');
var account = require('../services/create-accounts/index.js');

var ITERATION = 2;
var VUs = 100;
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
    'p(90) < 3000',
    'p(70) < 2500',
    'avg < 1500',
    'med < 1500',
  ],
  // scenario 2
  'http_req_connecting{scenario_name:register_new_account}': ['p(90) < 450'],
  'http_req_duration{scenario_name:register_new_account}': ['p(90) < 4500'],
  'http_reqs{scenario_name:register_new_account}': ['count >= 1'],
  'checks{scenario_name:register_new_account}': ['rate > 0.9'],
  'check_failure_rate{scenario_name:register_new_account}': ['rate < 0.1'],
  'check_errors{scenario_name:register_new_account}': ['count < 5'],
  'check_waiting_timing{scenario_name:register_new_account}': [
    'p(90) < 3000',
    'p(70) < 2500',
    'avg < 1500',
    'med < 1500',
  ],
  // Search Shirt
  'http_req_connecting{userAction:Search Code Division T-shirt}': ['p(90) < 450'],
  'http_req_duration{userAction:Search Code Division T-shirt}': ['p(90) < 4500'],
  'http_reqs{userAction:Search Code Division T-shirt}': ['count >= 1'],
  'checks{userAction:Search Code Division T-shirt}': ['rate > 0.9'],
  'check_failure_rate{userAction:Search Code Division T-shirt}': ['rate < 0.1'],
  'check_errors{userAction:Search Code Division T-shirt}': ['count < 5'],
  'check_waiting_timing{userAction:Search Code Division T-shirt}': [
    'p(90) < 3000',
    'p(70) < 2500',
    'avg < 1500',
    'med < 1500',
  ],
  // Search Wine
  'http_req_connecting{userAction:Select Code Division T-shirt}': ['p(90) < 450'],
  'http_req_duration{userAction:Select Code Division T-shirt}': ['p(90) < 4500'],
  'http_reqs{userAction:Select Code Division T-shirt}': ['count >= 1'],
  'checks{userAction:Select Code Division T-shirt}': ['rate > 0.9'],
  'check_failure_rate{userAction:Select Code Division T-shirt}': ['rate < 0.1'],
  'check_errors{userAction:Select Code Division T-shirt}': ['count < 5'],
  'check_waiting_timing{userAction:Select Code Division T-shirt}': [
    'p(90) < 3000',
    'p(70) < 2500',
    'avg < 1500',
    'med < 1500',
  ],
};

module.exports.requests = new Counter('http_reqs');
// Custom metrics for buy item
// Custom rate metric
var checkFailureRate = new Rate('check_failure_rate');
// Custom counter metrics
var countErrors = new Counter('check_errors');

// Custom trend metrics
var waitingTimingTrend = new Trend('check_waiting_timing');

// Custom metrics for register scenarios
// Custom rate metric
var checkFailureRateRegister = new Rate('check_failure_rate_register');
// Custom counter metrics
var countErrorsRegister = new Counter('check_errors_register');

// Custom trend metrics
var waitingTimingTrendRegister = new Trend('check_waiting_timing_register');

var buyItemWithUnregisterUserTestScenario = {
  exec: 'buyItemWithUnregisterUser',
  executor: 'per-vu-iterations',
  iterations: ITERATION,
  vus: VUs,
  startTime: '0s',
  tags: { scenario_name: 'unregister_user' },
};

var registerUserTestScenario = {
  exec: 'registerNewAccount',
  executor: 'per-vu-iterations',
  iterations: ITERATION,
  vus: VUs,
  startTime: '0s',
  tags: { scenario_name: 'register_new_account' },
};

module.exports.options = {
  scenarios: {
    buy_item_with_unregisger_user_test: buyItemWithUnregisterUserTestScenario,
    register_new_account: registerUserTestScenario,
  },
  thresholds: thresholdConfig,
};

module.exports.registerNewAccount = function () {
  account.createAccountFlow(
    random.getRandomEmail(),
    '12345678',
    check,
    checkFailureRateRegister,
    countErrorsRegister,
    waitingTimingTrendRegister,
    1
  );
};

module.exports.buyItemWithUnregisterUser = function () {
  var searchDynamicId = search.searchAndSelectItemFlow(
    'Code Division T-shirt',
    check,
    checkFailureRate,
    countErrors,
    waitingTimingTrend,
    0
  );
  select.selectItemFlow(
    'Code Division T-shirt',
    searchDynamicId.variantId,
    check,
    checkFailureRate,
    countErrors,
    waitingTimingTrend,
    0
  );
};
