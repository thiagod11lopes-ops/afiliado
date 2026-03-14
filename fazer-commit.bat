@echo off
chcp 65001 >nul
title Commit - Vitrine Net

cd /d "%~dp0"

if not exist .git (
    echo Inicializando repositorio Git...
    git init
    git branch -M main
)

echo.
echo Adicionando arquivos...
git add .

echo.
echo Status:
git status

echo.
set /p msg="Digite a mensagem do commit (Enter = Atualizacao Vitrine Net): "
if "%msg%"=="" set msg=Atualizacao Vitrine Net

echo.
echo Fazendo commit...
git commit -m "%msg%"

if %errorlevel% equ 0 (
    echo.
    echo Commit feito com sucesso.
) else (
    echo.
    echo Nenhuma alteracao para commitar ou ocorreu um erro.
)

echo.
pause
