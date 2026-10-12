import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const errorRate = new Rate("errors");
const apiDuration = new Trend("api_duration");

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "2m", target: 50 },
    { duration: "30s", target: 0 },
  ],

  thresholds: {
    http_req_duration: ["p(95)<500"],
    errors: ["rate<0.01"],
  },
};

const BASE_URL = "https://jsonplaceholder.typicode.com";

export default function () {
  // GET /posts/1
  const response = http.get(`${BASE_URL}/posts/1`);

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response < 500 ms": (r) => r.timings.duration < 500,
  });

  apiDuration.add(response.timings.duration);
  errorRate.add(response.status !== 200);

  sleep(1);
}
