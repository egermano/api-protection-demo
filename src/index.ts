import dotenv from "dotenv";
import { Hono } from "hono";
import { fire } from "hono/service-worker";

dotenv.config();

const app = new Hono();

// Endpoint de busca simples
app.get("/api/search", async (c) => {
  const query = c.req.query("q") || "";

  return c.json({
    results: `${Math.ceil(
      Math.random() * 10
    )} produtos encontrados para: ${query}`,
    message: "✅ Busca simples realizada",
  });
});

// Endpoint de busca complexa (mais caro)
app.post("/api/heavy-search", async (c) => {
  const { filters, deepSearch, includeAnalytics } = await c.req.json();

  // Simular delay de processamento
  await new Promise((resolve) => setTimeout(resolve, 500));

  return c.json({
    message: "⚠️ Busca complexa realizada",
    filters: filters?.length || 0,
  });
});

// Endpoint de relatório (muito caro)
app.get("/api/generate-report/:type", async (c) => {
  const reportType = c.req.param("type");

  // Simular delay de processamento
  await new Promise((resolve) => setTimeout(resolve, 2500));

  return c.json({
    report: `Relatório ${reportType} gerado`,
    message: "🚨 OPERAÇÃO MUITO DEMORADA!",
  });
});

fire(app);
