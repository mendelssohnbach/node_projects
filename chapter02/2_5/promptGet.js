import { createObjectCsvWriter } from 'csv-writer';
import fs from 'node:fs';
import prompt from 'prompt';

function promptGet() {
  /** @type {string} CSVファイルの保存パス */
  const path = './writeContact.csv';
  /** @type {boolean} ファイルが存在し、かつ空ではないかどうかの判定フラグ */
  // ファイルまたはフォルダが、指定したパスに存在するかをチェック: true/false
  // かつ
  // ファイルのサイズが 0 バイトより大きいかをチェック: true/false
  // statSync: ファイルのメタ情報を取得
  const fileExistsAndNotEmpty = fs.existsSync(path) && fs.statSync(path).size > 0;

  /**
   * CSVファイルを書き出すためのライターオブジェクト
   * @type {{ writeRecords: (records: Array<Record<string, string>>) => Promise<void> }}
   */
  // 名前付きインポートを使って csvWriter から createObjectCsvWriter を取り込む
  const csvWriter = createObjectCsvWriter({
    path,
    append: fileExistsAndNotEmpty, // データの使いを指示
    // ヘッダー情報を csvWriter に設定
    header: [
      { id: 'name', title: 'NAME' },
      { id: 'number', title: 'NUMBER' },
      { id: 'email', title: 'EMAIL' },
    ],
  });

  // prompt初期化
  prompt.start();
  // ターミナルへの余計な接頭辞を抑止
  prompt.message = '';

  /**
   * 連絡先情報を表すクラス
   */
  class Person {
    /**
     * Personのインスタンスを作成します。
     * @param {string} [name=''] - 連絡先の名前
     * @param {string} [number=''] - 連絡先の電話番号
     * @param {string} [email=''] - 連絡先のメールアドレス
     */
    constructor(name = '', number = '', email = '') {
      this.name = name;
      this.number = number;
      this.email = email;
    }

    /**
     * 現在のインスタンスの連絡先情報をCSVファイルに保存します。
     * @returns {Promise<void>}
     */
    async saveToCSV() {
      try {
        const { name, number, email } = this; // Personのインスタンスを構造分解知る
        // csvWriter.writeRecords を使ってデータの行をCSVファイルに書き込む
        await csvWriter.writeRecords([{ name, number, email }]);
        console.log(`${name} Saved!`);
      } catch (err) {
        console.error(err);
      }
    }
  }

  /**
   * アプリケーションを起動し、ユーザーに入力を促すメイン関数です。
   * @returns {Promise<void>}
   */
  // await を使えるように非同期として定義
  const startApp = async () => {
    const questions = [
      // 入力を収集するために質問の配列を作成
      { name: 'name', description: 'Contact Name' },
      { name: 'number', description: 'Contact Number' },
      { name: 'email', description: 'Contact Email' },
    ];

    // 複数のプロンプトに対するユーザー入力を一度に収集
    const responses = await prompt.get(questions);
    // const person = new Person(responses.name, responses.number, responses.email);
    // 文字列テンプレートを用いて string型であることを明示
    // プロンプト名はユーザー入力レスポンスに対応する
    const person = new Person(`${responses.name}`, `${responses.number}`, `${responses.email}`);
    // personの値をCSVファイルに保存
    await person.saveToCSV();

    // ユーザーが続行を希望するか尋ねる
    // ユーザーのレスポンスは again 変数に構造分解される
    const { again } = await prompt.get([
      { name: 'again', description: 'Continue? [y to continue]' },
    ]);
    // if (again.toLowerCase() === 'y') await startApp();
    // 文字列テンプレートを用いて string型であることを明示
    // 続行 y を選択した場合は、 startApp を再規定に呼び出す
    // そうでない場合は、プログラムを終了
    if (`${again}`.toLowerCase() === 'y') await startApp();
  };

  startApp();
}

export { promptGet };
