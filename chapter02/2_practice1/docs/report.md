# ディレクトリ報告：`chapter02/2_practice1`

## 概要
Node.js の「外部パッケージ利用」練習プロジェクト。CLIで対話的に連絡先（氏名・電話番号・メール）を入力し、CSVファイルに追記保存するアプリ。

## 構成ファイル
| ファイル | 役割 |
|---|---|
| `package.json` | ESM (`"type": "module"`)。依存は `csv-writer`（CSV書き出し）、`prompt`（対話入力）。テストスクリプト未設定 |
| `index.js` | エントリポイント。`promptGet()` を呼ぶだけ |
| `promptGet.js` | 本体ロジック（143行） |

## `promptGet.js` の処理内容
1. `./contacts.csv` の存在・非空チェックを行い、存在すれば追記モード（`append`）でCSVライターを作成
2. ヘッダーは `NAME, NUMBER, EMAIL, CREATED_AT`
3. `Person` クラスで連絡先を表現し、生成時に `createdAt` (ISO文字列) を自動付与
4. `promptWithValidation()` で入力を受け取り、電話番号は数字のみ・メールは簡易正規表現でバリデーション。不正なら再入力を促して再帰呼び出し
5. `startApp()` が入力→保存→「続けますか？(y)」の確認を繰り返すループ構造

## Git状況
ブランチ `chapter02`、作業ツリーはクリーン。直近コミットは本ファイル群の準備・整理（P34, P36系）。
