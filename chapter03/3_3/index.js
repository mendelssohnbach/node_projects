import fastify from 'fastify';

const app = fastify();
const port = 3000;

// ルート / でHTTP GETリクエストをリッスンするルートを登録
// response: リクエスの処理
// reply: レスポンスの送信
// async: Promiseベースのリーティングを利用
app.get('/', async (request, reply) => {
  return "Welcome to What's Fare is Fair!";
});

// /menu パスへのGETリクエストのためのルート
app.get('/menu', async (Response, replay) => {
  return 'TODO: Menu Page';
});

// /hours パスへのGETリクエストのためのルート
app.get('/hours', async (Response, replay) => {
  return 'TODO: Hours Page';
});

// サーバを起動し、定義したポートにバインドする
await app.listen({ port, host: '0.0.0.0' });
console.log(`Web Service is listening at http://localhost:${port}`);
