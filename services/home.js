var http = require('k6/http');
var sleep = require('k6').sleep;
var dashboardHomePageRequest = function (check, checkFailureRate, counter, trend, sleepTime) {
  // our HTTP request, note that we are saving the response to res,
  // which can be accessed later

  var res = http.get('http://saleor-dashboard.testing.coe.com/dashboard/');

  sleep(sleepTime);
  var statusOk = res.status === 200;
  var correctResponse = JSON.stringify(res.body).indexOf('<title>Saleor e-commerce</title>') !== -1;
  counter.add(!statusOk);
  counter.add(!correctResponse);
  var checkRes = check(res, {
    'status is 200': function () {
      return statusOk;
    },
    'response body': function () {
      return correctResponse;
    },
  });
  checkFailureRate.add(!checkRes);
  trend.add(res.timings.waiting);
};

var storefrontHomePageRequest = function (check, checkFailureRate, counter, trend, sleepTime) {
  // our HTTP request, note that we are saving the response to res,
  // which can be accessed later

  var res = http.get('http://saleor-storefront.testing.coe.com/');

  sleep(sleepTime);
  var statusOk = res.status === 200;
  var correctResponse = JSON.stringify(res.body).indexOf('<title>Saleor</title>') !== -1;
  counter.add(!statusOk);
  counter.add(!correctResponse);
  var checkRes = check(res, {
    'status is 200': function () {
      return statusOk;
    },
    'response body': function () {
      return correctResponse;
    },
  });
  checkFailureRate.add(!checkRes);
  trend.add(res.timings.waiting);
};

var apiHomePageRequest = function (check, checkFailureRate, counter, trend, sleepTime) {
  // our HTTP request, note that we are saving the response to res,
  // which can be accessed later

  var res = http.get('http://saleor.testing.coe.com/');

  sleep(sleepTime);
  var statusOk = res.status === 200;
  var correctResponse =
    JSON.stringify(res.body).indexOf('<h2>Your Saleor instance is ready to work</h2>') !== -1;
  counter.add(!statusOk);
  counter.add(!correctResponse);
  var checkRes = check(res, {
    'status is 200': function () {
      return statusOk;
    },
    'response body': function () {
      return correctResponse;
    },
  });
  checkFailureRate.add(!checkRes);
  trend.add(res.timings.waiting);
};

module.exports.storefrontHomePageRequest = storefrontHomePageRequest;
module.exports.dashboardHomePageRequest = dashboardHomePageRequest;
module.exports.apiHomePageRequest = apiHomePageRequest;
