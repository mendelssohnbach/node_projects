import { createObjectCsvWriter } from 'csv-writer';
import fs from 'node:fs';

/**
 * CSVファイルの保存先パス
 * @type {string}
 */
const path = './contacts.csv';

/**
 * CSVファイルが存在し、かつ空ではないかどうか
 * @type {boolean}
 */
const fileExistsAndNotEmpty = fs.existsSync(path) && fs.statSync(path).size > 0;

/**
 * CSVファイルを書き出すためのライターオブジェクト
 *
 * 出力例 // 2章 2-d
 * NAME,NUMBER,EMAIL,CREATED_AT
 * alice,1,alice@example.com,2026-07-12T06:58:54.749Z
 * bob,2,bob@example.com,2026-07-12T06:59:10.746Z
 * candy,3,candy@example.com,2026-07-12T06:59:24.285Z
 *
 * @type {{ writeRecords: (records: Array<Record<string, string>>) => Promise<void> }}
 */
const csvWriter = createObjectCsvWriter({
  path,
  append: fileExistsAndNotEmpty,
  header: [
    { id: 'name', title: 'NAME' },
    { id: 'number', title: 'NUMBER' },
    { id: 'email', title: 'EMAIL' },
    { id: 'createdAt', title: 'CREATED_AT' }, // 2章 2-c
  ],
});

/**
 * 連絡先情報を表すクラス
 */
class Person {
  /**
   * 連絡先インスタンスを生成する
   * @param {string} [name=''] - 連絡先の名前
   * @param {string} [number=''] - 連絡先の電話番号
   * @param {string} [email=''] - 連絡先のメールアドレス
   */
  constructor(name = '', number = '', email = '') {
    this.name = name;
    this.number = number;
    this.email = email;
    this.createdAt = new Date().toISOString(); // 2章 2-a, 2-b
  }

  /**
   * 連絡先データをCSVファイルに非同期で保存する
   * @returns {Promise<void>}
   */
  async saveToCSV() {
    try {
      const { name, number, email, createdAt } = this;
      await csvWriter.writeRecords([{ name, number, email, createdAt }]); // 2章 2-a
      console.log(`${name} Saved!`);
    } catch (err) {
      console.error(err);
    }
  }
}

export { Person };
