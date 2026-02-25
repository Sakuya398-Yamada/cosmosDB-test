# セットアップ手順

このドキュメントでは、CosmosDB Emulator + Node.js/TypeScript環境のセットアップ方法を説明します。

## 📋 プラットフォーム別ガイド

お使いの環境に応じて、適切なガイドを参照してください:

### Windows + Rancher Desktop
**[→ Windows + Rancher Desktopセットアップガイド](./rancher-desktop-windows.md)**

Windows環境でRancher Desktopを使用する場合の完全ガイドです。以下の内容が含まれます:
- Rancher Desktopのインストールと設定
- Container Runtimeの設定方法
- WSL2の設定
- プロジェクトのセットアップ手順
- Windows固有のトラブルシューティング

### Linux / macOS / Docker Desktop
このドキュメントで手順を説明します。

---

## 前提条件（Linux / macOS / Docker Desktop）

- **Docker / Docker Desktop**: バージョン 20.10以上
- **Docker Compose V2**: `docker compose`コマンドが使用可能
- **Node.js**: バージョン 18.x以上
- **npm**: バージョン 9.x以上

## クイックスタート（Linux / macOS / Docker Desktop）

### 1. 環境変数の設定

```bash
cp .env.example .env
```

### 2. CosmosDB Emulatorの起動

```bash
docker compose up -d
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. アプリケーションの実行

```bash
# 開発モード
npm run dev

# または本番モード
npm run build && npm start
```

## 詳細情報

### 環境変数

`.env`ファイルには以下の設定が含まれています:

```bash
COSMOS_ENDPOINT=https://localhost:8081
COSMOS_KEY=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
DATABASE_NAME=TestDatabase
CONTAINER_NAME=TestContainer
NODE_TLS_REJECT_UNAUTHORIZED=0
```

**注意**: `NODE_TLS_REJECT_UNAUTHORIZED=0`は開発環境でのみ使用してください。

### Emulatorの起動確認

起動には5〜10分かかる場合があります。以下で確認できます:

```bash
# コンテナの状態
docker compose ps

# ログの確認
docker compose logs -f cosmosdb

# Web UI（ブラウザ）
# https://localhost:8081/_explorer/index.html
```

## よくある問題

### Emulatorが起動しない

```bash
# Dockerの動作確認
docker --version
docker ps

# ポートの確認
lsof -i :8081

# ログの確認
docker compose logs cosmosdb
```

### 評価期間エラー
```bash
# Emulatorを停止
docker compose down

# 古いイメージを削除
docker rmi mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest

# 最新イメージの取得
docker compose up -d
```

### 証明書エラー

`.env`ファイルに`NODE_TLS_REJECT_UNAUTHORIZED=0`が設定されているか確認してください。

### 接続エラー

1. Emulatorが起動しているか確認: `docker compose ps`
2. 起動完了まで待つ（5〜10分）
3. エンドポイントが正しいか確認: `COSMOS_ENDPOINT=https://localhost:8081`

## クリーンアップ

```bash
# Emulatorを停止
docker compose down

# データも削除
docker compose down -v

# ビルド成果物を削除
npm run clean
```

## 次のステップ

- **[コマンドリファレンス](./commands.md)**: 全コマンドの詳細説明
- `src/index.ts`: サンプルコードの実行
- `src/operations.ts`: CRUD操作の実装例

## 関連ドキュメント

- [Windows + Rancher Desktopガイド](./rancher-desktop-windows.md)
- [コマンドリファレンス](./commands.md)
- [README](../README.md)
