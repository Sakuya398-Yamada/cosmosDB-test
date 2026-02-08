# Windows + Rancher Desktop セットアップガイド

Windows環境でRancher Desktopを使用してCosmosDB Emulatorを起動する完全ガイドです。

## 目次

- [前提条件](#前提条件)
- [Rancher Desktopのセットアップ](#rancher-desktopのセットアップ)
- [プロジェクトのセットアップ](#プロジェクトのセットアップ)
- [トラブルシューティング](#トラブルシューティング)
- [開発ワークフロー](#開発ワークフロー)

---

## 前提条件

### 必要なソフトウェア

1. **Windows 10/11**
   - Windows 10 バージョン2004以上
   - または Windows 11

2. **Rancher Desktop** 1.9.0以上
   - [ダウンロード](https://rancherdesktop.io/)

3. **Node.js for Windows** 18.x以上
   - [ダウンロード](https://nodejs.org/)（LTS版推奨）

4. **WSL2**
   - Rancher Desktopで自動インストールされます

---

## Rancher Desktopのセットアップ

### 1. インストール

1. [Rancher Desktop](https://rancherdesktop.io/)から最新版をダウンロード
2. インストーラーを実行
3. インストール完了後、Rancher Desktopを起動

### 2. Container Runtimeの設定

**重要**: Docker Composeを使用するため、`dockerd (moby)`が必須です。

1. Rancher Desktopを開く
2. **Settings（設定）** を開く
3. **Container Runtime** タブを選択
4. **`dockerd (moby)`** を選択（`containerd`ではない）
5. **Apply（適用）** をクリックして再起動

### 3. WSL Integrationの有効化

1. **WSL** タブを開く
2. 使用するディストリビューション（Ubuntu等）にチェック
3. **Apply（適用）** をクリック

### 4. 動作確認

PowerShellを開いて以下を実行:

```powershell
docker --version
docker compose version
```

正常に表示されればOKです。

---

## プロジェクトのセットアップ

### クイックスタート

PowerShellで以下を実行:

```powershell
# プロジェクトディレクトリへ移動
cd C:\path\to\cosmosDB_test

# 環境変数ファイルをコピー
Copy-Item .env.example .env

# Emulatorを起動（初回は5〜10分）
docker compose up -d

# 依存関係をインストール
npm install

# アプリケーションを実行
npm run dev
```

### 起動確認

```powershell
# コンテナの状態確認
docker compose ps

# ログ確認
docker compose logs -f cosmosdb
```

Web UIで確認:
```
https://localhost:8081/_explorer/index.html
```

---

## トラブルシューティング

### 問題1: docker composeコマンドが見つからない

**症状:**
```
'docker compose' is not recognized as an internal or external command
```

**解決方法:**
1. Rancher Desktopが起動しているか確認
2. Container Runtimeが`dockerd (moby)`になっているか確認
3. Rancher Desktopを再起動
4. PowerShellを再起動

---

### 問題2: Emulatorが起動しない

**症状:** コンテナは起動するが、UIにアクセスできない

**解決方法:**
```powershell
# ログを確認
docker compose logs -f cosmosdb

# ポートを確認
netstat -ano | findstr :8081
```

完全起動まで5〜10分待ちます。

---

### 問題3: ポート競合

**症状:** `port 8081 is already allocated`

**解決方法:**
```powershell
# ポートを使用しているプロセスを確認
netstat -ano | findstr :8081

# プロセスを終了（管理者権限が必要な場合あり）
Stop-Process -Id <PID>
```

---

### 問題4: メモリ不足

**症状:** Emulatorの起動が失敗する

**解決方法:**
1. Rancher Desktop → Settings → Virtual Machine
2. メモリを8GB以上に設定
3. Rancher Desktopを再起動

---

### 問題5: WSL2が無効

**症状:** Rancher Desktopが起動しない

**解決方法:**

PowerShellを**管理者として実行**:
```powershell
wsl --install
```

再起動後、Rancher Desktopを起動します。

---

### 問題6: 証明書エラー

**症状:** `UNABLE_TO_VERIFY_LEAF_SIGNATURE`

**解決方法:**

`.env`ファイルを確認:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
```

**注意**: 開発環境でのみ使用してください。

---

## 開発ワークフロー

### 日常的な開発フロー

```powershell
# 1. Emulatorを起動（初回のみまたは停止後）
docker compose up -d

# 2. 開発モードで実行
npm run dev

# 3. 作業終了時（オプション）
docker compose down
```

### VSCode + WSL拡張機能（推奨）

1. VSCodeに「Remote - WSL」拡張機能をインストール
2. WSL内でプロジェクトを開く:
   ```bash
   code .
   ```

これにより、Windowsで快適に開発しながらLinux環境で実行できます。

---

## よく使うコマンド（Windows）

詳細は[コマンドリファレンス](./commands.md)を参照してください。

### Emulator操作
```powershell
docker compose up -d         # 起動
docker compose down          # 停止
docker compose ps            # 状態確認
docker compose logs -f cosmosdb  # ログ確認
docker compose restart cosmosdb  # 再起動
```

### npm操作
```powershell
npm install                  # 依存関係インストール
npm run dev                  # 開発モード実行
npm run build                # ビルド
npm start                    # 本番モード実行
```

### トラブルシューティング
```powershell
# ポート確認
netstat -ano | findstr :8081

# プロセス確認
Get-Process node

# プロセス終了
Stop-Process -Id <PID>

# Docker情報
docker info
docker system df
```

---

## チェックリスト

問題が発生した場合、以下を確認してください:

- [ ] Rancher Desktopが起動している
- [ ] Container Runtimeが`dockerd (moby)`
- [ ] `docker --version`が動作する
- [ ] `docker compose version`が動作する
- [ ] ポート8081が空いている
- [ ] ファイアウォールが許可している
- [ ] WSL2が有効（`wsl --status`で確認）
- [ ] メモリが4GB以上割り当てられている

---

## パフォーマンス最適化

### WSL2のメモリ制限

`C:\Users\YourName\.wslconfig`を作成:

```ini
[wsl2]
memory=8GB
processors=4
swap=2GB
```

PowerShellでWSLを再起動:
```powershell
wsl --shutdown
```

---

## 参考リンク

- [Rancher Desktop公式ドキュメント](https://docs.rancherdesktop.io/)
- [WSL2のインストール](https://docs.microsoft.com/windows/wsl/install)
- [Docker Compose V2](https://docs.docker.com/compose/)
- [コマンドリファレンス](./commands.md)
- [セットアップガイド](./setup.md)
