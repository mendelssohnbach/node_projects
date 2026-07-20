import Parser from 'rss-parser';

// Parser クラスをインスタンス化
const parser = new Parser();

// HTTPリクエストの処理をまとめる非同期関数
const main = async () => {
  // 指定したURLに対してGETリクエストを行う
  const url = 'https://www.bonappetit.com/feed/recipes-rss-feed/rss';
  // RSSフィードのCMLを取得解析し、 title と items に分割代入
  const { title, items } = await parser.parseURL(url);
  console.log(title); // フィードのタイトルを表示
  // 項目毎の title,link を抽出
  const results = items.map(({ title, link }) => ({ title, link }));
  // テーブル形式で出力
  console.table(results);
};

main();
