# monitor.sh - Mostrar custos em tempo real
while true; do
  clear
  echo "💰 MONITOR DE CUSTOS - API DEMO"
  echo "================================"
  curl -s https://ileknyw17g.map.azionedge.net/api/status | jq .
  echo "================================"
  sleep 2
done