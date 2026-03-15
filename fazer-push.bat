@echo off
chcp 65001 >nul
title Push - Vitrine Net

cd /d "%~dp0"

echo.
echo Enviando alteracoes para o GitHub...
echo.

git push

if %errorlevel% equ 0 (
    echo.
    echo Push concluido. O site sera atualizado em 1-2 minutos.
) else (
    echo.
    echo Erro ao fazer push. Verifique se ha commits e se esta conectado.
)

echo.
pause
