import { appendFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

/**
 * ユーザー入力を受け付け、連絡先情報をCSVファイルに保存するアプリケーションを起動します。
 *
 * @returns {void}
 */
function readLine() {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  /**
   * コンソールにメッセージを表示し、ユーザーからの入力を非同期で待機します。
   *
   * @param {string} message - コンソールに表示するプロンプトメッセージ
   * @returns {Promise<string>} ユーザーが入力した文字列
   */
  // const readLineAsync = (message) => {
  //   console.log('渡ってきたmessage:', message); // ここで中身を確認できます
  //   return new Promise((resolve) => readline.question(message, resolve));
  // };
  const readLineAsync = (message) => new Promise((resolve) => readline.question(message, resolve));

  /**
   * 連絡先情報を管理するクラス。
   */
  class Person {
    /**
     * Personのインスタンスを生成します。
     *
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
     * 連絡先情報をカンマ区切り（CSV形式）で './contacts.csv' に追記保存します。
     *
     * @returns {void}
     */
    saveToCSV() {
      const content = `${this.name},${this.number},${this.email}\n`;
      try {
        appendFileSync('./contacts.csv', content);
        console.log(`${this.name} Saved`);
      } catch (err) {
        console.error(err);
      }
    }
  }

  /**
   * アプリケーションのメインループを実行する非同期関数。
   *
   * @returns {Promise<void>}
   */
  const startApp = async () => {
    let shouldContinue = true;
    while (shouldContinue) {
      const name = await readLineAsync('Contact Name; ');
      const number = await readLineAsync('Contact Number: ');
      const email = await readLineAsync('Contact Email: ');

      const person = new Person(name, number, email);
      person.saveToCSV();

      const response = await readLineAsync('Continue? [y to continue]: ');
      shouldContinue = response.toLowerCase() === 'y';
    }
    readline.close();
  };
  startApp();
}

export { readLine };
