import bcrypt from 'bcrypt';
import promptModule from 'prompt-sync';

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
