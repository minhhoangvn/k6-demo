var http = require('k6/http');
var sleep = require('k6').sleep;
var group = require('k6').group;
var jsonpath = require('https://jslib.k6.io/jsonpath/1.0.2/index.js');
var verify = require('./validations.js');
var metrics = require('./metrics.js');
var GLOBAL_VARS = require('../../helper/constant.js');

var searchRequest = function (searchItemString) {
  return http.post(
    GLOBAL_VARS.TARGET_URL,
    '[{"operationName":"SearchResults","variables":{"query":"' +
      searchItemString +
      '"},"query":"query SearchResults($query: String!) {   products(filter: {search: $query}, first: 20) {     edges {       node {         id         name         thumbnail {           url           alt           __typename         }         thumbnail2x: thumbnail(size: 510) {           url           __typename         }         url         category {           id           name           __typename         }         __typename       }       __typename     }     pageInfo {       endCursor       hasNextPage       hasPreviousPage       startCursor       __typename     }     __typename   } } "}]',
    {
      headers: GLOBAL_VARS.DEFAULT_POST_HEADERS,
    }
  );
};

var selectItemRequest = function (productId) {
  return http.post(
    GLOBAL_VARS.TARGET_URL,
    '[{"operationName":"ProductDetails","variables":{"id":"' +
      productId +
      '"},"query":"fragment BasicProductFields on Product {\\n  id\\n  name\\n  thumbnail {\\n    url\\n    alt\\n    __typename\\n  }\\n  thumbnail2x: thumbnail(size: 510) {\\n    url\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment SelectedAttributeFields on SelectedAttribute {\\n  attribute {\\n    id\\n    name\\n    __typename\\n  }\\n  values {\\n    id\\n    name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductVariantFields on ProductVariant {\\n  id\\n  sku\\n  name\\n  isAvailable\\n  quantityAvailable(countryCode: $countryCode)\\n  images {\\n    id\\n    url\\n    alt\\n    __typename\\n  }\\n  pricing {\\n    onSale\\n    priceUndiscounted {\\n      ...Price\\n      __typename\\n    }\\n    price {\\n      ...Price\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    attribute {\\n      id\\n      name\\n      __typename\\n    }\\n    values {\\n      id\\n      name\\n      value: name\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductPricingField on Product {\\n  pricing {\\n    onSale\\n    priceRangeUndiscounted {\\n      start {\\n        ...Price\\n        __typename\\n      }\\n      stop {\\n        ...Price\\n        __typename\\n      }\\n      __typename\\n    }\\n    priceRange {\\n      start {\\n        ...Price\\n        __typename\\n      }\\n      stop {\\n        ...Price\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery ProductDetails($id: ID!, $countryCode: CountryCode) {\\n  product(id: $id) {\\n    ...BasicProductFields\\n    ...ProductPricingField\\n    descriptionJson\\n    category {\\n      id\\n      name\\n      products(first: 3) {\\n        edges {\\n          node {\\n            ...BasicProductFields\\n            ...ProductPricingField\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    images {\\n      id\\n      url\\n      __typename\\n    }\\n    attributes {\\n      ...SelectedAttributeFields\\n      __typename\\n    }\\n    variants {\\n      ...ProductVariantFields\\n      __typename\\n    }\\n    seoDescription\\n    seoTitle\\n    isAvailable\\n    __typename\\n  }\\n}\\n"}]',
    {
      headers: GLOBAL_VARS.DEFAULT_POST_HEADERS,
    }
  );
};

var searchAction = function (
  searchItemString,
  check,
  checkFailureRate,
  counter,
  trend,
  sleepTime,
  actionName
) {
  var response = searchRequest(searchItemString);
  metrics.addCheckFailuerRate(
    response,
    verify.verifyStatusCode(response, counter, actionName),
    verify.verifyCorrectResponseDataLoadTest(response, searchItemString, counter, actionName),
    check,
    checkFailureRate,
    actionName
  );
  metrics.addTimmingTrend(response, trend, actionName);
  sleep(sleepTime);
  if (response.status === 200 || response.status === 204)
    return jsonpath.query(response.json(), '$[0].data.products.edges[0].node.id')[0];
  return undefined;
};

var selectSearchAction = function (
  productId,
  searchItemString,
  check,
  checkFailureRate,
  counter,
  trend,
  sleepTime,
  actionName
) {
  var response = selectItemRequest(productId);
  metrics.addCheckFailuerRate(
    response,
    verify.verifyStatusCode(response, counter, actionName),
    verify.verifyCorrectResponseDataLoadTest(response, searchItemString, counter, actionName),
    check,
    checkFailureRate,
    actionName
  );
  metrics.addTimmingTrend(response, trend, actionName);
  sleep(sleepTime);
  if (response.status === 200 || response.status === 204)
    return jsonpath.query(response.json(), '$[0].data.product.variants[0].id')[0];
  return undefined;
};

var searchAndSelectItemFlow = function (
  itemString,
  check,
  checkFailureRate,
  counter,
  trend,
  sleepTime
) {
  return group('Search Item Flow', function () {
    var productId = searchAction(
      itemString,
      check,
      checkFailureRate,
      counter,
      trend,
      sleepTime,
      'Search ' + itemString
    );
    var variantId = selectSearchAction(
      productId,
      itemString,
      check,
      checkFailureRate,
      counter,
      trend,
      sleepTime,
      'Select ' + itemString
    );
    return {
      productId: productId,
      variantId: variantId,
    };
  });
};

module.exports.searchAndSelectItemFlow = searchAndSelectItemFlow;
module.exports.searchRequest = searchRequest;
module.exports.selectItemRequest = selectItemRequest;
