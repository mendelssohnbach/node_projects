import Parser from 'rss-parser';

// Parser クラスをインスタンス化
const parser = new Parser();

// RSSフィードを取得するURL
const urls = [
  'https://www.bonappetit.com/feed/recipes-rss-feed/rss',
  `https://www.budgetbytes.com/category/recipes/feed/`,
];

// HTTPリクエストの処理をまとめる非同期関数
const main = async () => {
  // RSSフィードのCMLを取得解析し、 title と items に分割代入
  const { title, items } = await parser.parseURL(url);

  // 更新のたびにコンソールをクリアする
  console.clear(); // a
  console.log(title); // フィードのタイトルを表示
  // 項目毎の title,link を抽出
  const results = items.map(({ title, link }) => ({ title, link }));
  // テーブル形式で出力
  console.table(results);

  // タイムスタンプ表示
  console.log('Last updated:', new Date().toUTCString());
};

// 2秒ごとに取得する
setInterval(main, 3000);
