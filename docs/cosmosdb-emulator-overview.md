# CosmosDB Emulator の動作概要

このドキュメントでは、本プロジェクトで使用している CosmosDB Emulator の仕組みと動作について説明します。

## 📋 概要

Azure CosmosDB Emulator は、ローカル開発環境で Azure CosmosDB を模倣するツールです。クラウド環境を使用せず、無料でローカルマシン上で開発・テストが可能です。

## 🐳 Docker Compose による起動

### docker-compose.yml の構成

```yaml
services:
  cosmosdb:
    container_name: cosmosdb-emulator
    image: mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest
    ports:
      - "8081:8081"     # Data Explorer UI とエンドポイント
      - "10251:10251"   # MongoDB API
      - "10252:10252"   # Gremlin API
      - "10253:10253"   # Cassandra API
      - "10254:10254"   # Table API
```

### 環境変数の設定

| 環境変数 | 説明 |
|---------|------|
| `AZURE_COSMOS_EMULATOR_PARTITION_COUNT=10` | パーティション数の設定（デフォルトより多く設定） |
| `AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE=false` | データ永続化を無効化（コンテナ再起動でデータリセット） |
| `AZURE_COSMOS_EMULATOR_IP_ADDRESS_OVERRIDE=127.0.0.1` | IPアドレスを localhost に固定 |

## 🔌 接続の仕組み

### 1. エンドポイントとキー

CosmosDB Emulator は固定のエンドポイントとキーを使用します：

```bash
COSMOS_ENDPOINT=https://localhost:8081
COSMOS_KEY=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
```

**注意**: このキーは Emulator 専用の既知の値であり、本番環境では絶対に使用しないでください。

### 2. SSL証明書の検証

Emulator は自己署名証明書を使用するため、Node.js で接続する際は証明書の検証を無効化する必要があります：

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
```

**警告**: 本番環境ではこの設定は使用しないでください。

### 3. TypeScript/Node.js からの接続

```typescript
import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
});
```

## 📂 データの階層構造

CosmosDB は以下の階層でデータを管理します：

```
CosmosClient
  └── Database (データベース)
        └── Container (コンテナ/コレクション)
              └── Items (ドキュメント/アイテム)
```

### 初期化プロセス

1. **データベースの作成/取得**
   ```typescript
   const { database } = await client.databases.createIfNotExists({
     id: 'TestDatabase'
   });
   ```

2. **コンテナの作成/取得**
   ```typescript
   const { container } = await database.containers.createIfNotExists({
     id: 'TestContainer',
     partitionKey: { paths: ['/id'] }
   });
   ```

### パーティションキー

このプロジェクトでは `/id` をパーティションキーとして使用しています。パーティションキーは：
- データの分散方法を決定
- クエリのパフォーマンスに影響
- 作成後は変更不可

## 🔄 CRUD 操作の流れ

### CREATE（作成）
```typescript
await container.items.create(item);
```
- 新しいアイテムを作成
- `id` が重複するとエラー

### READ（取得）
```typescript
await container.item(id, partitionKeyValue).read();
```
- ID とパーティションキーで1件取得
- 404 エラーでアイテムが存在しないことを検知

### UPDATE（更新）
```typescript
await container.item(id, partitionKeyValue).replace(updatedItem);
```
- 既存アイテムを完全に置き換え
- 部分更新には既存データの取得が必要

### DELETE（削除）
```typescript
await container.item(id, partitionKeyValue).delete();
```
- ID とパーティションキーでアイテムを削除

### QUERY（クエリ）
```typescript
await container.items.query('SELECT * FROM c WHERE c.category = "electronics"').fetchAll();
```
- SQL ライクな構文でクエリ実行
- 複雑な条件検索が可能

## 🌐 Data Explorer

エミュレータが起動している間、ブラウザで以下の URL にアクセスすると、Web UI でデータを確認・操作できます：

```
https://localhost:8081/_explorer/index.html
```

**注意**: 自己署名証明書の警告が表示されますが、開発環境なので安全に無視できます。

## 🚀 起動と終了

### 起動
```bash
docker-compose up -d
```

### 停止
```bash
docker-compose down
```

### データの削除
```bash
docker-compose down -v  # ボリュームも削除
```

データ永続化を無効にしているため、コンテナを停止すると自動的にデータは削除されます。

## 📊 動作確認

TypeScript アプリケーションを実行してCRUD操作をテスト：

```bash
npm run dev
```

このコマンドで以下の操作が実行されます：
1. データベースとコンテナの初期化
2. サンプルアイテムの作成
3. アイテムの読み取り
4. アイテムの更新
5. クエリによる検索
6. アイテムの削除

## ⚠️ 本番環境との違い

| 項目 | Emulator | 本番 Azure CosmosDB |
|-----|----------|-------------------|
| コスト | 無料 | 従量課金 |
| データ永続化 | オプション（デフォルト無効） | 永続的 |
| スケーラビリティ | 制限あり | グローバル分散可能 |
| SSL証明書 | 自己署名 | 正規の証明書 |
| 接続キー | 固定の既知キー | 固有の秘密キー |
| パフォーマンス | ローカルマシンに依存 | 高可用性 |

## 📚 参考情報

- [Azure CosmosDB Emulator 公式ドキュメント](https://learn.microsoft.com/ja-jp/azure/cosmos-db/local-emulator)
- [@azure/cosmos SDK リファレンス](https://learn.microsoft.com/ja-jp/javascript/api/@azure/cosmos/)
