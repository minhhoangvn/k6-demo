var verifyStatusCode = function (res, counter, actionName) {
  var statusOk = res.status === 200;
  counter.add(!statusOk, { group: 'Search', userAction: actionName });
  return statusOk;
};

var verifyCorrectResponseDataLoadTest = function (res, searchItemString, counter, actionName) {
  var correctResponse = res.body.indexOf(searchItemString) !== -1;
  counter.add(!correctResponse, { group: 'Search', userAction: actionName });
  return correctResponse;
};

module.exports.verifyStatusCode = verifyStatusCode;
module.exports.verifyCorrectResponseDataLoadTest = verifyCorrectResponseDataLoadTest;
