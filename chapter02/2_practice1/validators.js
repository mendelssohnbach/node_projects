/**
 * メールアドレスの形式を検証する正規表現
 * @type {RegExp}
 */
const emailRegex = /\S+@\S+\.\S+/;

/**
 * 電話番号が数字のみで構成されているかを検証する正規表現
 * @type {RegExp}
 */
const numberRegex = /^\d+$/;

/**
 * 電話番号が数字のみで構成されているかを検証する
 * @param {string} value - 検証対象の電話番号
 * @returns {boolean}
 */
function isValidNumber(value) {
  return numberRegex.test(value);
}

/**
 * メールアドレスの形式を検証する
 * @param {string} value - 検証対象のメールアドレス
 * @returns {boolean}
 */
function isValidEmail(value) {
  return emailRegex.test(value);
}

export { isValidNumber, isValidEmail };
