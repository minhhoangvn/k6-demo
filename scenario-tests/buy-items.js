var http = require('k6/http');
var sleep = require('k6').sleep;
var group = require('k6').group;
var jsonpath = require('https://jslib.k6.io/jsonpath/1.0.2/index.js');

var DURATION = '10s';
var VUs = 1;

var buyItemWithUnregisterUserTestScenario = {
  exec: 'buyItemWithUnregisterUser',
  executor: 'per-vu-iterations',
  iterations: 1,
  //duration: DURATION,
  vus: VUs,
  startTime: '0s',
  tags: { scenario_name: 'buy_item_with_unregister_user' },
};

module.exports.options = {
  scenarios: {
    buy_item_with_unregisger_user_test: buyItemWithUnregisterUserTestScenario,
  },
};

module.exports.buyItemWithUnregisterUser = function () {
  var response;

  var vars = {};

  group('page_1 - http://saleor-storefront.testing.coe.com/', function () {
    response = http.get('http://saleor-storefront.testing.coe.com/', {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        connection: 'keep-alive',
        host: 'saleor-storefront.testing.coe.com',
        'if-modified-since': 'Tue, 20 Oct 2020 15:32:25 GMT',
        'if-none-match': '"5f8f0309-135b"',
        'upgrade-insecure-requests': '1',
      },
    });

    response = http.post(
      'http://saleor.testing.coe.com/graphql/',
      '[{"operationName":"MainMenu","variables":{},"query":"fragment MainMenuSubItem on MenuItem {\\n  id\\n  name\\n  category {\\n    id\\n    name\\n    __typename\\n  }\\n  url\\n  collection {\\n    id\\n    name\\n    __typename\\n  }\\n  page {\\n    slug\\n    __typename\\n  }\\n  parent {\\n    id\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery MainMenu {\\n  shop {\\n    navigation {\\n      main {\\n        id\\n        items {\\n          ...MainMenuSubItem\\n          children {\\n            ...MainMenuSubItem\\n            children {\\n              ...MainMenuSubItem\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"},{"operationName":"FeaturedProducts","variables":{},"query":"fragment BasicProductFields on Product {\\n  id\\n  name\\n  thumbnail {\\n    url\\n    alt\\n    __typename\\n  }\\n  thumbnail2x: thumbnail(size: 510) {\\n    url\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductPricingField on Product {\\n  pricing {\\n    onSale\\n    priceRangeUndiscounted {\\n      start {\\n        ...Price\\n        __typename\\n      }\\n      stop {\\n        ...Price\\n        __typename\\n      }\\n      __typename\\n    }\\n    priceRange {\\n      start {\\n        ...Price\\n        __typename\\n      }\\n      stop {\\n        ...Price\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery FeaturedProducts {\\n  shop {\\n    homepageCollection {\\n      id\\n      products(first: 20) {\\n        edges {\\n          node {\\n            ...BasicProductFields\\n            ...ProductPricingField\\n            category {\\n              id\\n              name\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"},{"operationName":"ProductsList","variables":{},"query":"query ProductsList {\\n  shop {\\n    description\\n    name\\n    homepageCollection {\\n      id\\n      backgroundImage {\\n        url\\n        __typename\\n      }\\n      name\\n      __typename\\n    }\\n    __typename\\n  }\\n  categories(level: 0, first: 4) {\\n    edges {\\n      node {\\n        id\\n        name\\n        backgroundImage {\\n          url\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"},{"operationName":"SecondaryMenu","variables":{},"query":"fragment SecondaryMenuSubItem on MenuItem {\\n  id\\n  name\\n  category {\\n    id\\n    name\\n    __typename\\n  }\\n  url\\n  collection {\\n    id\\n    name\\n    __typename\\n  }\\n  page {\\n    slug\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery SecondaryMenu {\\n  shop {\\n    navigation {\\n      secondary {\\n        items {\\n          ...SecondaryMenuSubItem\\n          children {\\n            ...SecondaryMenuSubItem\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"},{"operationName":"GetShopPaymentGateways","variables":{},"query":"query GetShopPaymentGateways {\\n  shop {\\n    availablePaymentGateways {\\n      id\\n      name\\n      config {\\n        field\\n        value\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}]',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json;type=content-type;mimeType=application/json',
        },
      }
    );
    console.log(response.status);
    vars['id1'] = jsonpath.query(
      response.json(),
      '$[1].data.shop.homepageCollection.products.edges[1].node.id'
    )[0];

    response = http.post(
      'http://saleor.testing.coe.com/graphql/',
      '[{"operationName":"ProductDetails","variables":{"id":"' +
        vars['id1'] +
        '"},"query":"fragment BasicProductFields on Product {\\n  id\\n  name\\n  thumbnail {\\n    url\\n    alt\\n    __typename\\n  }\\n  thumbnail2x: thumbnail(size: 510) {\\n    url\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment SelectedAttributeFields on SelectedAttribute {\\n  attribute {\\n    id\\n    name\\n    __typename\\n  }\\n  values {\\n    id\\n    name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductVariantFields on ProductVariant {\\n  id\\n  sku\\n  name\\n  isAvailable\\n  quantityAvailable(countryCode: $countryCode)\\n  images {\\n    id\\n    url\\n    alt\\n    __typename\\n  }\\n  pricing {\\n    onSale\\n    priceUndiscounted {\\n      ...Price\\n      __typename\\n    }\\n    price {\\n      ...Price\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    attribute {\\n      id\\n      name\\n      __typename\\n    }\\n    values {\\n      id\\n      name\\n      value: name\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductPricingField on Product {\\n  pricing {\\n    onSale\\n    priceRangeUndiscounted {\\n      start {\\n        ...Price\\n        __typename\\n      }\\n      stop {\\n        ...Price\\n        __typename\\n      }\\n      __typename\\n    }\\n    priceRange {\\n      start {\\n        ...Price\\n        __typename\\n      }\\n      stop {\\n        ...Price\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery ProductDetails($id: ID!, $countryCode: CountryCode) {\\n  product(id: $id) {\\n    ...BasicProductFields\\n    ...ProductPricingField\\n    descriptionJson\\n    category {\\n      id\\n      name\\n      products(first: 3) {\\n        edges {\\n          node {\\n            ...BasicProductFields\\n            ...ProductPricingField\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    images {\\n      id\\n      url\\n      __typename\\n    }\\n    attributes {\\n      ...SelectedAttributeFields\\n      __typename\\n    }\\n    variants {\\n      ...ProductVariantFields\\n      __typename\\n    }\\n    seoDescription\\n    seoTitle\\n    isAvailable\\n    __typename\\n  }\\n}\\n"}]',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json;type=content-type;mimeType=application/json',
        },
      }
    );
    console.log(response.status);
    vars['id2'] = jsonpath.query(response.json(), '$[0].data.product.variants[0].id')[0];

    response = http.options('http://saleor.testing.coe.com/graphql/', null, {
      headers: {
        accept: '*/*',
        'access-control-request-headers': 'content-type',
        'access-control-request-method': 'POST',
        origin: 'http://saleor-storefront.testing.coe.com',
        'sec-fetch-mode': 'cors',
      },
    });

    response = http.post(
      'http://saleor.testing.coe.com/graphql/',
      '[{"operationName":"CheckoutProductVariants","variables":{"ids":["' +
        vars['id2'] +
        '"]},"query":"fragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductVariant on ProductVariant {\\n  id\\n  name\\n  sku\\n  quantityAvailable\\n  isAvailable\\n  pricing {\\n    onSale\\n    priceUndiscounted {\\n      ...Price\\n      __typename\\n    }\\n    price {\\n      ...Price\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    attribute {\\n      id\\n      name\\n      __typename\\n    }\\n    values {\\n      id\\n      name\\n      value: name\\n      __typename\\n    }\\n    __typename\\n  }\\n  product {\\n    id\\n    name\\n    thumbnail {\\n      url\\n      alt\\n      __typename\\n    }\\n    thumbnail2x: thumbnail(size: 510) {\\n      url\\n      __typename\\n    }\\n    productType {\\n      isShippingRequired\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery CheckoutProductVariants($ids: [ID]) {\\n  productVariants(ids: $ids, first: 100) {\\n    edges {\\n      node {\\n        ...ProductVariant\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}]',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json;type=content-type;mimeType=application/json',
        },
      }
    );
    console.log(response.status);
    response = http.post(
      'http://saleor.testing.coe.com/graphql/',
      '[{"operationName":"CreateCheckout","variables":{"checkoutInput":{"email":"hnminh@outlook.com","lines":[{"quantity":1,"variantId":"' +
        vars['id2'] +
        '"}],"shippingAddress":{"city":"TP Hồ Chí Minh","companyName":"KMS-Technology","country":"VN","countryArea":"Thành phố Hồ Chí Minh","firstName":"minh","lastName":"hoang","phone":"0934058877","postalCode":"700000","streetAddress1":"123 cộng hòa quận Tân Bình"}}},"query":"fragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductVariant on ProductVariant {\\n  id\\n  name\\n  sku\\n  quantityAvailable\\n  isAvailable\\n  pricing {\\n    onSale\\n    priceUndiscounted {\\n      ...Price\\n      __typename\\n    }\\n    price {\\n      ...Price\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    attribute {\\n      id\\n      name\\n      __typename\\n    }\\n    values {\\n      id\\n      name\\n      value: name\\n      __typename\\n    }\\n    __typename\\n  }\\n  product {\\n    id\\n    name\\n    thumbnail {\\n      url\\n      alt\\n      __typename\\n    }\\n    thumbnail2x: thumbnail(size: 510) {\\n      url\\n      __typename\\n    }\\n    productType {\\n      isShippingRequired\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CheckoutLine on CheckoutLine {\\n  id\\n  quantity\\n  totalPrice {\\n    ...Price\\n    __typename\\n  }\\n  variant {\\n    ...ProductVariant\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Address on Address {\\n  id\\n  firstName\\n  lastName\\n  companyName\\n  streetAddress1\\n  streetAddress2\\n  city\\n  postalCode\\n  country {\\n    code\\n    country\\n    __typename\\n  }\\n  countryArea\\n  phone\\n  isDefaultBillingAddress\\n  isDefaultShippingAddress\\n  __typename\\n}\\n\\nfragment ShippingMethod on ShippingMethod {\\n  id\\n  name\\n  price {\\n    currency\\n    amount\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Checkout on Checkout {\\n  token\\n  id\\n  totalPrice {\\n    ...Price\\n    __typename\\n  }\\n  subtotalPrice {\\n    ...Price\\n    __typename\\n  }\\n  billingAddress {\\n    ...Address\\n    __typename\\n  }\\n  shippingAddress {\\n    ...Address\\n    __typename\\n  }\\n  email\\n  availableShippingMethods {\\n    ...ShippingMethod\\n    __typename\\n  }\\n  shippingMethod {\\n    ...ShippingMethod\\n    __typename\\n  }\\n  shippingPrice {\\n    ...Price\\n    __typename\\n  }\\n  lines {\\n    ...CheckoutLine\\n    __typename\\n  }\\n  isShippingRequired\\n  discount {\\n    currency\\n    amount\\n    __typename\\n  }\\n  discountName\\n  translatedDiscountName\\n  voucherCode\\n  __typename\\n}\\n\\nmutation CreateCheckout($checkoutInput: CheckoutCreateInput!) {\\n  checkoutCreate(input: $checkoutInput) {\\n    errors {\\n      field\\n      message\\n      __typename\\n    }\\n    checkout {\\n      ...Checkout\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}]',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json;type=content-type;mimeType=application/json',
        },
      }
    );
    console.log(response.status);
    vars['id3'] = jsonpath.query(response.json(), '$[0].data.checkoutCreate.checkout.id')[0];
    response = http.options('http://saleor.testing.coe.com/graphql/', null, {
      headers: {
        accept: '*/*',
        'access-control-request-headers': 'content-type',
        'access-control-request-method': 'POST',
        origin: 'http://saleor-storefront.testing.coe.com',
        'sec-fetch-mode': 'cors',
      },
    });
    response = http.post(
      'http://saleor.testing.coe.com/graphql/',
      '[{"operationName":"UpdateCheckoutShippingMethod","variables":{"checkoutId":"' +
        vars['id3'] +
        '","shippingMethodId":"U2hpcHBpbmdNZXRob2Q6NjM2"},"query":"fragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductVariant on ProductVariant {\\n  id\\n  name\\n  sku\\n  quantityAvailable\\n  isAvailable\\n  pricing {\\n    onSale\\n    priceUndiscounted {\\n      ...Price\\n      __typename\\n    }\\n    price {\\n      ...Price\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    attribute {\\n      id\\n      name\\n      __typename\\n    }\\n    values {\\n      id\\n      name\\n      value: name\\n      __typename\\n    }\\n    __typename\\n  }\\n  product {\\n    id\\n    name\\n    thumbnail {\\n      url\\n      alt\\n      __typename\\n    }\\n    thumbnail2x: thumbnail(size: 510) {\\n      url\\n      __typename\\n    }\\n    productType {\\n      isShippingRequired\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CheckoutLine on CheckoutLine {\\n  id\\n  quantity\\n  totalPrice {\\n    ...Price\\n    __typename\\n  }\\n  variant {\\n    ...ProductVariant\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Address on Address {\\n  id\\n  firstName\\n  lastName\\n  companyName\\n  streetAddress1\\n  streetAddress2\\n  city\\n  postalCode\\n  country {\\n    code\\n    country\\n    __typename\\n  }\\n  countryArea\\n  phone\\n  isDefaultBillingAddress\\n  isDefaultShippingAddress\\n  __typename\\n}\\n\\nfragment ShippingMethod on ShippingMethod {\\n  id\\n  name\\n  price {\\n    currency\\n    amount\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Checkout on Checkout {\\n  token\\n  id\\n  totalPrice {\\n    ...Price\\n    __typename\\n  }\\n  subtotalPrice {\\n    ...Price\\n    __typename\\n  }\\n  billingAddress {\\n    ...Address\\n    __typename\\n  }\\n  shippingAddress {\\n    ...Address\\n    __typename\\n  }\\n  email\\n  availableShippingMethods {\\n    ...ShippingMethod\\n    __typename\\n  }\\n  shippingMethod {\\n    ...ShippingMethod\\n    __typename\\n  }\\n  shippingPrice {\\n    ...Price\\n    __typename\\n  }\\n  lines {\\n    ...CheckoutLine\\n    __typename\\n  }\\n  isShippingRequired\\n  discount {\\n    currency\\n    amount\\n    __typename\\n  }\\n  discountName\\n  translatedDiscountName\\n  voucherCode\\n  __typename\\n}\\n\\nmutation UpdateCheckoutShippingMethod($checkoutId: ID!, $shippingMethodId: ID!) {\\n  checkoutShippingMethodUpdate(checkoutId: $checkoutId, shippingMethodId: $shippingMethodId) {\\n    errors {\\n      field\\n      message\\n      __typename\\n    }\\n    checkout {\\n      ...Checkout\\n      __typename\\n    }\\n    checkoutErrors {\\n      field\\n      message\\n      code\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}]',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json;type=content-type;mimeType=application/json',
        },
      }
    );
    console.log(response.status);
    vars['postalCode1'] = jsonpath.query(
      response.json(),
      '$[0].data.checkoutShippingMethodUpdate.checkout.shippingAddress.postalCode'
    )[0];

    vars['id4'] = jsonpath.query(
      response.json(),
      '$[0].data.checkoutShippingMethodUpdate.checkout.id'
    )[0];
    response = http.options('http://saleor.testing.coe.com/graphql/', null, {
      headers: {
        accept: '*/*',
        'access-control-request-headers': 'content-type',
        'access-control-request-method': 'POST',
        origin: 'http://saleor-storefront.testing.coe.com',
        'sec-fetch-mode': 'cors',
      },
    });

    response = http.post(
      'http://saleor.testing.coe.com/graphql/',
      '[{"operationName":"UpdateCheckoutBillingAddress","variables":{"billingAddress":{"city":"TP HỒ CHÍ MINH","companyName":"KMS-Technology","country":"VN","countryArea":"Thành phố Hồ Chí Minh","firstName":"minh","lastName":"hoang","phone":"+84934058877","postalCode":"' +
        vars['postalCode1'] +
        '","streetAddress1":"123 cộng hòa quận Tân Bình","streetAddress2":""},"checkoutId":"' +
        vars['id4'] +
        '"},"query":"fragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductVariant on ProductVariant {\\n  id\\n  name\\n  sku\\n  quantityAvailable\\n  isAvailable\\n  pricing {\\n    onSale\\n    priceUndiscounted {\\n      ...Price\\n      __typename\\n    }\\n    price {\\n      ...Price\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    attribute {\\n      id\\n      name\\n      __typename\\n    }\\n    values {\\n      id\\n      name\\n      value: name\\n      __typename\\n    }\\n    __typename\\n  }\\n  product {\\n    id\\n    name\\n    thumbnail {\\n      url\\n      alt\\n      __typename\\n    }\\n    thumbnail2x: thumbnail(size: 510) {\\n      url\\n      __typename\\n    }\\n    productType {\\n      isShippingRequired\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CheckoutLine on CheckoutLine {\\n  id\\n  quantity\\n  totalPrice {\\n    ...Price\\n    __typename\\n  }\\n  variant {\\n    ...ProductVariant\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Address on Address {\\n  id\\n  firstName\\n  lastName\\n  companyName\\n  streetAddress1\\n  streetAddress2\\n  city\\n  postalCode\\n  country {\\n    code\\n    country\\n    __typename\\n  }\\n  countryArea\\n  phone\\n  isDefaultBillingAddress\\n  isDefaultShippingAddress\\n  __typename\\n}\\n\\nfragment ShippingMethod on ShippingMethod {\\n  id\\n  name\\n  price {\\n    currency\\n    amount\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Checkout on Checkout {\\n  token\\n  id\\n  totalPrice {\\n    ...Price\\n    __typename\\n  }\\n  subtotalPrice {\\n    ...Price\\n    __typename\\n  }\\n  billingAddress {\\n    ...Address\\n    __typename\\n  }\\n  shippingAddress {\\n    ...Address\\n    __typename\\n  }\\n  email\\n  availableShippingMethods {\\n    ...ShippingMethod\\n    __typename\\n  }\\n  shippingMethod {\\n    ...ShippingMethod\\n    __typename\\n  }\\n  shippingPrice {\\n    ...Price\\n    __typename\\n  }\\n  lines {\\n    ...CheckoutLine\\n    __typename\\n  }\\n  isShippingRequired\\n  discount {\\n    currency\\n    amount\\n    __typename\\n  }\\n  discountName\\n  translatedDiscountName\\n  voucherCode\\n  __typename\\n}\\n\\nmutation UpdateCheckoutBillingAddress($checkoutId: ID!, $billingAddress: AddressInput!) {\\n  checkoutBillingAddressUpdate(checkoutId: $checkoutId, billingAddress: $billingAddress) {\\n    errors {\\n      field\\n      message\\n      __typename\\n    }\\n    checkout {\\n      ...Checkout\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}]',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json;type=content-type;mimeType=application/json',
        },
      }
    );
    console.log(response.status);
    response = http.options('http://saleor.testing.coe.com/graphql/', null, {
      headers: {
        accept: '*/*',
        'access-control-request-headers': 'content-type',
        'access-control-request-method': 'POST',
        origin: 'http://saleor-storefront.testing.coe.com',
        'sec-fetch-mode': 'cors',
      },
    });

    response = http.post(
      'http://saleor.testing.coe.com/graphql/',
      '[{"operationName":"CreateCheckoutPayment","variables":{"checkoutId":"' +
        vars['id4'] +
        '","paymentInput":{"amount":110.86,"billingAddress":{"city":"TP HỒ CHÍ MINH","companyName":"KMS-Technology","country":"VN","countryArea":"Thành phố Hồ Chí Minh","firstName":"minh","lastName":"hoang","phone":"+84934058877","postalCode":"' +
        vars['postalCode1'] +
        '","streetAddress1":"123 cộng hòa quận Tân Bình","streetAddress2":""},"gateway":"mirumee.payments.dummy","token":"charged"}},"query":"fragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductVariant on ProductVariant {\\n  id\\n  name\\n  sku\\n  quantityAvailable\\n  isAvailable\\n  pricing {\\n    onSale\\n    priceUndiscounted {\\n      ...Price\\n      __typename\\n    }\\n    price {\\n      ...Price\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    attribute {\\n      id\\n      name\\n      __typename\\n    }\\n    values {\\n      id\\n      name\\n      value: name\\n      __typename\\n    }\\n    __typename\\n  }\\n  product {\\n    id\\n    name\\n    thumbnail {\\n      url\\n      alt\\n      __typename\\n    }\\n    thumbnail2x: thumbnail(size: 510) {\\n      url\\n      __typename\\n    }\\n    productType {\\n      isShippingRequired\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment CheckoutLine on CheckoutLine {\\n  id\\n  quantity\\n  totalPrice {\\n    ...Price\\n    __typename\\n  }\\n  variant {\\n    ...ProductVariant\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Address on Address {\\n  id\\n  firstName\\n  lastName\\n  companyName\\n  streetAddress1\\n  streetAddress2\\n  city\\n  postalCode\\n  country {\\n    code\\n    country\\n    __typename\\n  }\\n  countryArea\\n  phone\\n  isDefaultBillingAddress\\n  isDefaultShippingAddress\\n  __typename\\n}\\n\\nfragment ShippingMethod on ShippingMethod {\\n  id\\n  name\\n  price {\\n    currency\\n    amount\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Checkout on Checkout {\\n  token\\n  id\\n  totalPrice {\\n    ...Price\\n    __typename\\n  }\\n  subtotalPrice {\\n    ...Price\\n    __typename\\n  }\\n  billingAddress {\\n    ...Address\\n    __typename\\n  }\\n  shippingAddress {\\n    ...Address\\n    __typename\\n  }\\n  email\\n  availableShippingMethods {\\n    ...ShippingMethod\\n    __typename\\n  }\\n  shippingMethod {\\n    ...ShippingMethod\\n    __typename\\n  }\\n  shippingPrice {\\n    ...Price\\n    __typename\\n  }\\n  lines {\\n    ...CheckoutLine\\n    __typename\\n  }\\n  isShippingRequired\\n  discount {\\n    currency\\n    amount\\n    __typename\\n  }\\n  discountName\\n  translatedDiscountName\\n  voucherCode\\n  __typename\\n}\\n\\nfragment Payment on Payment {\\n  id\\n  gateway\\n  token\\n  creditCard {\\n    brand\\n    firstDigits\\n    lastDigits\\n    expMonth\\n    expYear\\n    __typename\\n  }\\n  __typename\\n}\\n\\nmutation CreateCheckoutPayment($checkoutId: ID!, $paymentInput: PaymentInput!) {\\n  checkoutPaymentCreate(checkoutId: $checkoutId, input: $paymentInput) {\\n    errors {\\n      field\\n      message\\n      __typename\\n    }\\n    checkout {\\n      ...Checkout\\n      __typename\\n    }\\n    payment {\\n      ...Payment\\n      __typename\\n    }\\n    paymentErrors {\\n      field\\n      message\\n      code\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}]',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json;type=content-type;mimeType=application/json',
        },
      }
    );
    console.log(response.status);
    response = http.post(
      'http://saleor.testing.coe.com/graphql/',
      '[{"operationName":"CompleteCheckout","variables":{"checkoutId":"' +
        vars['id4'] +
        '"},"query":"fragment OrderPrice on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Address on Address {\\n  id\\n  firstName\\n  lastName\\n  companyName\\n  streetAddress1\\n  streetAddress2\\n  city\\n  postalCode\\n  country {\\n    code\\n    country\\n    __typename\\n  }\\n  countryArea\\n  phone\\n  isDefaultBillingAddress\\n  isDefaultShippingAddress\\n  __typename\\n}\\n\\nfragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductVariant on ProductVariant {\\n  id\\n  name\\n  sku\\n  quantityAvailable\\n  isAvailable\\n  pricing {\\n    onSale\\n    priceUndiscounted {\\n      ...Price\\n      __typename\\n    }\\n    price {\\n      ...Price\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    attribute {\\n      id\\n      name\\n      __typename\\n    }\\n    values {\\n      id\\n      name\\n      value: name\\n      __typename\\n    }\\n    __typename\\n  }\\n  product {\\n    id\\n    name\\n    thumbnail {\\n      url\\n      alt\\n      __typename\\n    }\\n    thumbnail2x: thumbnail(size: 510) {\\n      url\\n      __typename\\n    }\\n    productType {\\n      isShippingRequired\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment OrderDetail on Order {\\n  userEmail\\n  paymentStatus\\n  paymentStatusDisplay\\n  status\\n  statusDisplay\\n  id\\n  token\\n  number\\n  shippingAddress {\\n    ...Address\\n    __typename\\n  }\\n  lines {\\n    productName\\n    quantity\\n    variant {\\n      ...ProductVariant\\n      __typename\\n    }\\n    unitPrice {\\n      currency\\n      ...OrderPrice\\n      __typename\\n    }\\n    __typename\\n  }\\n  subtotal {\\n    ...OrderPrice\\n    __typename\\n  }\\n  total {\\n    ...OrderPrice\\n    __typename\\n  }\\n  shippingPrice {\\n    ...OrderPrice\\n    __typename\\n  }\\n  __typename\\n}\\n\\nmutation CompleteCheckout($checkoutId: ID!) {\\n  checkoutComplete(checkoutId: $checkoutId) {\\n    errors {\\n      field\\n      message\\n      __typename\\n    }\\n    order {\\n      ...OrderDetail\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}]',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json;type=content-type;mimeType=application/json',
        },
      }
    );
    console.log(response.status);
    vars['orderToken'] = jsonpath.query(response.json(), '$[0].data.checkoutComplete.order.token');
    response = http.options('http://saleor.testing.coe.com/graphql/', null, {
      headers: {
        accept: '*/*',
        'access-control-request-headers': 'content-type',
        'access-control-request-method': 'POST',
        origin: 'http://saleor-storefront.testing.coe.com',
        'sec-fetch-mode': 'cors',
      },
    });

    response = http.post(
      'http://saleor.testing.coe.com/graphql/',
      '[{"operationName":"OrderByToken","variables":{"token":"' +
        vars['orderToken'] +
        '"},"query":"fragment OrderPrice on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment Address on Address {\\n  id\\n  firstName\\n  lastName\\n  companyName\\n  streetAddress1\\n  streetAddress2\\n  city\\n  postalCode\\n  country {\\n    code\\n    country\\n    __typename\\n  }\\n  countryArea\\n  phone\\n  isDefaultBillingAddress\\n  isDefaultShippingAddress\\n  __typename\\n}\\n\\nfragment Price on TaxedMoney {\\n  gross {\\n    amount\\n    currency\\n    __typename\\n  }\\n  net {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment ProductVariant on ProductVariant {\\n  id\\n  name\\n  sku\\n  quantityAvailable\\n  isAvailable\\n  pricing {\\n    onSale\\n    priceUndiscounted {\\n      ...Price\\n      __typename\\n    }\\n    price {\\n      ...Price\\n      __typename\\n    }\\n    __typename\\n  }\\n  attributes {\\n    attribute {\\n      id\\n      name\\n      __typename\\n    }\\n    values {\\n      id\\n      name\\n      value: name\\n      __typename\\n    }\\n    __typename\\n  }\\n  product {\\n    id\\n    name\\n    thumbnail {\\n      url\\n      alt\\n      __typename\\n    }\\n    thumbnail2x: thumbnail(size: 510) {\\n      url\\n      __typename\\n    }\\n    productType {\\n      isShippingRequired\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment OrderDetail on Order {\\n  userEmail\\n  paymentStatus\\n  paymentStatusDisplay\\n  status\\n  statusDisplay\\n  id\\n  token\\n  number\\n  shippingAddress {\\n    ...Address\\n    __typename\\n  }\\n  lines {\\n    productName\\n    quantity\\n    variant {\\n      ...ProductVariant\\n      __typename\\n    }\\n    unitPrice {\\n      currency\\n      ...OrderPrice\\n      __typename\\n    }\\n    __typename\\n  }\\n  subtotal {\\n    ...OrderPrice\\n    __typename\\n  }\\n  total {\\n    ...OrderPrice\\n    __typename\\n  }\\n  shippingPrice {\\n    ...OrderPrice\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery OrderByToken($token: UUID!) {\\n  orderByToken(token: $token) {\\n    ...OrderDetail\\n    __typename\\n  }\\n}\\n"}]',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json;type=content-type;mimeType=application/json',
        },
      }
    );
    console.log(response.status);
    console.log('checkout id', JSON.stringify(response.json()));
  });

  // Automatically added sleep
  sleep(1);
};
