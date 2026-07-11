import { createObjectCsvWriter } from 'csv-writer';
import fs from 'node:fs';
import prompt from 'prompt';

function promptGet() {
  /** @type {string} CSVファイルの保存パス */
  const path = './writeContact.csv';
  /** @type {boolean} ファイルが存在し、かつ空ではないかどうかの判定フラグ */
  const fileExistsAndNotEmpty = fs.existsSync(path) && fs.statSync(path).size > 0;

  /**
   * CSVファイルを書き出すためのライターオブジェクト
   * @type {{ writeRecords: (records: Array<Record<string, string>>) => Promise<void> }}
   */
  const csvWriter = createObjectCsvWriter({
    path,
    append: fileExistsAndNotEmpty,
    header: [
      { id: 'name', title: 'NAME' },
      { id: 'number', title: 'NUMBER' },
      { id: 'email', title: 'EMAIL' },
    ],
  });

  prompt.start();
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
        const { name, number, email } = this;
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
  const startApp = async () => {
    const questions = [
      { name: 'name', description: 'Contact Name' },
      { name: 'number', description: 'Contact Number' },
      { name: 'email', description: 'Contact Email' },
    ];

    const responses = await prompt.get(questions);
    // const person = new Person(responses.name, responses.number, responses.email);
    // 文字列テンプレートを用いて string型であることを明示
    const person = new Person(`${responses.name}`, `${responses.number}`, `${responses.email}`);
    await person.saveToCSV();

    const { again } = await prompt.get([
      { name: 'again', description: 'Continue? [y to continue]' },
    ]);
    // if (again.toLowerCase() === 'y') await startApp();
    // 文字列テンプレートを用いて string型であることを明示
    if (`${again}`.toLowerCase() === 'y') await startApp();
  };

  startApp();
}

export { promptGet };
