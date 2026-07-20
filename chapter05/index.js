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
  // RSSフィード項目を格納する空配列
  const feedItems = [];
  // 各配列parseURLを実行
  // 外部RSSエンドポイントからのレスポンスをPromiseオブジェクト
  const awaitableRequests = urls.map((url) => parser.parseURL(url));
  // 全てのPromiseがリクエストを完了するのを待ち、レスポンスを収集
  const responses = await Promise.all(awaitableRequests);
  // レスポンスと feedItems 配列を aggregate関数に渡す
  // aggregate関数はRSSフィードの結果をまとめる
  aggregate(responses, feedItems);
  // 結果のfeedItems配列を print 関数に渡す
  print(feedItems);
};

// 2秒ごとに取得する
setInterval(main, 3000);
