import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';
import promptModule from 'prompt-sync';

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

// prompt をインスタンス化し、同期的にプロンプト機能を利用
const prompt = promptModule();
// メモリ内ストレージを表すオブジェクト定義
const mockDB = { passwords: {} };

const saveNewPassword = (password) => {
  // プレーンテキストパスワードをハッシュ化し、データベース内の hash キーにセット
  mockDB.hash = bcrypt.hashSync(password, 10);
  console.log('Main password has been set!');
  showMenu();
};

// プレーンテキストパスワードとハッシュ化パスワードを比較する関数
// 入力されたパスワードとローカルデータベース内の値を比較する
const compareHashedPassword = async (password) => await bcrypt.compare(password, mockDB.hash);

const promptNewPassword = () => {
  // 新しいマスターパスワードを入力するよう促す
  const response = prompt('Enter a main password: ');
  saveNewPassword(response);
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
      showMenu();
    } else {
      // パスワードが正しくない場合は、エラーを表示し再試行する
      console.log('Password incorrect. Try again.');
    }
  }
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
  if (response === '1')
    viewPasswords(); // 1: パスワードの表示
  else if (response === '2')
    promptManageNewPassword(); // // 2: 新しいパスワードの追加
  else if (response === '3')
    promptOldPassword(); // :3: マスターパスワードのバリデーション
  else if (response === '4')
    process.exit(); // 4: アプリの終了
  else {
    // 有効な値が選択されない場合は、再選択を促す
    console.log("That's an invalid response.");
    showMenu();
  }
};

const viewPasswords = () => {
  // mockDBからpasswords を分割代入する
  const { passwords } = mockDB;
  const entries = Object.entries(passwords);
  if (entries.length === 0) {
    console.log('No passwords saved yet.');
  } else {
    // entries: 2次元配列(source, password)
    // forEach: 配列の要素を順次処理
    // データベース内のパスワードを繰り返し出力
    entries.forEach(([key, value], index) => {
      console.log(`${index + 1}: ${key} => ${value}`);
    });
  }
  showMenu();
};

const promptManageNewPassword = () => {
  // 管理したいソース名と新しいパスワードの入力を促す
  const source = prompt('Enter name for password: ');
  const password = prompt('Enter password to save: ');

  // ソースとパスワードのペアをmockDBに保存
  mockDB.passwords[source] = password;
  console.log(`Password for ${source} has been saved!`);
  showMenu();
};

// main関数を呼び出す
// passwordsCollection と authCollection の割当に用いる
if (!mockDB.hash) promptNewPassword();
// ローカルパスワードが保存されていれば、
// マスターパスワードの作成またはバリデーションを行う
else promptOldPassword();
