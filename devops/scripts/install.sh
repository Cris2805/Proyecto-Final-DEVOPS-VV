#!/bin/bash
set -e

echo "========================================"
echo " TaskFlow - Instalacion de dependencias"
echo "========================================"

echo "Instalando dependencias de la raiz..."
npm install

echo "Dependencias instaladas correctamente."
echo "Frontend: ./frontend"
echo "Backend:  ./backend"
echo "Listo. Puedes ejecutar: npm run dev"
