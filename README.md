# AI木曜会クイズアプリ

AI木曜会のオフ会やオンラインイベントで使用するチーム対抗クイズアプリです。

## 概要

- **全20問のクイズ**（4択10問 + 画像2択7問 + 文章2択3問）
- **チーム機能**（最大15チーム）
- **メンバー登録・ログイン機能**（1チーム5〜10人）
- **リアルタイム更新機能**（待機画面でメンバーが自動的に表示される）
- **チームランキング**（チームの合計点で競う）

## 技術スタック

- **フロントエンド**: React (Vite)
- **バックエンド**: Supabase (PostgreSQL + Realtime)
- **デプロイ**: Vercel
- **バージョン管理**: GitHub

## データベース構造

### teamsテーブル
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### membersテーブル
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  team_id UUID REFERENCES teams(id),
  score INTEGER DEFAULT 0,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 主要機能

### 1. チーム作成・選択
- チーム名を入力して新しいチームを作成
- 既存のチームを選択してログイン
- チームの現在のスコアが表示される

### 2. メンバー登録・ログイン
- **新規登録**: ユーザー名とパスワード（3桁）を入力して登録
- **ログイン**: 既存のユーザー名とパスワードでログイン
- パスワードは3桁の数字（例: 123）

### 3. 待機画面
- メンバー登録後、5人未満の場合は待機画面を表示
- 現在の登録メンバー数を表示（X / 10人）
- 登録済みメンバーのリストを表示
- 自分のユーザー名をハイライト表示（「あなた」と表示）
- **リアルタイム更新**: 新しいメンバーが登録されると自動的に画面を更新（リロード不要）
- 5人以上揃ったら「クイズを開始する」ボタンが有効になる

### 4. クイズ画面
- 全20問のクイズに回答
- 4択問題、画像2択問題、文章2択問題の3種類
- 回答後、正解・不正解のフィードバックを表示
- 次の問題に自動的に進む

### 5. 結果画面
- **チームの合計スコア**を大きく表示
- **あなたのスコア**を小さく表示（個人のスコアと正答率）
- **チームランキング**を表示（全チームの合計点でランキング）
- 1位は金色、2位は銀色、3位は銅色で表示

### 6. マスターアカウント
- ユーザー名: `kawase`
- パスワード: `123`
- マスターアカウントでログインすると、全チームのスコアをリセットできる（予定）

## リアルタイム更新機能

Supabaseのリアルタイム機能を使用して、待機画面でメンバーが追加されると自動的に画面を更新します。

### 実装方法
```javascript
useEffect(() => {
  if (screen === 'waiting' && selectedTeam) {
    fetchTeamMembers()
    
    const channel = supabase
      .channel(`team-${selectedTeam.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'members',
        filter: `team_id=eq.${selectedTeam.id}`
      }, (payload) => {
        console.log('リアルタイム更新:', payload)
        fetchTeamMembers()
      })
      .subscribe((status) => {
        console.log('サブスクリプション状態:', status)
      })
    
    return () => {
      supabase.removeChannel(channel)
    }
  }
}, [screen, selectedTeam])
```

## セットアップ

### 1. 依存関係のインストール
```bash
pnpm install
```

### 2. 環境変数の設定
`.env`ファイルを作成して、Supabaseの認証情報を設定します。

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 開発サーバーの起動
```bash
pnpm dev
```

### 4. ビルド
```bash
pnpm build
```

## デプロイ

Vercelに自動デプロイされます。

- **本番URL**: https://aimokuyoukai-quiz-cq95uso9n-aska777-ai.vercel.app
- **ブランチ**: `branch-14`

## 開発履歴

### 2025-10-17
- **待機画面の追加**: 5人未満の場合、待機画面を表示
- **リアルタイム更新機能**: Supabaseのリアルタイム機能を使用して、メンバーが追加されると自動的に画面を更新
- **個別開始ボタン**: 5人以上揃ったら、各ユーザーが個別に「クイズを開始する」ボタンを押せる
- **406エラーの解決**: `.single()`メソッドの使用を修正
- **チームの合計スコア表示**: 結果画面でチームの合計スコアを大きく表示

## 今後の実装予定

### マスターモード（実装予定）
- **マスター（司会者）が問題を進行**: 1人のマスターが問題を進め、他のメンバーは同時に回答
- **ハイブリッド方式**: 基本的には全員が回答するまで待つが、マスターは「強制的に次へ」ボタンで進められる
- **手動マスター委譲**: マスターが落ちた場合、他のメンバーが「マスター権限を引き継ぐ」ボタンを押せる

#### マスターモードの仕様
1. **マスターの選択**: チーム作成者または最初にログインした人がマスター
2. **問題の進行**: マスターのみが「次の問題へ」ボタンを押せる
3. **リアルタイム同期**: マスターが問題を進めると、全メンバーの画面が自動更新
4. **回答状況の表示**: マスターの画面に「3 / 5人が回答済み」と表示
5. **強制進行**: マスターは「強制的に次へ」ボタンでいつでも進められる（確認ダイアログあり）
6. **マスター委譲**: マスターが落ちた場合、他のメンバーが「マスター権限を引き継ぐ」ボタンを押せる

#### マスターモードのメリット
- **不正行為の防止**: 回答を見てから仲間に教えることができない
- **チーム戦の醍醐味**: 全員が同じタイミングで回答するため、リアルタイムで盛り上がる
- **公平性**: 同じ時間制限の中で回答するため、差が出やすい

## トラブルシューティング

### 406エラーが発生する
- Supabaseの`.single()`メソッドの使用を確認してください
- 存在しないレコードを検索する場合、`.single()`を使用しないでください

### リアルタイム更新が機能しない
- Supabaseのリアルタイム機能が有効になっているか確認してください
- `supabase_realtime`パブリケーションに`members`テーブルが追加されているか確認してください

```sql
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

### デプロイが古いバージョンを使用している
- Vercelのキャッシュをクリアしてください
- 空のコミットをプッシュして再デプロイをトリガーしてください

```bash
git commit --allow-empty -m "Force redeploy"
git push origin branch-14
```

## ライセンス

MIT License

## 作者

AI木曜会チーム

## バージョン履歴

### v1.0.0 (2025-10-17)
- 初回リリース
- 基本的なクイズ機能
- チーム機能
- メンバー登録・ログイン機能
- 待機画面とリアルタイム更新機能
- チームランキング機能
- チームの合計スコア表示

### v1.1.0 (予定)
- マスターモードの実装
- ハイブリッド方式の進行
- 手動マスター委譲機能

