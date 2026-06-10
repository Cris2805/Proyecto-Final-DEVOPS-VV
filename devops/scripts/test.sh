#!/bin/bash
set -e

echo "========================================"
echo " TaskFlow - Pruebas automatizadas"
echo "========================================"
echo "Ejecutando pruebas backend/frontend..."
npm test

echo "Pruebas principales completadas."
echo "Nota: las pruebas E2E requieren frontend y backend activos."
echo "Para E2E ejecuta en otra terminal: npm run dev"
echo "Luego ejecuta: npm run test:e2e"
