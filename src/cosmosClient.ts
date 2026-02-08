import { CosmosClient, Database, Container } from '@azure/cosmos';
import * as dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

// 環境変数の取得
const endpoint = process.env.COSMOS_ENDPOINT || '';
const key = process.env.COSMOS_KEY || '';
const databaseName = process.env.DATABASE_NAME || 'TestDatabase';
const containerName = process.env.CONTAINER_NAME || 'TestContainer';

// CosmosClientの初期化
export const client = new CosmosClient({
  endpoint,
  key,
});

// データベースとコンテナの参照
let database: Database;
let container: Container;

/**
 * データベースとコンテナを初期化する
 * 存在しない場合は作成する
 */
export async function initializeCosmosDB(): Promise<void> {
  try {
    console.log('CosmosDBを初期化しています...');

    // データベースの作成または取得
    const { database: db } = await client.databases.createIfNotExists({
      id: databaseName,
    });
    database = db;
    console.log(`データベース "${databaseName}" を初期化しました`);

    // コンテナの作成または取得
    const { container: cont } = await database.containers.createIfNotExists({
      id: containerName,
      partitionKey: { paths: ['/id'] },
    });
    container = cont;
    console.log(`コンテナ "${containerName}" を初期化しました`);

    console.log('CosmosDBの初期化が完了しました\n');
  } catch (error) {
    console.error('CosmosDBの初期化に失敗しました:', error);
    throw error;
  }
}

/**
 * データベースの参照を取得
 */
export function getDatabase(): Database {
  if (!database) {
    throw new Error('データベースが初期化されていません。initializeCosmosDB()を先に実行してください。');
  }
  return database;
}

/**
 * コンテナの参照を取得
 */
export function getContainer(): Container {
  if (!container) {
    throw new Error('コンテナが初期化されていません。initializeCosmosDB()を先に実行してください。');
  }
  return container;
}
