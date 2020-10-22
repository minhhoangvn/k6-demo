import ws from 'k6/ws';
import { check } from 'k6';

export let options = {
  scenarios: {
    demo_test: {
      exec: 'demo_chat',
      executor: 'per-vu-iterations',
      iterations: 2,
      vus: 2,
      tags: { scenario_name: 'demo_test' },
    },
  },
  thresholds: {
    'requests{scenario_name:demo_test}': ['count < 100'],
    'http_req_connecting{scenario_name:demo_test}': ['p(95)<450'],
    'http_req_duration{scenario_name:demo_test}': ['p(95)<3000'],
    RTT: ['p(99)<300', 'p(70)<250', 'avg<200', 'med<150', 'min<100'],
    'Content OK': ['rate>0.95'],
    ContentSize: ['value<4000'],
    'Errors{scenario_name:demo_test}': ['count<100'],
  },
};

export function demo_chat() {
  const url = 'ws://echo.websocket.org';
  const params = { tags: { my_tag: 'hello' } };

  let res = ws.connect(url, params, function (socket) {
    socket.on('open', function open() {
      socket.ping();
      console.log('connected');
    });

    socket.on('ping', function () {
      console.log('PING!');
    });

    socket.on('pong', function () {
      console.log('PONG!');
      socket.send(`${__VU}: ${new Date()}`);
    });

    socket.on('close', function () {
      console.log('disconnected');
    });

    socket.on('message', function (data) {
      console.log('message', data);
    });

    socket.setTimeout(function () {
      console.log('2 seconds passed, closing the socket');
      socket.close();
    }, 3000);
  });
  console.log(JSON.stringify(res));
  check(res, { 'status is 101': (r) => r && r.status === 101 });
}
