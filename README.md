# CosmosDB Emulator + TypeScript プロジェクト

このプロジェクトは、ローカル環境でAzure CosmosDB Emulatorを使用し、Node.js/TypeScriptでCRUD操作を実行するデモンストレーションです。

## 📌 Windowsユーザーの方へ

**Windows + Rancher Desktopを使用される場合:**
- **[Windows + Rancher Desktopセットアップガイド](docs/rancher-desktop-windows.md)** を参照してください
- Container Runtimeを`dockerd (moby)`に設定する必要があります
- 詳細な手順とトラブルシューティングが記載されています

---

## 概要

- **CosmosDB Emulator**: DockerまたはRancher Desktopでローカルに実行
- **TypeScript**: 型安全なコードでCosmosDB操作を実装
- **CRUD操作**: データの作成、取得、更新、削除をサポート
- **クロスプラットフォーム**: Linux、macOS、Windowsで動作

## 機能

- データベース・コンテナの自動作成
- アイテムの作成（CREATE）
- アイテムの取得（READ）
- アイテムの更新（UPDATE）
- アイテムの削除（DELETE）
- クエリによる検索
- 全アイテムの取得

## クイックスタート

### Linux / macOS / Docker Desktop

```bash
# 1. 環境変数の設定
cp .env.example .env

# 2. CosmosDB Emulatorの起動
docker compose up -d

# 3. 依存関係のインストール
npm install

# 4. アプリケーションの実行
npm run dev
```

### Windows (Rancher Desktop / PowerShell)

```powershell
# 1. 環境変数の設定
Copy-Item .env.example .env

# 2. CosmosDB Emulatorの起動
docker compose up -d

# 3. 依存関係のインストール
npm install

# 4. アプリケーションの実行
npm run dev
```

**注意:**
- Rancher Desktopの場合、Container Runtimeを`dockerd (moby)`に設定してください
- 初回起動時はイメージのダウンロードに時間がかかります（5〜10分）
- 詳細は[Windows + Rancher Desktopセットアップガイド](docs/rancher-desktop-windows.md)を参照

## プロジェクト構造

```
.
├── docker-compose.yml              # CosmosDB Emulator設定
├── package.json                    # Node.js依存関係
├── tsconfig.json                   # TypeScript設定
├── .env                            # 環境変数（Git管理外）
├── .env.example                    # 環境変数のテンプレート
├── src/
│   ├── cosmosClient.ts             # CosmosDB接続クライアント
│   ├── operations.ts               # CRUD操作の実装
│   └── index.ts                    # メインスクリプト（デモ）
└── docs/
    ├── setup.md                    # 詳細セットアップ手順
    ├── commands.md                 # コマンドリファレンス
    └── rancher-desktop-windows.md  # Windows + Rancher Desktopガイド
```

## ドキュメント

より詳細な情報は、以下のドキュメントを参照してください:

- **[セットアップガイド](docs/setup.md)**: 環境構築の詳細手順とトラブルシューティング（Linux/macOS/Docker Desktop）
- **[Windows + Rancher Desktopガイド](docs/rancher-desktop-windows.md)**: Windows環境でのRancher Desktopセットアップと使用方法
- **[コマンドリファレンス](docs/commands.md)**: すべてのコマンドの説明と使用例（Windows対応）

## 利用可能なコマンド

| コマンド | 説明 |
|----------|------|
| `npm install` | 依存関係をインストール |
| `npm run build` | TypeScriptをビルド |
| `npm start` | ビルド済みコードを実行 |
| `npm run dev` | TypeScriptを直接実行（開発モード） |
| `npm run clean` | ビルド成果物を削除 |

詳細は[コマンドリファレンス](docs/commands.md)を参照してください。

## CosmosDB Emulatorへのアクセス

CosmosDB EmulatorのWeb UIには以下のURLでアクセスできます:

```
https://localhost:8081/_explorer/index.html
```

**注意**: 自己署名証明書の警告が表示されますが、これは正常な動作です。

## 技術スタック

- **Azure CosmosDB Emulator**: ローカル開発用のCosmosDBエミュレータ
- **TypeScript**: 型安全な開発環境
- **@azure/cosmos**: Azure CosmosDB SDK for Node.js
- **dotenv**: 環境変数管理
- **Docker / Rancher Desktop**: コンテナ化

## 環境要件

### Linux / macOS
- Docker または Docker Desktop: 20.10以上
- Node.js: 18.x以上
- npm: 9.x以上

### Windows
- **Rancher Desktop**: 1.9.0以上（推奨）
  - Container Runtime: `dockerd (moby)`
- または **Docker Desktop for Windows**
- **WSL2**: Windows 10 バージョン2004以上、またはWindows 11
- **Node.js for Windows**: 18.x以上
- **npm**: 9.x以上

詳細は[Windows + Rancher Desktopガイド](docs/rancher-desktop-windows.md)を参照してください。

## サンプルコード

### アイテムの作成

```typescript
import { createItem } from './operations';

const item = {
  id: 'item-001',
  name: '商品A',
  price: 1000,
};

await createItem(item);
```

### アイテムの取得

```typescript
import { readItem } from './operations';

const item = await readItem('item-001');
console.log(item);
```

### クエリによる検索

```typescript
import { queryItems } from './operations';

const items = await queryItems(
  'SELECT * FROM c WHERE c.price > 1000'
);
```

## トラブルシューティング

問題が発生した場合は、以下のドキュメントを参照してください:

- **Linux/macOS/Docker Desktop**: [セットアップガイド](docs/setup.md)のトラブルシューティングセクション
- **Windows + Rancher Desktop**: [Windows + Rancher Desktopガイド](docs/rancher-desktop-windows.md)のトラブルシューティングセクション

よくある問題:
- CosmosDB Emulatorが起動しない
- 証明書エラー
- 接続エラー
- npm installが失敗する
- Windowsでのポート競合
- Rancher DesktopのContainer Runtime設定

## ライセンス

MIT

## 参考リンク

- [Azure CosmosDB Documentation](https://docs.microsoft.com/azure/cosmos-db/)
- [CosmosDB Emulator](https://docs.microsoft.com/azure/cosmos-db/local-emulator)
- [@azure/cosmos SDK](https://www.npmjs.com/package/@azure/cosmos)
- [Rancher Desktop](https://rancherdesktop.io/) - Docker Desktopの代替（Windows/macOS/Linux対応）
- [Docker Documentation](https://docs.docker.com/)
