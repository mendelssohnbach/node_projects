import fastifyView from '@fastify/view';
import ejs from 'ejs';
import Fastify from 'fastify';
import menuItems from './data/menuItems.js';
import operatingHours from './data/operatingHours.js';

const app = Fastify();
const port = 3000;

// EJSをテンプレートエンジンとして設定
app.register(fastifyView, {
  engine: {
    ejs: ejs,
  },
});

// response: リクエスの処理
// reply: レスポンスの送信
// async: Promiseベースのリーティングを利用
app.get('/', async (request, reply) => {
  // `reply.view` を使って views フォルダー内の index.ejs ページを表示
  reply.view('views/index.ejs', { name: "What's Fare is Fair" });
});

// `reply.view` を使って menuItems データ渡して、
//  views フォルダー内の .menu.ejs ページを表示
app.get('/menu', async (request, reply) => {
  reply.view('views/menu.ejs', { menuItems });
});

// operatingHours と day のデータを渡して、
//  views フォルダー内の .hours.ejs ページを表示
app.get('/hours', async (request, reply) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  reply.view('view/hours.ejs', { operatingHours, days });
});

// サーバを起動し、定義したポートにバインドする
await app.listen({ port, host: '0.0.0.0' });
console.log(`Web Server is listening at http://localhost:${port}`);

// TODO //
// ルートに簡単なエラー処理を書く
// エラー処理をロギングに書き換える
// メニューデータに id を追加を検討する
