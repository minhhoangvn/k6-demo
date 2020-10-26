var http = require('k6/http');
var sleep = require('k6').sleep;
var group = require('k6').group;
var verify = require('./validations.js');
var metrics = require('./metrics.js');
var GLOBAL_VARS = require('../../helper/constant.js');

var createAccountRequest = function (email, password) {
  return http.post(
    GLOBAL_VARS.TARGET_URL,
    '[{"operationName":"RegisterAccount","variables":{"email":"' +
      email +
      '","password":"' +
      password +
      '"},"query":"mutation RegisterAccount($email: String!, $password: String!) {  accountRegister(input: {email: $email, password: $password}) {    accountErrors {      message      code    }    requiresConfirmation    user{id email firstName lastName}  }}"}]',
    {
      headers: GLOBAL_VARS.DEFAULT_POST_HEADERS,
    }
  );
};

var createAccountAction = function (
  email,
  password,
  check,
  checkFailureRate,
  counter,
  trend,
  sleepTime,
  actionName
) {
  var response = createAccountRequest(email, password);
  metrics.addCheckFailuerRate(
    response,
    verify.verifyStatusCode(response, counter, actionName),
    verify.verifyCorrectResponseDataLoadTest(response, email, counter, actionName),
    check,
    checkFailureRate,
    actionName
  );
  metrics.addTimmingTrend(response, trend, actionName);
  sleep(sleepTime);
};

var createAccountFlow = function (
  email,
  password,
  check,
  checkFailureRate,
  counter,
  trend,
  sleepTime
) {
  return group('Create Account Flow', function () {
    createAccountAction(
      email,
      password,
      check,
      checkFailureRate,
      counter,
      trend,
      sleepTime,
      'Craete Account ' + email
    );
  });
};

module.exports.createAccountRequest = createAccountRequest;
module.exports.createAccountFlow = createAccountFlow;
