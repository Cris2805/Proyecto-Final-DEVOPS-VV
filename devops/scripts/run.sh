#!/bin/bash
set -e

echo "========================================"
echo " TaskFlow - Modo desarrollo"
echo "========================================"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3000"
echo "Health:   http://localhost:3000/api/health"
echo "Presiona Ctrl+C para detener los servicios."
echo "----------------------------------------"

npm run dev
