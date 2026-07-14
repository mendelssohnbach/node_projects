import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import Fastify from 'fastify';
import { join } from 'path'; // クロスプラットホーム五感のファイルパスを作成
import menuItems from './data/menuItems.js';
import operatingHours from './data/operatingHours.js';
// プロジェクトのルートレベルにあるpublicディレクトリへの絶対パスを作成
const publicPath = join(process.cwd(), 'public');

const app = Fastify();
const port = 3000;

// 静的ファイルを提供するために fastifyStatic プラグインを登録
app.register(fastifyStatic, {
  root: publicPath, // 静的ファイルの提供元ディレクトリを設定
  prefix: '/public/', // URLプレフィックスを `/public? に設定
});

// EJSをテンプレートエンジンとして設定
app.register(fastifyView, {
  engine: {
    ejs: ejs,
  },
});

// response: リクエスの処理
// reply: レスポンスの送信
// async: Promiseベースのリーティングを利用
app.get('/', (req, reply) => {
  // `reply.view` を使って views フォルダー内の index.ejs ページを表示
  reply.view('views/index.ejs', { name: "What's Fare is Fair" });
});

// `reply.view` を使って menuItems データ渡して、
//  views フォルダー内の .menu.ejs ページを表示
app.get('/menu', (req, reply) => {
  reply.view('views/menu.ejs', { menuItems });
});

// operatingHours と day のデータを渡して、
//  views フォルダー内の .hours.ejs ページを表示
app.get('/hours', (req, reply) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  reply.view('views/hours.ejs', { operatingHours, days });
});

// サーバを起動し、定義したポートにバインドする
await app.listen({ port, host: '0.0.0.0' });
console.log(`Web Server is listening at http://localhost:${port}`);
