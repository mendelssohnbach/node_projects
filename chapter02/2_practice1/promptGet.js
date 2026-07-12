import prompt from 'prompt';
import { isValidNumber, isValidEmail } from './validators.js';
import { Person } from './person.js';

function promptGet() {
  /**
   * 出力例 // 2章 2-d
   * NAME,NUMBER,EMAIL,CREATED_AT
   * alice,1,alice@example.com,2026-07-12T06:58:54.749Z
   * bob,2,bob@example.com,2026-07-12T06:59:10.746Z
   * candy,3,candy@example.com,2026-07-12T06:59:24.285Z
   */

  prompt.start();
  prompt.message = '';

  /**
   * ユーザー入力を受け付け、バリデーションを行う非同期関数。
   *
   * @returns {Promise<{name: string, number: string, email: string}>} 検証済みの入力データオブジェクト
   */
  const promptWithValidation = async () => {
    // prompt.getの結果を特定のオブジェクト型としてキャストする
    const rawResponses = await prompt.get([
      { name: 'name', description: 'Contact Name' },
      { name: 'number', description: 'Contact Number' },
      { name: 'email', description: 'Contact Email' },
    ]);

    /** @type {{name: string, number: string, email: string}} */
    const responses = /** @type {any} */ (rawResponses);

    // 2章 1-b
    if (!isValidNumber(responses.number)) {
      console.error('Error: Phone number should contain only digits.'); // 2章 1-c
      return promptWithValidation(); // 2章 1-d
    }

    // 2章 1-b
    if (!isValidEmail(responses.email)) {
      console.error('Error: Invalid email format.'); // 2章 1-c
      return promptWithValidation(); // 2章 1-d
    }

    return responses;
  };

  /**
   * アプリケーションのエントリーポイントとなるメイン関数。
   *
   * @returns {Promise<void>}
   */
  const startApp = async () => {
    const responses = await promptWithValidation(); // 2章 1-a
    const person = new Person(responses.name, responses.number, responses.email);
    await person.saveToCSV();

    const { again } = await prompt.get([
      { name: 'again', description: 'Continue? [y to continue]' },
    ]);

    // prompt.getの結果から安全に文字列として比較するために文字列キャスト、または存在チェックを行う
    if (again && String(again).toLowerCase() === 'y') {
      await startApp();
    }
  };

  startApp();
}

export { promptGet };
