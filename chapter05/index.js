// HTTPリクエストの処理をまとめる非同期関数
const main = async () => {
  // 指定したURLに対してGETリクエストを行う
  const url = 'https://www.bonappetit.com/feed/recipes-rss-feed/rss';
  const response = await fetch(url);
  // レスポンスボディ全体を文字列で読み取り、標準出力する
  console.log(await response.text());
};

main();
