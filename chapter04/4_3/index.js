import bcrypt from 'bcrypt';
import promptModule from 'prompt-sync';

// prompt をインスタンス化し、同期的にプロンプト機能を利用
const prompt = promptModule();
// メモリ内ストレージを表すオブジェクト定義
const mockDB = { passwords: {} };

const saveNewPassword = (password) => {
  // プレーンテキストをハッシュ化し、データベース内の hash キーにセット
  mockDB.hash = bcrypt.hashSync(password, 10);
  console.log('Main password has been set!');
  showMenu();
};
