var http = require('k6/http');
var sleep = require('k6').sleep;
var group = require('k6').group;
var verify = require('./validations.js');
var metrics = require('./metrics.js');
var GLOBAL_VARS = require('../../helper/constant.js');

var selectItemPermittedCommunicationRequest = function () {
  return http.options(GLOBAL_VARS.TARGET_URL, null, {
    headers: GLOBAL_VARS.DEFAULT_OPTIONS_HEADERS,
  });
};

var selectItemRequest = function (variantId) {
  return http.post(
    GLOBAL_VARS.TARGET_URL,
    '[{"operationName":"CheckoutProductVariants","variables":{"ids":["' +
      variantId +
      '"]},"query":"fragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductVariant on ProductVariant {\\n  id\\n  name\\n  sku\\n  quantityAvailable\\n  isAvailable\\n  pricing {\\n    onSale\\n    priceUndiscounted {\\n      ...Price\\n      __typename\\n    }\\n    price {\\n      ...Price\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    attribute {\\n      id\\n      name\\n      __typename\\n    }\\n    values {\\n      id\\n      name\\n      value: name\\n      __typename\\n    }\\n    __typename\\n  }\\n  product {\\n    id\\n    name\\n    thumbnail {\\n      url\\n      alt\\n      __typename\\n    }\\n    thumbnail2x: thumbnail(size: 510) {\\n      url\\n      __typename\\n    }\\n    productType {\\n      isShippingRequired\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery CheckoutProductVariants($ids: [ID]) {\\n  productVariants(ids: $ids, first: 100) {\\n    edges {\\n      node {\\n        ...ProductVariant\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}]',
    {
      headers: GLOBAL_VARS.DEFAULT_POST_HEADERS,
    }
  );
};

var selectItemAction = function (
  searchItemString,
  variantId,
  check,
  checkFailureRate,
  counter,
  trend,
  sleepTime,
  actionName
) {
  var response = selectItemPermittedCommunicationRequest();
  metrics.addCheckFailuerRate(
    response,
    verify.verifyStatusCode(response, counter, actionName),
    true,
    check,
    checkFailureRate,
    actionName
  );
  metrics.addTimmingTrend(response, trend, actionName);
  response = selectItemRequest(variantId);
  metrics.addCheckFailuerRate(
    response,
    verify.verifyStatusCode(response, counter, actionName),
    verify.verifyCorrectResponseDataLoadTest(response, searchItemString, counter, actionName),
    check,
    checkFailureRate,
    actionName
  );
  sleep(sleepTime);
};

var selectItemFlow = function (
  searchItemString,
  variantId,
  check,
  checkFailureRate,
  counter,
  trend,
  sleepTime
) {
  return group('Select Item Flow', function () {
    selectItemAction(
      searchItemString,
      variantId,
      check,
      checkFailureRate,
      counter,
      trend,
      sleepTime,
      'Select Item ' + searchItemString
    );
  });
};

module.exports.selectItemPermittedCommunicationRequest = selectItemPermittedCommunicationRequest;
module.exports.selectItemRequest = selectItemRequest;
module.exports.selectItemFlow = selectItemFlow;
