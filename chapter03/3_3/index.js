import fastify from 'fastify';

const app = fastify();
const port = 3000;

// ルート / でHTTP GETリクエストをリッスンするルートを登録
app.get('/', async (request, reply) => {
  return "Welcome to What's Fare is Fair!";
});

// サーバを起動し、定義したポートにバインドする
await app.listen({ port, host: '0.0.0.0' });
console.log(`Web Service is listening at http://localhost:${port}`);
