import Fastify from 'fastify';
import menuItems from './data/menuItems.js';
import operatingHours from './data/operatingHours.js';

const app = Fastify();
const port = 3000;

// ルート / でHTTP GETリクエストをリッスンするルートを登録
// response: リクエスの処理
// reply: レスポンスの送信
// async: Promiseベースのリーティングを利用
app.get('/', async (request, reply) => {
  return "Welcome to What's Fare is Fair!";
});

// /menu パスへのGETリクエストのためのルート
app.get('/menu', async (request, reply) => {
  reply.send(menuItems);
});

// /hours パスへのGETリクエストのためのルート
app.get('/hours', async (request, reply) => {
  reply.send(operatingHours);
});

// サーバを起動し、定義したポートにバインドする
await app.listen({ port, host: '0.0.0.0' });
console.log(`Web Server is listening at http://localhost:${port}`);

// TODO //
// ルートに簡単なエラー処理を書く
// エラー処理をロギングに書き換える
// メニューデータに id を追加を検討する
