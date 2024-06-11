# 使用した技術スタック

## フロントエンド
- フロントエンドフレームワーク: EJS (Embedded JavaScript)
- フロントエンド言語: HTML, CSS, JavaScript

## バックエンド
- バックエンドフレームワーク: Node.js, Express
- バックエンド言語: JavaScript (Node.js)
- ミドルウェア: Method-Override,url-encoded

## インフラ
- データベース: MongoDB
- データベースツール: Mongosh (MongoDB Shell)

## プロジェクトの概要
- プロジェクト名:yelpcamp

## 必要な環境変数やコマンド一覧
```
npm install
node ./seeds/index.js
node app.js
```
localhost:3000に接続する
## ディレクトリ構成
.  
├── README.md  
├── app.js  
├── models/  
│   └── campground.js  
├── package-lock.json  
├── package.json  
├── seeds/  
│   ├── cities.js  
│   ├── index.js  
│   └── seedHelpers.js  
└── views/  
    ├── campgrounds/  
    │   ├── edit.ejs  
    │   ├── index.ejs  
    │   ├── new.ejs  
    │   └── show.ejs  
    └── home.ejs  
## 開発環境の構築方法
- Node.js@14
- MongoDB Community Server@7.x  
[windowsのインストールはこちら](https://www.mongodb.com/try/download/community/)  
macでのインストール  
[macではこちらを参照してください](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x-tarball/)
## トラブルシューティング

## DB seeds入れ方
```
$ mongosh
$ npm run seed:db
```

