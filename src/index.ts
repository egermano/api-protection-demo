import { loadData, StorageKV, updateData as updateStorage } from "@/kv";
import dotenv from "dotenv";
import { Hono } from "hono";
import { fire } from "hono/service-worker";

dotenv.config();

const app = new Hono();

// Simulador de custos
const COSTS = {
  search: 0.005, // $0.005 por busca
  heavySearch: 0.02, // $0.02 por busca complexa
  report: 0.1, // $0.10 por relatório
};

// Endpoint de busca simples
app.get("/api/search", async (c) => {
  const storageKV = await loadData();

  storageKV.requestCount = storageKV.requestCount + 1;
  storageKV.totalCost = storageKV.totalCost + COSTS.search;
  await updateStorage(storageKV);

  const query = c.req.query("q") || "";

  // Simular busca no Edge SQL
  // const results = await edgeSQL.query('SELECT * FROM products WHERE name LIKE ?', [`%${query}%`]);

  return c.json({
    results: `${Math.ceil(
      Math.random() * 10
    )} produtos encontrados para: ${query}`,
    requestNumber: storageKV.requestCount,
    costOfThisRequest: `$${COSTS.search}`,
    totalCostSoFar: `$${storageKV.totalCost.toFixed(3)}`,
  });
});

// Endpoint de busca complexa (mais caro)
app.post("/api/heavy-search", async (c) => {
  const storageKV = await loadData();

  storageKV.requestCount = storageKV.requestCount + 1;
  storageKV.totalCost = storageKV.totalCost + COSTS.heavySearch;

  const { filters, deepSearch, includeAnalytics } = await c.req.json();

  // Simular delay de processamento
  await new Promise((resolve) => setTimeout(resolve, 500));

  return c.json({
    message: "Busca complexa realizada",
    filters: filters?.length || 0,
    requestNumber: storageKV.requestCount,
    costOfThisRequest: `$${COSTS.heavySearch}`,
    totalCostSoFar: `$${storageKV.totalCost.toFixed(3)}`,
    warning: storageKV.totalCost > 1 ? "⚠️ Alto custo detectado!" : null,
  });
});

// Endpoint de relatório (muito caro)
app.get("/api/generate-report/:type", async (c) => {
  const storageKV = await loadData();

  storageKV.requestCount = storageKV.requestCount + 1;
  storageKV.totalCost = storageKV.totalCost + COSTS.report;

  const reportType = c.req.param("type");

  return c.json({
    report: `Relatório ${reportType} gerado`,
    requestNumber: storageKV.requestCount,
    costOfThisRequest: `$${COSTS.report}`,
    totalCostSoFar: `$${storageKV.totalCost.toFixed(2)}`,
    alert: "🚨 OPERAÇÃO CARA!",
  });
});

// Status endpoint para mostrar custos
app.get("/api/status", async (c) => {
  const storageKV = await loadData();

  return c.json({
    totalRequests: storageKV.requestCount,
    totalCost: `$${storageKV.totalCost.toFixed(2)}`,
    averageCostPerRequest: `$${(
      storageKV.totalCost / (storageKV.requestCount || 1)
    ).toFixed(3)}`,
    projectedDailyCost: `$${(storageKV.totalCost * 1440).toFixed(2)}`, // Projeção diária
    message:
      storageKV.totalCost > 10
        ? "💸 CUSTOS FORA DE CONTROLE!"
        : "✅ Custos sob controle",
  });
});

// Reset para demo
app.post("/api/reset", (c) => {
  const storageKV: StorageKV = {
    totalCost: 0,
    requestCount: 0,
  };

  updateStorage(storageKV);
  return c.json({ message: "Contadores resetados" });
});

fire(app);
