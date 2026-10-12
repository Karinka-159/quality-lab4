import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Кастомная метрика для отслеживания ошибок
const errorRate = new Rate("errors");

export const options = {
  scenarios: {
    stress_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        // Разогрев до 100 VU (то, что уже выдержала система)
        { duration: "30s", target: 100 },
        { duration: "1m", target: 100 },

        // Шаг 1: 100 -> 200
        { duration: "30s", target: 200 },
        { duration: "1m", target: 200 },

        // Шаг 2: 200 -> 300
        { duration: "30s", target: 300 },
        { duration: "1m", target: 300 },

        // Шаг 3: 300 -> 400
        { duration: "30s", target: 400 },
        { duration: "1m", target: 400 },

        // Шаг 4: 400 -> 500 (вероятная зона отказа)
        { duration: "30s", target: 500 },
        { duration: "1m", target: 500 },

        // Спад нагрузки
        { duration: "30s", target: 0 },
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    // Порог по ошибкам: если больше 1% — тест принудительно останавливается
    http_req_failed: [
      {
        threshold: "rate<0.01",
        abortOnFail: true,
        delayAbortEval: "30s",
      },
    ],
    // Порог по времени ответа: если p95 > 1 секунды — тест останавливается
    http_req_duration: [
      {
        threshold: "p(95)<1000",
        abortOnFail: true,
        delayAbortEval: "30s",
      },
    ],
  },
};

// URL для теста
const BASE_URL = "https://jsonplaceholder.typicode.com";

export default function () {
  // Делаем запрос к API
  const res = http.get(`${BASE_URL}/posts/1`);

  // Проверяем статус и время ответа
  const checkRes = check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 2s": (r) => r.timings.duration < 2000,
  });

  // Если проверка не прошла — фиксируем ошибку
  if (!checkRes) {
    errorRate.add(1);
  }

  // Минимальная пауза
  sleep(0.5);
}
