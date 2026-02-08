import { getContainer } from './cosmosClient';

/**
 * アイテムの型定義
 */
export interface Item {
  id: string;
  name?: string;
  description?: string;
  [key: string]: any;
}

/**
 * アイテムを作成する (CREATE)
 */
export async function createItem(item: Item): Promise<Item> {
  try {
    console.log(`アイテムを作成中: ${item.id}`);
    const container = getContainer();
    const { resource } = await container.items.create(item);
    console.log(`アイテムが作成されました: ${resource?.id}\n`);
    return resource as Item;
  } catch (error) {
    console.error('アイテムの作成に失敗しました:', error);
    throw error;
  }
}

/**
 * アイテムをIDで取得する (READ)
 */
export async function readItem(id: string): Promise<Item | undefined> {
  try {
    console.log(`アイテムを取得中: ${id}`);
    const container = getContainer();
    const { resource } = await container.item(id, id).read<Item>();
    if (resource) {
      console.log(`アイテムが取得されました:`, resource);
      console.log('');
    } else {
      console.log(`アイテムが見つかりませんでした: ${id}\n`);
    }
    return resource;
  } catch (error: any) {
    if (error.code === 404) {
      console.log(`アイテムが見つかりませんでした: ${id}\n`);
      return undefined;
    }
    console.error('アイテムの取得に失敗しました:', error);
    throw error;
  }
}

/**
 * アイテムを更新する (UPDATE)
 */
export async function updateItem(id: string, updates: Partial<Item>): Promise<Item> {
  try {
    console.log(`アイテムを更新中: ${id}`);
    const container = getContainer();

    // 既存のアイテムを取得
    const { resource: existingItem } = await container.item(id, id).read<Item>();
    if (!existingItem) {
      throw new Error(`アイテムが見つかりませんでした: ${id}`);
    }

    // アイテムを更新
    const updatedItem = { ...existingItem, ...updates, id };
    const { resource } = await container.item(id, id).replace(updatedItem);
    console.log(`アイテムが更新されました: ${resource?.id}\n`);
    return resource as Item;
  } catch (error) {
    console.error('アイテムの更新に失敗しました:', error);
    throw error;
  }
}

/**
 * アイテムを削除する (DELETE)
 */
export async function deleteItem(id: string): Promise<void> {
  try {
    console.log(`アイテムを削除中: ${id}`);
    const container = getContainer();
    await container.item(id, id).delete();
    console.log(`アイテムが削除されました: ${id}\n`);
  } catch (error: any) {
    if (error.code === 404) {
      console.log(`アイテムが見つかりませんでした: ${id}\n`);
      return;
    }
    console.error('アイテムの削除に失敗しました:', error);
    throw error;
  }
}

/**
 * クエリを使用してアイテムを検索する
 */
export async function queryItems(queryText: string): Promise<Item[]> {
  try {
    console.log(`クエリを実行中: ${queryText}`);
    const container = getContainer();
    const { resources } = await container.items
      .query<Item>(queryText)
      .fetchAll();
    console.log(`${resources.length}件のアイテムが見つかりました\n`);
    return resources;
  } catch (error) {
    console.error('クエリの実行に失敗しました:', error);
    throw error;
  }
}

/**
 * すべてのアイテムを取得する
 */
export async function getAllItems(): Promise<Item[]> {
  try {
    console.log('すべてのアイテムを取得中...');
    const container = getContainer();
    const { resources } = await container.items.readAll<Item>().fetchAll();
    console.log(`${resources.length}件のアイテムが見つかりました\n`);
    return resources;
  } catch (error) {
    console.error('アイテムの取得に失敗しました:', error);
    throw error;
  }
}
