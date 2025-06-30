## Ataque 1: Busca simples em massa

```bash
plow -c 100 -d 30s "https://ileknyw17g.map.azionedge.net/api/search?q=produto"
```

## Ataque 2: Endpoint caro

```bash
plow -c 50 -d 20s -m POST \
 -H "Content-Type: application/json" \
 -b '{"filters": ["price", "category", "brand"], "deepSearch": true}' \
 "https://ileknyw17g.map.azionedge.net/api/heavy-search"
```

## Ataque 3: Relatórios (destruidor de orçamento!)

```bash
plow -c 20 -d 10s "https://ileknyw17g.map.azionedge.net/api/generate-report/financial"
```
