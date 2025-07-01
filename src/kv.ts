import { setupKV } from "azion/kv";

// Configure and get KV instance
const getKV = async () =>
  await setupKV({
    bucket: process.env.BUCKET_NAME!,
    ttl: Number.MAX_SAFE_INTEGER, // almost infinite TTL
    cache: true, // use cache (optional)
  });

const key = "totalCost";

// Contador de custos (usar Edge SQL ou KV)
export type StorageKV = {
  totalCost: number;
  requestCount: number;
};

export let storageKV: StorageKV = {
  totalCost: 0,
  requestCount: 0,
};

export const loadData = async () => {
  const kv = await getKV();
  const exists = await kv.has(key);

  if (!exists.data) {
    // Initialize storage if it doesn't exist
    await kv.put(key, storageKV);
    return storageKV;
  }

  const { data } = await kv.get<StorageKV>(key);
  return data?.value!;
};

export const updateData = async (data: StorageKV) => {
  const kv = await getKV();
  await kv.put(key, data);
  storageKV = data; // Update local reference
  return storageKV;
};
