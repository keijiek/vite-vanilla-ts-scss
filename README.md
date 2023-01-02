# Vite + TypeScript + SCSS の開発環境

## clone の仕方

git clone すると、通常は、カレントディレクトリにリポジトリ名と同じ名前のディレクトリができ、そこに clone されるが、  
git clone の4つ目の引数に任意のディレクトリ目を書けば、そのディレクトリに内容が clone される。  
例えば下記のようにすれば、`vite-vanilla-ts-scss`ディレクトリではなく、`hogehoge`ディレクトリが作られる。

```sh
git clone git@github.com:keijiek/vite-vanilla-ts-scss.git hogehoge
```

## 目的

- TS & SCSS (& Bootstrap) を用いたウェブサイト制作のための開発環境を Vite で作ること。
  - TypeScript と SCSS を、トランスパイル & バンドル & ミニファイできるようにすること。
  - 複数の html ファイルから成るウェブサイトを作れる開発環境であること。
    - デフォルトでは html のミニファイは行われないようになっている。html をミニファイするプラグインはあるらしい。

## 前提, 始める前(=プロジェクトを作る前)に準備しておくこと

- Node.js 導入済み
  - バージョン管理ツールで使いたいバージョンに合わせておくこと
- git 導入済み
  - GIthubなどに空のリモートリポジトリも作っておくと尚良し

## 参考ウェブサイト

- [Vite公式・日本語版](https://ja.vitejs.dev/)
- [Viteで始めるモダンで高速な開発環境構築](https://ics.media/entry/210708/)

## vite の利点だと感じた事

- `TS + SCSS` のトランスパイル & バンドル & ミニファイ程度が目的なら vite の方がいろいろ軽量。必須モジュールは明らかに少ない(ほぼ1/3以下だ)し、vite.config.js の行数も短い。簡単な機能がデフォルトで備わっているおかげだと思う。
- エントリーポイントが、ts/js ファイルではなく html ファイルだという点はウェブ制作的には分かりやすい。webpack は、デフォルトでは dist に html を配置することになっているが、その設定で使う事はあり得ないので、ts/js 起点で html を巻き込む設定を追加することがほぼ必須だが、vite はその必要がない。ただ、デフォルトでは、プロジェクトルートに index.html が存在し、そこが root 扱いなので、みんな src ディレクトリ等に html を置きたいだろうから、そのへんの設定を書き換える必要はある。とはいえ、webpack より書くことは少ない。その設定の為に必要なモジュールも glob のみ。
- 対話型のインストーラで、各種フレームワークに対応した簡易な開発環境を、テスト用ファイル込みでインストールできるので、それをいじくりまわしながら自分用の開発環境構築を試行錯誤しやすい。

---

## Vite 導入

### いつ、どこで、vite をインストールするか

- いつ： プロジェクト・ディレクトリを作る前
- どこで： プロジェクト・ディレクトリ(予定)の親ディレクトリ

---

### vite project 作成開始

```bash
npm create vite@latest
```

コマンド実行後の対話・選択で、プロジェクト名(=ディレクトリ名)と、設定テンプレートを選択する。  
ここでは、`vanilla` => `TypeScript` を選択。  
その後、次を実行。

### vite project の install と開発サーバー起動

```bash
cd 上記で作ったディレクトリ
npm install
npm run dev
```

`tsconfig.json`, `package.json`, などが作成され、最低限の必要なモジュールもインストールされる。

---

## *.code-workspace

### 空の code-workspace ファイルを作成

```bash
touch $(basename $PWD).code-workspace
```

### 次の json をコピペ

```json
{
	"folders": [
		{
			"path": "."
		}
	],
	"settings": {
		"editor.tabSize": 2,
		"editor.insertSpaces": true,
		"files.exclude": {
			"**/node_modules": true,
			"**/package-lock.json": true,
			"**/vite-env.d.ts": true,
			"**/.gitignore": true,
			"**/.nvmrc": true,
			"**/dist": false,
		},
	},
	"extensions": {
		"recommendations": []
	}
}
```
---

## package.json の編集

### browserslist 設定を package.json に追加

```json
{
  "browserslist": [
    "defaults and supports es6-module", 
    "maintained node versions"
  ],
}
```

- この環境では autoprefixer が参照する。
  - typescript の対応ブラウザを指定する場合は、tsconfig.json の target 設定を編集する

#### browserslist を shell で確認

```sh
npx browserslist
```

---

## tree 構造を作る

デフォルトのディレクトリ構造ではなく、次のような構造を目指す

```sh
tree -I node_modules -I dist
.
├── public
│   └── vite.svg
├── src
│   ├── images
│   │   └── typescript.svg
│   ├── scss
│   │   ├── common
│   │   │   └── _base.scss
│   │   └── style.scss
│   ├── ts
│   │   ├── common
│   │   │   └── counter.ts
│   │   └── main.ts
│   ├── index.html
│   ├── second.html
│   ├── third.html
│   └── vite-env.d.ts
├── README.md
├── package-lock.json
├── package.json
├── tsconfig.json
├── *.code-workspace
└── vite.config.js
```

---

## 必須モジュールインストール(npm install --save-dev)

```bash
npm i -D sass autoprefixer glob
```

- sss : scss を使うのに必要
- autoprefixer : ベンダープレフィクスを自動付加
- glob : vite.config.js で複数の html をエントリーポイントに指定する時に使う

---

## vite.config.js の編集

### 設定項目の解説

- [Vite の設定](https://ja.vitejs.dev/config/)
- [Rollup Options の設定](https://rollupjs.org/guide/en/#big-list-of-options)

### 例
```js
import { defineConfig } from 'vite';
import autoprefixer from "autoprefixer";
import path from "path";
import glob from "glob";
import { fileURLToPath } from "node:url";

const rootValue = path.resolve(__dirname, 'src');
const publicDirValue = path.resolve(__dirname, 'public');
const outDirValue = path.resolve(__dirname, 'dist');

export default defineConfig({

  root: rootValue,        // 規定値はプロジェクトルート。エントリーポイントの index.html と同じ場所にしなければならない。
  base: './',           // 規定値は'/'。相対パスの先頭の文字となる。build 後の依存関係がおかしくなるので、'./'とする。
  publicDir: publicDirValue, // 規定値は root 起点の相対パスとしての'public'。root が変更になっているので、絶対パスとして public dir を指定しなおしている。
  css: {
    // scss と autoprefixer を使うための設定。css>postcss>plugins=[autoprefixer]。ICS では postcss を抜いて css>plugins=[autoprefixer] と解説されている。
    // どっちでも機能はしているようだが、公式サイトの解説に従うなら、やはり前者となる。
    postcss: {
      plugins: [autoprefixer],
    },
    // plugins: [autoprefixer],
  },
  // ビルド用設定群
  build: {
    outDir: outDirValue, // 規定値は root からの相対パスとしての'dist'。root が変更されているので絶対パスとして dist dir を指定しなおしている。
    emptyOutDir: true,  // true なら build 時に outDir の中身を削除。outDir が root 内にあると自動で true 扱いだが、root が変更され outDir が root 外にあるので、明示的に true とする。
    // RollupOptions は、rollup.js の機能を使うための設定なので、設定項目の解説は上記の別ページを参照せよ。
    rollupOptions: {
      // 複数の html ファイルをエントリーポイントとする input 設定。src に追加した html が自動でエントリーポイントとなる。
      input: Object.fromEntries(
        glob.sync(path.resolve(rootValue, "*.html")).map(file => [
          path.relative(rootValue, file.slice(0, file.length - path.extname(file).length)),
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      // input 設定オブジェクトを手書きする場合の例。glob を使う上記のコードは、次の様な設定オブジェクトを自動生成するためのもの。
      // input: {
      //  index: path.resolve rootValue, "index.html"),
      //  second: path.resolve rootValue, "second.html"),
      // },
      output: {
      },
    },
  },
  resolve: {
    alias: {
      // bootstrap 用のエイリアス. pathを書く時、`~bootstrap/scss/*`のように書く
      // '~bootstrap': path.resolve(__dirname,'node_modules/bootstrap'),
    }
  },
  plugins:[]
});
```

---

## Bootstrap を使う場合の追加作業

### 参考サイト

- [Bootstrap5設置ガイド>導入>Viteでの使用](https://bootstrap-guide.com/getting-started/vite)

### npm で必要なモジュールをインストール(npm install --save)

```bash
npm i -S bootstrap @popperjs/core
```

### vite.config.js に alias を記述

上記の vite.config.js 例文では、同じ箇所をコメントインすればよい。

```js
export default defineConfig({
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname,'node_modules/bootstrap'),
    }
  }
})
```

### bootstrap インポート方法

#### scss に記述
```scss
// BootstrapのCSSをすべてインポート
@import "~bootstrap/scss/bootstrap";
```

#### ts に記述
```ts
// カスタムCSSをインポート
import '../scss/styles.scss'

// BootstrapのJSをすべてインポート
import * as bootstrap from 'bootstrap'
```

---

## package.json

ここまででこうなっているはず。name などの不要な行は削除した状態で。

```json
{
  "private": true,
  "browserslist": [
    "defaults and supports es6-module",
    "maintained node versions"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@types/node": "^18.11.18",
    "autoprefixer": "^10.4.13",
    "glob": "^8.0.3",
    "sass": "^1.57.1",
    "typescript": "^4.9.3",
    "vite": "^4.0.0"
  },
  "dependencies": {
    "@popperjs/core": "^2.11.6",
    "bootstrap": "^5.2.3"
  }
}

```