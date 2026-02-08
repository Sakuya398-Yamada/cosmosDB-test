# コマンドリファレンス

このドキュメントは、プロジェクトで使用する全コマンドのリファレンスです。

## 📌 表記について

- コマンド例は主にLinux/macOS/Docker Desktop環境で記載
- Windows固有の違いがある場合は別途記載
- Docker Compose V2（`docker compose`）を使用

---

## Docker Compose コマンド

### docker compose up

コンテナを起動します。

**構文:**
```bash
docker compose up [OPTIONS]
```

**主要オプション:**
- `-d`, `--detach`: バックグラウンドで実行
- `--build`: イメージを再ビルドしてから起動
- `--force-recreate`: コンテナを強制的に再作成

**使用例:**
```bash
# バックグラウンドで起動
docker compose up -d

# ビルドしてから起動
docker compose up -d --build

# 強制的に再作成
docker compose up -d --force-recreate
```

---

### docker compose down

コンテナを停止して削除します。

**構文:**
```bash
docker compose down [OPTIONS]
```

**主要オプション:**
- `-v`, `--volumes`: ボリュームも削除
- `--remove-orphans`: 孤立したコンテナも削除
- `--rmi all`: 使用したイメージも削除

**使用例:**
```bash
# 通常の停止
docker compose down

# ボリュームも削除
docker compose down -v

# イメージも削除
docker compose down --rmi all
```

---

### docker compose ps

コンテナの状態を表示します。

**構文:**
```bash
docker compose ps [OPTIONS]
```

**使用例:**
```bash
# 全コンテナの状態
docker compose ps

# 特定のサービスのみ
docker compose ps cosmosdb
```

**出力例:**
```
NAME                 IMAGE                                                    STATUS
cosmosdb-emulator    mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator   Up 5 minutes
```

---

### docker compose logs

コンテナのログを表示します。

**構文:**
```bash
docker compose logs [OPTIONS] [SERVICE]
```

**主要オプション:**
- `-f`, `--follow`: リアルタイムで追跡
- `--tail N`: 最新N行のみ表示
- `-t`, `--timestamps`: タイムスタンプを表示

**使用例:**
```bash
# 全ログを表示
docker compose logs cosmosdb

# 最新100行のみ
docker compose logs --tail 100 cosmosdb

# リアルタイム追跡
docker compose logs -f cosmosdb

# タイムスタンプ付き
docker compose logs -f -t cosmosdb
```

---

### docker compose restart

コンテナを再起動します。

**構文:**
```bash
docker compose restart [SERVICE]
```

**使用例:**
```bash
# 全サービスを再起動
docker compose restart

# 特定のサービスのみ
docker compose restart cosmosdb
```

---

### docker compose exec

実行中のコンテナでコマンドを実行します。

**構文:**
```bash
docker compose exec [OPTIONS] SERVICE COMMAND
```

**使用例:**
```bash
# コンテナにシェルで接続
docker compose exec cosmosdb bash

# 特定のコマンドを実行
docker compose exec cosmosdb ls -la
```

---

### docker compose stop / start

コンテナを停止/開始します（削除はしない）。

**構文:**
```bash
docker compose stop [SERVICE]
docker compose start [SERVICE]
```

**使用例:**
```bash
# 停止
docker compose stop cosmosdb

# 開始
docker compose start cosmosdb
```

---

## Docker コマンド

### docker ps

実行中のコンテナを表示します。

**構文:**
```bash
docker ps [OPTIONS]
```

**主要オプション:**
- `-a`, `--all`: 停止中のコンテナも表示
- `-q`, `--quiet`: IDのみ表示

**使用例:**
```bash
# 実行中のコンテナ
docker ps

# 全てのコンテナ
docker ps -a
```

---

### docker images

イメージ一覧を表示します。

**構文:**
```bash
docker images [OPTIONS]
```

**使用例:**
```bash
# 全イメージ
docker images

# CosmosDBイメージのみ
docker images | grep cosmosdb
```

---

### docker system

Dockerシステムの管理コマンド。

**構文:**
```bash
docker system COMMAND
```

**使用例:**
```bash
# ディスク使用量を確認
docker system df

# 未使用リソースを削除
docker system prune

# 全て削除（ボリューム含む）
docker system prune -a --volumes
```

---

## npm コマンド

### npm install

依存関係をインストールします。

**構文:**
```bash
npm install [PACKAGE]
```

**使用例:**
```bash
# package.jsonから全てインストール
npm install

# 特定のパッケージを追加
npm install axios

# 開発依存関係として追加
npm install --save-dev typescript
```

---

### npm run build

TypeScriptをビルドします。

**構文:**
```bash
npm run build
```

**説明:** `tsc`を実行し、`src/`の内容を`dist/`にコンパイルします。

---

### npm start

ビルド済みコードを実行します。

**構文:**
```bash
npm start
```

**説明:** `node dist/index.js`を実行します（事前に`npm run build`が必要）。

---

### npm run dev

TypeScriptを直接実行します（開発モード）。

**構文:**
```bash
npm run dev
```

**説明:** `ts-node src/index.ts`を実行します（ビルド不要）。

---

### npm run clean

ビルド成果物を削除します。

**構文:**
```bash
npm run clean
```

**説明:** `dist/`ディレクトリを削除します。

---

### npm cache clean

npmキャッシュをクリアします。

**構文:**
```bash
npm cache clean --force
```

---

## ポート確認コマンド

### Linux/macOS

```bash
# lsofを使用
lsof -i :8081

# netstatを使用
netstat -tuln | grep 8081
```

### Windows

```powershell
# netstatを使用
netstat -ano | findstr :8081

# PowerShellコマンドレット
Get-NetTCPConnection -LocalPort 8081
```

---

## プロセス管理コマンド

### Linux/macOS

```bash
# プロセスを検索
ps aux | grep node

# プロセスを終了
kill <PID>
kill -9 <PID>  # 強制終了
```

### Windows

```powershell
# プロセスを検索
Get-Process node

# プロセスを終了
Stop-Process -Id <PID>
Stop-Process -Id <PID> -Force  # 強制終了
```

---

## ファイル操作コマンド

### 環境変数ファイルのコピー

**Linux/macOS:**
```bash
cp .env.example .env
```

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

**Windows コマンドプロンプト:**
```cmd
copy .env.example .env
```

---

### ファイル編集

**Linux/macOS:**
```bash
nano .env
vim .env
```

**Windows:**
```powershell
notepad .env
code .env  # VSCode
```

---

### ディレクトリ構造の表示

**Linux/macOS:**
```bash
tree -L 2 -I 'node_modules|dist'
ls -la
```

**Windows PowerShell:**
```powershell
Get-ChildItem -Recurse -Depth 2
dir
```

**Windows コマンドプロンプト:**
```cmd
tree /F
dir
```

---

## TypeScript コマンド

### 型チェックのみ実行

```bash
npx tsc --noEmit
```

### watchモードでビルド

```bash
npx tsc --watch
```

---

## よく使うコマンドチェーン

### 初回セットアップ

**Linux/macOS:**
```bash
cp .env.example .env && docker compose up -d && npm install
```

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env; docker compose up -d; npm install
```

---

### クリーンビルド

```bash
npm run clean && npm run build
```

---

### 完全クリーンアップ

**Linux/macOS:**
```bash
docker compose down -v && npm run clean && rm -rf node_modules
```

**Windows PowerShell:**
```powershell
docker compose down -v; npm run clean; Remove-Item -Recurse -Force node_modules
```

---

## 関連ドキュメント

- [セットアップガイド](./setup.md) - 環境構築手順
- [Windows + Rancher Desktopガイド](./rancher-desktop-windows.md) - Windows固有の手順
- [README](../README.md) - プロジェクト概要
