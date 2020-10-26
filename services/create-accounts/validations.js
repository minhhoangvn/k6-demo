var verifyStatusCode = function (res, counter, actionName) {
  var statusOk = res.status && (res.status === 200 || res.status === 204);
  counter.add(!statusOk, { group: 'Create account', userAction: actionName });
  if (!statusOk) console.error('Create account request has status code: ', res.status);
  return statusOk;
};

var verifyCorrectResponseDataLoadTest = function (res, email, counter, actionName) {
  var correctResponse = res.body && res.body.indexOf(email) !== -1;
  counter.add(!correctResponse, { group: 'Create Account', userAction: actionName });
  if (!correctResponse) console.error('Create account request has response data: ', res.body);
  return correctResponse;
};

module.exports.verifyStatusCode = verifyStatusCode;
module.exports.verifyCorrectResponseDataLoadTest = verifyCorrectResponseDataLoadTest;
