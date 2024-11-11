// /* eslint-disable @typescript-eslint/no-floating-promises */
// /* eslint-disable import/no-anonymous-default-export */
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck
// import http from "k6/http";
// import { check, sleep } from "k6";

// export const options = {
//   vus: 100,
//   duration: "30s",
// };

// export function setup() {
//   const clerkApiKey = "sk_test_dqYOM3NJ8haUOl3BnbNFtIUHL87YTMXouKgYWE9S7d";
//   const loginHeaders = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${clerkApiKey}`,
//   };

//   const loginRes = http.post(
//     "https://api.clerk.com/v1/testing_tokens",
//     {},
//     { headers: loginHeaders },
//   );

//   const { token } = loginRes.json();
//   return { token };
// }

// export default function (data) {
//   const { token } = data;
//   const baseUrl = "http://localhost:3000/api";

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };

//   // Test GET /api/client
//   const getClientsRes = http.get(`${baseUrl}/client`, { headers });
//   check(getClientsRes, {
//     "GET /api/client status is 200": (r) => r.status === 200,
//     "GET /api/client returns array": (r) => Array.isArray(r.json()),
//   });

//   // // Test POST /api/client
//   // const newClient = {
//   //   name: "Test Client",
//   //   email: `test${Date.now()}@example.com`,
//   // };
//   // const createClientRes = http.post(`${baseUrl}/client`, JSON.stringify(newClient), { headers });
//   // check(createClientRes, {
//   //   "POST /api/client status is 201": (r) => r.status === 201,
//   //   "POST /api/client returns created client": (r) => r.json().name === newClient.name,
//   // });

//   // // Test GET /api/client/:id
//   // const createdClientId = createClientRes.json().id;
//   // const getClientRes = http.get(`${baseUrl}/client/${createdClientId}`, { headers });
//   // check(getClientRes, {
//   //   "GET /api/client/:id status is 200": (r) => r.status === 200,
//   //   "GET /api/client/:id returns correct client": (r) => r.json().id === createdClientId,
//   // });

//   // // Test PUT /api/client/:id
//   // const updatedClient = {
//   //   name: "Updated Test Client",
//   // };
//   // const updateClientRes = http.put(`${baseUrl}/client/${createdClientId}`, JSON.stringify(updatedClient), { headers });
//   // check(updateClientRes, {
//   //   "PUT /api/client/:id status is 200": (r) => r.status === 200,
//   //   "PUT /api/client/:id returns updated client": (r) => r.json().name === updatedClient.name,
//   // });

//   // // Test DELETE /api/client/:id
//   // const deleteClientRes = http.del(`${baseUrl}/client/${createdClientId}`, null, { headers });
//   // check(deleteClientRes, {
//   //   "DELETE /api/client/:id status is 204": (r) => r.status === 204,
//   // });

//   // sleep(1);
// }
