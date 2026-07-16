import bcrypt from 'bcrypt';

const password = 'test1234';
// 強度10の設定（ストレッチング回数）を使って暗号化
// 毎回違う暗号化結果になるように、内部で自動生成されるランダムなデータで
// 暗号計算を2の10乗回繰り返す
const hash = bcrypt.hashSync(password, 10);
console.log(`My hashed password is: ${hash}`);
