#!/bin/bash
set -e

echo "========================================"
echo " TaskFlow - Build de produccion"
echo "========================================"
echo "Generando build del frontend..."
npm run build

echo "Build generado correctamente."
