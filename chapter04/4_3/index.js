import bcrypt from 'bcrypt';
// import { MongoClient } from 'mongodb';
import { MongoClient } from 'mongodb';
// import { Collection, MongoClient } from 'mongodb';
import promptModule from 'prompt-sync';

/**
 * prompt-syncモジュールから対話型プロンプト関数を生成
 * @type {import('prompt-sync').Prompt}
 */
const prompt = promptModule();

const uri = 'mongodb://localhost:27017';
const dbUrl = process.env.MONGO_URL || uri;
const client = new MongoClient(dbUrl);
const dbName = 'passwordManager';

/**
 * メインパスワードが既に登録されているかどうかのフラグ
 * @type {boolean}
 */
let hasPasswords = false;

/**
 * 型定義: 認証情報ドキュメントの構造
 * @typedef {Object} AuthDocument
 * @property {string} type - ドキュメントのタイプ（常に 'auth'）
 * @property {string} hash - ハッシュ化されたメインパスワード
 * @property {number} saltRounds - ハッシュ生成時のソルト・ラウンド数
 */

/**
 * 型定義: パスワード管理ドキュメントの構造
 * @typedef {Object} PasswordDocument
 * @property {string} source - パスワードの保存先（サイト名、サービス名など）
 * @property {string} password - 保存されたパスワード（平文）
 */

/**
 * パスワード保存用のコレクション
 * @type {import('mongodb').Collection<PasswordDocument>}
 */
let passwordsCollection;

/**
 * 認証情報用のコレクション
 * @type {import('mongodb').Collection<AuthDocument>}
 */
let authCollection;

/**
 * データベースへの接続を確立し、初期状態（メインパスワードの有無）を確認する。
 * @async
 * @function main
 * @returns {Promise<void>}
 */
const main = async () => {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    authCollection = db.collection('auth');
    passwordsCollection = db.collection('passwords');
    const hashedPassword = await authCollection.findOne({ type: 'auth' });
    hasPasswords = !!hashedPassword;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

/**
 * 入力された平文パスワードをハッシュ化し、データベースに新規保存する。
 * @async
 * @function saveNewPassword
 * @param {string} password - 新しく設定するメインパスワード（平文）
 * @returns {Promise<void>}
 */
const saveNewPassword = async (password) => {
  const saltRoundsInput = prompt('Enter salt rounds (default: 10): ');
  const saltRounds = parseInt(saltRoundsInput, 10) || 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  await authCollection.insertOne({ type: 'auth', hash, saltRounds });
  console.log(`Password has been saved! (salt rounds: ${saltRounds})`);
  await showMenu();
};

/**
 * 入力されたパスワードと、データベースに保存されているハッシュ化パスワードを照合する。
 * @async
 * @function compareHashedPassword
 * @param {string} password - 検証するパスワード（平文）
 * @returns {Promise<boolean>} 照合結果（一致していれば true）
 * @throws {Error} データベースにハッシュが登録されていない場合
 */
const compareHashedPassword = async (password) => {
  const authDoc = await authCollection.findOne({ type: 'auth' });
  if (!authDoc || !authDoc.hash) {
    throw new Error('No stored hash found.');
  }
  console.log(`Using salt rounds: ${authDoc.saltRounds}`);
  return await bcrypt.compare(password, authDoc.hash);
};

/**
 * 新規のメインパスワード入力を促し、保存処理へ渡す。
 * @async
 * @function promptNewPassword
 * @returns {Promise<void>}
 */
const promptNewPassword = async () => {
  const response = prompt('Enter a main password: ');
  return saveNewPassword(response);
};

/**
 * メインパスワードの入力を促し、正解するまでループ処理で認証を繰り返す。
 * @async
 * @function promptOldPassword
 * @returns {Promise<void>}
 */
const promptOldPassword = async () => {
  let verified = false;
  while (!verified) {
    const response = prompt('Enter your password: ');
    const result = await compareHashedPassword(response);
    if (result) {
      console.log('Password verified.');
      verified = true;
      await showMenu();
    } else {
      console.log('Password incorrect. Try again.');
    }
  }
};

/**
 * 保存されているすべてのパスワード一覧をコンソールに表示する。
 * @async
 * @function viewPasswords
 * @returns {Promise<void>}
 */
const viewPasswords = async () => {
  const passwords = await passwordsCollection.find({}).toArray();
  passwords.forEach(({ source, password }, index) => {
    console.log(`${index + 1}. ${source} => ${password}`);
  });
  await showMenu();
};

/**
 * ソース名（サービス名）を指定して、特定のパスワードを検索・表示する。
 * @async
 * @function findPasswordBySource
 * @returns {Promise<void>}
 */
const findPasswordBySource = async () => {
  const source = prompt('Enter source name to search: ');
  const result = await passwordsCollection.findOne({ source });
  if (result) {
    console.log(`${result.source} => ${result.password}`);
  } else {
    console.log('No password saved for that source.');
  }
  await showMenu();
};

/**
 * ユーザーに操作を選択させるコマンドラインメニューを表示し、各機能へ振り分ける。
 * @async
 * @function showMenu
 * @returns {Promise<void>}
 */
const showMenu = async () => {
  console.log(`
    1. View passwords
    2. Manage new password
    3. Verify password
    4. Exit
    5. Find password by source`);
  const response = prompt('>');
  switch (response) {
    case '1':
      await viewPasswords();
      break;
    case '2':
      await promptManageNewPassword();
      break;
    case '3':
      await promptOldPassword();
      break;
    case '4':
      process.exit();
      break;
    case '5':
      await findPasswordBySource();
      break;
    default:
      console.log("That's an invalid response.");
      await showMenu();
  }
};

/**
 * 新しいパスワード情報（ソース名とパスワード）の入力を促し、データベースに保存（または更新）する。
 * @async
 * @function promptManageNewPassword
 * @returns {Promise<void>}
 */
const promptManageNewPassword = async () => {
  const source = prompt('Enter name for password: ');
  const password = prompt('Enter password to save: ');
  await passwordsCollection.findOneAndUpdate(
    { source },
    { $set: { password } },
    {
      returnDocument: 'after',
      upsert: true,
    },
  );
  console.log(`Password for ${source} has been saved!`);
  await showMenu();
};

// アプリケーションの実行開始
await main();
if (!hasPasswords) promptNewPassword();
else promptOldPassword();
