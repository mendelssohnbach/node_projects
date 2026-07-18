import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';
import promptModule from 'prompt-sync';

const prompt = promptModule();

// dbUrl: ローカルのMongoDBサーバーに接続するための定義
// 環境変数 MONGO_URL があればこれを優先する
const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
// 接続URLを使って Mongoクライアントのインスタンス作成
const client = new MongoClient(dbUrl);
// データベース名 passwordManager に設定
const dbName = 'passwordManager';

// マスターパスワードが祖運剤するかを追跡するためのフラグを宣言
let hasPasswords = false;
let passwordsCollection, authCollection;

// データベースを初期化するための amin 関数
const main = async () => {
  try {
    await client.connect(); // client.collection でデータベースとの接続を確立
    console.log('Connected successfully to server');
    // dbName = passwordManager という名前のデータベースを作成するか
    // または、その名前のデータベースに接続する
    const db = client.db(dbName);
    // auth コレクションを扱う変数を宣言
    authCollection = db.collection('auth');
    // passwords コレクションを扱う変数を宣言
    passwordsCollection = db.collection('passwords');
    // type が auth である、ハッシュ化パスワードが
    // authCollection 内に存在するか確認
    const hashedPassword = await authCollection.findOne({ type: 'auth' });
    // データベース検索閣下のブール値を hasPasswords に代入
    hasPasswords = !!hashedPassword;
  } catch (error) {
    // データベース接続に問題があれば、エラーを出力
    console.error('Error connecting to the database:', error);
    // プロセスを終了する
    process.exit(1);
  }
};

const saveNewPassword = async (password) => {
  // プレーンテキストパスワードをハッシュ化
  const hash = bcrypt.hashSync(password, 10);
  // ハッシュ化後パスワードをデータベースに保存
  //  登録保存されるデータは1件のみに制限
  await authCollection.insertOne({ type: 'auth', hash });
  // パスワードが保存されたことを標準出力
  console.log('Password has been saved!');
  await showMenu();
};

// プレーンテキストパスワードとハッシュ化パスワードを比較する関数
// 入力されたパスワードとローカルデータベース内の値を比較する
const compareHashedPassword = async (password) => {
  // authCollection内からハッシュ化パスワードを検索し、
  // 変数 hash 分割代入する
  const { hash } = await authCollection.findOne({ type: 'auth' });
  if (!hash) {
    throw new Error('No stored hash found.');
  }
  // プレーンテキストパスワードとハッシュ化パスワードを検証する
  return await bcrypt.compare(password, hash);
};

const promptNewPassword = async () => {
  // 新しいマスターパスワードを入力するよう促す
  const response = prompt('Enter a main password: ');
  return saveNewPassword(response);
};

const promptOldPassword = async () => {
  // パスワーdがバリデーションされたかを追跡するフラグを定義
  let verified = false;
  while (!verified) {
    // 既存のマスターパスワードを再入力するよう促す
    const response = prompt('Enter your password: ');
    // 入力パスワードを保存済ハッシュ化パスワードと比較
    const result = await compareHashedPassword(response);
    if (result) {
      console.log('Password verified.');
      // パスワードがバリデーションされたらバリデーションフラグを true に設定
      verified = true;
      // メニューを表示
      await showMenu();
    } else {
      // パスワードが正しくない場合は、エラーを表示し再試行する
      console.log('Password incorrect. Try again.');
    }
  }
};

const viewPasswords = async () => {
  // passwordsCollection から全てのパスワードを取得
  // find({}) : 条件なしで全列全行検索
  // toArray で配列に変換
  const passwords = await passwordsCollection.find({}).toArray();
  // 配列をループ処理
  passwords.forEach(({ source, password }, index) => {
    console.log(`${index + 1}. ${source} => ${password}`);
  });
  await showMenu();
};

const showMenu = async () => {
  // 4つの選択肢を表示
  console.log(`
    1. View passwords
    2. Manage new password
    3. Verify password
    4. Exit`);
  const response = prompt('>');

  // 1-4の値を選択すると
  switch (response) {
    case '1': // 1: パスワードの表示
      await viewPasswords();
      break;
    case '2': // 2: 新しいパスワードの追加
      await promptManageNewPassword();
      break;
    case '3': // :3: マスターパスワードのバリデーション
      await promptOldPassword();
      break;
    case '4': // 4: アプリの終了
      process.exit();
      break;
    default: // 有効な値が選択されない場合は、再選択を促す
      console.log("That's an invalid response.");
      await showMenu();
  }
};

const promptManageNewPassword = async () => {
  // 管理したいソース名と新しいパスワードの入力を促す
  const source = prompt('Enter name for password: ');
  const password = prompt('Enter password to save: ');
  // パスワードエントリーが存在しない場合は、新しいパスワードエントリーを追加し、
  // 古い値が存在している場合には上書き更新
  await passwordsCollection.findOneAndUpdate(
    { source },
    { $set: { password } },
    {
      returnDocument: 'after', // 更新後のドキュメントを返す
      upsert: true, // 一致するドキュメントがない場合に審査機作成
    },
  );
  console.log(`Password for ${source} has been saved!`);
  await showMenu();
};

await main();
// main関数を呼び出す
// passwordsCollection と authCollection の割当に用いる
if (!hasPasswords) promptNewPassword();
// ローカルパスワードが保存されていれば、
// マスターパスワードの作成またはバリデーションを行う
else promptOldPassword();
