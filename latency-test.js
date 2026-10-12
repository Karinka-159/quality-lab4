import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 40,
    duration: '30s',
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {
    const response = http.get(`${BASE_URL}/posts/1`);

    check(response, {
        'status is 200': (r) => r.status === 200,
    });
}
