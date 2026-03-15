@echo off
chcp 65001 >nul
title Push - Vitrine Net

cd /d "%~dp0"

echo.
echo Enviando alterações para o GitHub...
echo.

git push

if %errorlevel% equ 0 (
    echo.
    echo Push concluído. O site será atualizado em 1-2 minutos.
) else (
    echo.
    echo Erro ao fazer push. Verifique se há commits e se está conectado.
)

echo.
pause
