import promptModule from 'prompt-sync';
import Parser from 'rss-parser';

// カスタムフィード項目配列の定義
const customItems = [];
// prompt関数の初期化
const prompt = promptModule({ sigint: true });
// Parser クラスをインスタンス化
const parser = new Parser();

// RSSフィードを取得するURL
const urls = [
  'https://www.bonappetit.com/feed/recipes-rss-feed/rss',
  `https://www.budgetbytes.com/category/recipes/feed/`,
];

// 5章 1-b
// キーワードの入力を促す
const keyword = prompt('Enter a keyword to filter feed items: ');

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
    // 5章 2-a
    for (let { title, link, pubDate } of items) {
      // title に文字列 ham という部分文字列が含まれていれば
      // 5章 1-c
      if (title.toLowerCase().includes(keyword.toLowerCase())) {
        // feedItems 配列に追加
        // 5章 2-c
        feedItems.push({ title, link, pubDate });
      }
    }
  }
  // feed配列を返す
  return feedItems;
};

// 5章 2-b
// 現在時刻と pubDate の時間差分を返す
const formatAge = (pubDate) => {
  // pubDate が空の場合に早期 return
  // 5章 2-d
  if (!pubDate) return 'Unknown';
  const publishedAt = new Date(pubDate);
  // 無効な日付フォーマットの場合 NaNになる
  // NaN であれば早期に return
  // 5章 2-d
  if (isNaN(publishedAt.getTime())) return 'Unknown';
  //  現在時刻との差分を計算
  const diffMs = Date.now() - publishedAt.getTime();
  // ミリ秒を分に変換
  const diffMinutes = Math.floor(diffMs / 60000);
  // 差分が60分未満の場合は、分単位
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  // 差分が60分以上の場合は、時間単位
  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours} hours ago`;
};

const print = (feedItems) => {
  // 新しいフィード項目のタイトルとリンクを追加するよう促す
  const res = prompt(`Add item: `);
  // 入力文字列を感まで分解し、分割代入する
  const [title, link] = res.split(',');
  // title,link が存在すれば項目オブジェクトを customItems に追加
  if (![title, link].includes(undefined)) customItems.push({ title, link });
  // 標準出力をクリア
  console.clear();
  //
  const displayItems = feedItems.concat(customItems).map((item) => ({
    title: item.title,
    link: item.link,
    Age: formatAge(item.pubDate),
  }));

  // feedItems の内容をテーブル形式で出力
  console.table(feedItems.concat(displayItems));
  // 最終更新日時をUTC系s機で表示
  console.log('Last updated ', new Date().toUTCString());
};

// 2秒ごとに取得する
setInterval(main, 3000);
