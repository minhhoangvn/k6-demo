var addCheckFailuerRate = function (
  res,
  verifyStatusCode,
  verifyCorrectResponseData,
  check,
  checkFailureRate,
  actionName
) {
  var checkRes = check(res, {
    'status is 200': function () {
      return verifyStatusCode;
    },
    'response body is correctly': function () {
      return verifyCorrectResponseData;
    },
  });
  checkFailureRate.add(!checkRes, { group: 'Search', userAction: actionName });
};

var addTimmingTrend = function (res, trend, actionName) {
  trend.add(res.timings.waiting, { group: 'Search', userAction: actionName });
};

module.exports.addCheckFailuerRate = addCheckFailuerRate;
module.exports.addTimmingTrend = addTimmingTrend;
