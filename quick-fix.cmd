@echo off
echo Limpiando proyecto...
rmdir /s /q .next
del package-lock.json
npm cache clean --force
npm install
echo Listo! Ejecuta: npm run dev 