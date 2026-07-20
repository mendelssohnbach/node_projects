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

// RSSレスポンスと feedItems 配列を受け取る
const aggregate = (responses, feedItems) => {
  // フィードレスポンス responses をループし、
  // 分割代入で items のみ取得
  for (let { items } of responses) {
    // items をさらにループ処理し、 title と link を抽出
    for (let { title, link } of items) {
      // title に文字列 ham という部分文字列が含まれていれば
      if (title.toLowerCase().includes('chicken')) {
        // feedItems 配列に追加
        feedItems.push({ title, link });
      }
    }
  }
  // feed配列を返す
  return feedItems;
};

const print = (feedItems) => {
  // 標準出力をクリア
  console.clear();
  // feedItems の内容をテーブル形式で出力
  console.table(feedItems);
  // 最終更新日時をUTC系s機で表示
  console.log('Last updated ', new Date().toUTCString());
};

// 2秒ごとに取得する
setInterval(main, 3000);
