import http from 'k6/http';
import { sleep } from 'k6';

const homeService = (check, checkFailureRate) => {
  // our HTTP request, note that we are saving the response to res,
  // which can be accessed later

  const res = http.get('http://test.k6.io');

  sleep(1);

  const checkRes = check(res, {
    'status is 200': (r) => r.status === 200,
    'response body': (r) =>
      JSON.stringify(r.body).indexOf(
        'Collection of simple web-pages suitable for load testing.'
      ) !== -1,
  });
  checkFailureRate.add(checkRes);
};

exports.homeService = homeService;
