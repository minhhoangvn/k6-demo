// Can be dynamic with __ENV
module.exports = {
  TARGET_URL: 'http://saleor.testing.coe.com/graphql/',
  STORE_FRONT_URL: 'http://saleor-storefront.testing.coe.com/',
  DASHBOARD_URL: 'http://saleor-dashboard.testing.coe.com/dashboard/',
  GRAPHQL_URL: 'http://saleor.testing.coe.com/graphql',
  DEFAULT_POST_HEADERS: {
    accept: '*/*',
    'content-type': 'application/json;type=content-type;mimeType=application/json',
  },
  DEFAULT_OPTIONS_HEADERS: {
    accept: '*/*',
    'access-control-request-headers': 'content-type',
    'access-control-request-method': 'POST',
    'sec-fetch-mode': 'cors',
  },
};
