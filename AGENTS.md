# codex / agent.md

このドキュメントは、**codex** による自動生成コードおよび手書きコードに共通するコーディング規約と、生成エージェントへ与えるプロンプト方針を定義する。リポジトリの最上位に `agent.md` として配置し、CI とエディタ拡張で強制／検証する。

---

## 🎯 目的（Purpose）

* 生成コードの品質と一貫性を担保する。
* レビューコストを下げ、修正に強いコードを継続的に得る。
* チーム・ツール・言語間で可能な限り同一のスタイルを維持する。

## 🔭 適用範囲（Scope）

* この規約は、**自動生成（LLM/エージェント）** と **手書き** のソースコードに等しく適用する。
* 対象言語：TypeScript/JavaScript、Dart、C#（必要に応じて他言語へ拡張）。

---

## ✅ 基本方針（Language-agnostic Rules）

1. **文字コードは常に UTF-8** で読み書きする。

   * 入出力ファイル、リポジトリ内の全テキスト、テンプレート、スクリプト。
2. **シングルクォートは禁止**。**すべてダブルクォート**（`"`）を使用する。

   * 例外：言語仕様でダブルクォートを使えない文字列リテラルが存在する場合のみ（基本的に例外は想定しない）。
3. **メンバ変数・メンバメソッドへのアクセスには必ず `this.` を付ける**。

   * 静的メンバは `ClassName.member` を徹底。
4. **豊富なコメント**：

   * **クラス** と **メソッド／関数** には必ず **目的、引数、戻り値、副作用、例外** を明記。
   * アルゴリズムの核心・境界条件・計算量・トレードオフをコメントで補足。
   * 生成コードは**特に詳細なコメント**を付与する（人が即時理解できる粒度）。
5. **命名**：意味が一意に分かる語を使い、省略・略語は避ける（ドメインで一般的な略語は可）。
6. **不変条件・事前条件の明記**：`require` / `assert` 等やガード節、コメントで明示する。
7. **テスト**：公開 API と主要ユースケースには最小限でもユニットテストを付与する。

---

## 🧰 自動整形と静的解析（Tooling）

* 全言語で **ダブルクォートを強制**、**UTF-8**、**末尾改行** を徹底。
* 推奨設定例：

### `.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2

[*.{ts,tsx,js,jsx}]
quote_type = double

[*.dart]
quote_type = double

[*.{cs}]
quote_type = double
```

### TypeScript/JavaScript: ESLint + Prettier

`package.json` 抜粋：

```json
{
  "devDependencies": {
    "eslint": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "prettier": "^3.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0"
  },
  "scripts": {
    "lint": "eslint \"src/**/*.{ts,tsx,js,jsx}\"",
    "format": "prettier --write ."
  }
}
```

`prettier.config.cjs`：

```js
module.exports = {
  singleQuote: false, // ダブルクォート強制
  trailingComma: "all",
  printWidth: 100,
};
```

`.eslintrc.cjs`（抜粋）：

```js
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    quotes: ["error", "double"],
    "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
    "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "explicit" }],
  },
};
```

### Dart: `analysis_options.yaml`

```yaml
include: package:flutter_lints/flutter.yaml
linter:
  rules:
    always_declare_return_types: true
    avoid_print: true
    prefer_double_quotes: true # ダブルクォート推奨（カスタムルール/プラグイン利用可）
    prefer_final_locals: true
    comment_references: true
analyzer:
  language:
    strict-casts: true
    strict-inference: true
```

### C#: `.editorconfig`（Roslyn/StyleCop を併用）

```ini
[*.cs]
csharp_style_var_elsewhere = false:suggestion
csharp_style_var_for_built_in_types = false:suggestion
csharp_style_var_when_type_is_apparent = false:suggestion
dotnet_diagnostic.SA1122.severity = error # Use double quotes
```

---

## 🏷 コメント規約（テンプレート）

### ファイルヘッダ（任意）

```text
// =============================================
// Module: <モジュール名>
// Description: <概要>
// =============================================
```

### クラステンプレート（TS/Dart/C# 共通方針）

```text
/// 目的: <何を表現するか / なぜ存在するか>
/// 主要責務: <責務1, 責務2>
/// 使用例: <簡単な使用例や注意点>
```

### メソッド／関数テンプレート

```text
/// 概要: <このメソッドが何をするか>
/// 引数: <name>: <型> - <意味と制約>
/// 戻り値: <型> - <意味>
/// 例外: <投げ得る例外やエラー条件>
/// 計算量: O(...)
/// 注意: <副作用・スレッド安全性・境界条件など>
```

---

## 📦 言語別ガイド

### TypeScript（例）

```ts
/**
 * クラス: Vector2
 * 目的: 2D ベクトルの表現と基本演算を提供する。
 */
export class Vector2 {
  /** X 座標 */
  private readonly x: number;
  /** Y 座標 */
  private readonly y: number;

  /**
   * 概要: 2D ベクトルを生成する。
   * 引数: x: number - X 成分 / y: number - Y 成分
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * 概要: 現在のベクトルと与えられたベクトルを加算する。
   * 引数: other: Vector2 - 加算相手
   * 戻り値: Vector2 - 新しいベクトル
   */
  public add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }
}
```

### Dart（例）

```dart
/// クラス: Counter
/// 目的: 増加・取得操作を提供する単純なカウンタ。
class Counter {
  /// 内部値（0 以上）
  int _value;

  /// 概要: カウンタを初期化する。
  /// 引数: initial: int - 初期値（省略時 0）
  Counter({int initial = 0}) : _value = initial;

  /// 概要: カウンタを 1 増加させる。
  void increment() {
    this._value += 1;
  }

  /// 概要: 現在値を返す。
  int get value => this._value;
}
```

### C#（例）

```csharp
/// <summary>
/// クラス: StopwatchService
/// 目的: 経過時間計測の開始/停止/取得 API を提供する。
/// </summary>
public sealed class StopwatchService {
    /// 内部ストップウォッチ
    private readonly System.Diagnostics.Stopwatch _sw = new System.Diagnostics.Stopwatch();

    /// <summary>計測を開始する。</summary>
    public void Start() { this._sw.Start(); }

    /// <summary>計測を停止する。</summary>
    public void Stop() { this._sw.Stop(); }

    /// <summary>経過ミリ秒を取得する。</summary>
    public long ElapsedMilliseconds() { return this._sw.ElapsedMilliseconds; }
}
```

> すべての例で **ダブルクォート**、**UTF-8**、**`this.` 明示** を遵守。

---

## 🧪 テスト方針（抜粋）

* **正道ケース**（期待通りになる基本動作）と **境界条件**（空入力、最大値、エラー系）をそれぞれ最低 1 ケースずつ。
* 生成コードには可能な限りテスト雛形も自動出力する。

---

## 🤖 生成エージェントへの指示（Prompt Contract）

* 出力コードは **UTF-8**、**ダブルクォートのみ**、**すべてのメンバアクセスに `this.`** を付与すること。
* **クラスとメソッドに詳細コメント**を必ず付与すること（目的・引数・戻り値・例外・計算量・注意点）。
* 言語ごとのリンタ／フォーマッタに準拠し、必要な設定ファイルの雛形も併せて提案すること。
* 不明点がある場合は仮定を明示した上で安全側に倒した実装を行うこと。

---

## 🔍 コンプライアンスチェック（PR テンプレ）

* [ ] 文字コードは UTF-8 か？
* [ ] すべてダブルクォートか？（JSON/TS/Dart/C# など）
* [ ] メンバアクセスは `this.` を明示しているか？
* [ ] クラスとメソッドに十分なコメントがあるか？
* [ ] 公開 API にテストが付いているか？
* [ ] 自動整形/静的解析でエラーがないか？

---


以上。必要に応じて本書を拡張し、プロジェクト固有の規則（例：API 命名、DTO/Entity 命名、ディレクトリ構成、例外ポリシー）を追記すること。
