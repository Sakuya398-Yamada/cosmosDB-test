import { initializeCosmosDB } from './cosmosClient';
import {
  createItem,
  readItem,
  updateItem,
  deleteItem,
  queryItems,
  getAllItems,
  Item,
} from './operations';

/**
 * メイン関数: すべてのCRUD操作をデモンストレーション
 */
async function main() {
  try {
    console.log('=== CosmosDB CRUD操作のデモンストレーション ===\n');

    // 1. CosmosDBの初期化
    await initializeCosmosDB();

    // 2. CREATE: アイテムの作成
    console.log('--- CREATE: アイテムの作成 ---');
    const item1: Item = {
      id: 'item-001',
      name: '商品A',
      description: 'これは商品Aの説明です',
      price: 1000,
      category: 'electronics',
    };
    await createItem(item1);

    const item2: Item = {
      id: 'item-002',
      name: '商品B',
      description: 'これは商品Bの説明です',
      price: 2000,
      category: 'electronics',
    };
    await createItem(item2);

    const item3: Item = {
      id: 'item-003',
      name: '商品C',
      description: 'これは商品Cの説明です',
      price: 1500,
      category: 'books',
    };
    await createItem(item3);

    // 3. READ: アイテムの取得
    console.log('--- READ: アイテムの取得 ---');
    await readItem('item-001');

    // 4. UPDATE: アイテムの更新
    console.log('--- UPDATE: アイテムの更新 ---');
    await updateItem('item-001', {
      price: 1200,
      description: '商品Aの説明が更新されました（値下げ後）',
    });

    // 更新後のアイテムを確認
    await readItem('item-001');

    // 5. QUERY: クエリによる検索
    console.log('--- QUERY: クエリによる検索 ---');
    const electronicsItems = await queryItems(
      'SELECT * FROM c WHERE c.category = "electronics"'
    );
    console.log('カテゴリ"electronics"のアイテム:');
    electronicsItems.forEach((item) => {
      console.log(`  - ${item.id}: ${item.name} (¥${item.price})`);
    });
    console.log('');

    // 6. すべてのアイテムを取得
    console.log('--- すべてのアイテムを取得 ---');
    const allItems = await getAllItems();
    console.log('すべてのアイテム:');
    allItems.forEach((item) => {
      console.log(`  - ${item.id}: ${item.name} (¥${item.price})`);
    });
    console.log('');

    // 7. DELETE: アイテムの削除
    console.log('--- DELETE: アイテムの削除 ---');
    await deleteItem('item-002');

    // 削除後のアイテムを確認
    console.log('--- 削除後のすべてのアイテム ---');
    const remainingItems = await getAllItems();
    console.log('残りのアイテム:');
    remainingItems.forEach((item) => {
      console.log(`  - ${item.id}: ${item.name} (¥${item.price})`);
    });
    console.log('');

    console.log('=== デモンストレーション完了 ===');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

// メイン関数の実行
main();
