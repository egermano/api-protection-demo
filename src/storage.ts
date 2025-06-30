import {
  AzionBucketObject,
  AzionStorageResponse,
  createObject,
  getObjectByKey,
  updateObject,
} from "azion/storage";

// Contador de custos (usar Edge SQL ou KV)
export type StorageKV = {
  totalCost: number;
  requestCount: number;
};

export let storageKV: StorageKV = {
  totalCost: 0,
  requestCount: 0,
};

const loadFromStorage = async () => {
  const { data, error }: AzionStorageResponse<AzionBucketObject> =
    await getObjectByKey({
      bucket: process.env.BUCKET_NAME!,
      key: process.env.OBJECT_ID!,
    });

  // if (!data || error) {
  //   console.error("Erro ao carregar dados do armazenamento:", { data, error });
  //   process.exit(1);
  // }

  console.log("Error loading data from storage:", { data, error });

  if (!data?.content) {
    const { data: newObject, error }: AzionStorageResponse<AzionBucketObject> =
      await createObject({
        bucket: process.env.BUCKET_NAME!,
        key: process.env.OBJECT_ID!,
        content: JSON.stringify(storageKV),
      });

    if (newObject) {
      console.log(`Object created with key: ${newObject.key}`);
    } else {
      console.error("Failed to create object", error);
      process.exit(1);
    }

    return newObject.content;
  }

  return data.content;
};

export const loadData = async () => {
  const loadedData = await loadFromStorage();
  const parsedData = JSON.parse(loadedData || "");

  if (parsedData.totalCost) {
    storageKV.totalCost = parsedData.totalCost;
  }
  if (parsedData.requestCount) {
    storageKV.requestCount = parsedData.requestCount;
  }

  return storageKV;
};

export const updateStorage = async (data: StorageKV) => {
  const {
    data: updatedObject,
    error,
  }: AzionStorageResponse<AzionBucketObject> = await updateObject({
    bucket: process.env.BUCKET_NAME!,
    key: process.env.OBJECT_ID!,
    content: JSON.stringify(data),
  });

  if (updatedObject) {
    console.log(`Object updated: ${updatedObject.key}`);
  } else {
    console.error("Failed to update object", error);
  }
  storageKV = data;
};
