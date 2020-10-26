var verifyStatusCode = function (res, counter, actionName) {
  var statusOk = res.status && (res.status === 200 || res.status === 204);
  counter.add(!statusOk, { group: 'Select', userAction: actionName });
  if (!statusOk) console.error('Select item request has status code: ', res.status);
  return statusOk;
};

var verifyCorrectResponseDataLoadTest = function (res, searchItemString, counter, actionName) {
  var correctResponse = res.body && res.body.indexOf(searchItemString) !== -1;
  counter.add(!correctResponse, { group: 'Select', userAction: actionName });
  if (!correctResponse) console.error('Select item request has response data: ', res.body);
  return correctResponse;
};

module.exports.verifyStatusCode = verifyStatusCode;
module.exports.verifyCorrectResponseDataLoadTest = verifyCorrectResponseDataLoadTest;
