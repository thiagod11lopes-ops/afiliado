# Script para fazer commit no projeto Vitrine Net (Afiliado smart)
# Execute na pasta do projeto ou pelo PowerShell

Set-Location $PSScriptRoot

Write-Host "Pasta do projeto: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Verifica se é um repositório Git
if (-not (Test-Path .git)) {
    Write-Host "Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    git branch -M main
}

Write-Host "Adicionando arquivos (git add .)..." -ForegroundColor Yellow
git add .

Write-Host "Status:" -ForegroundColor Yellow
git status

Write-Host ""
$msg = Read-Host "Digite a mensagem do commit (ou Enter para usar padrão)"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "Atualização Vitrine Net" }

Write-Host "Fazendo commit..." -ForegroundColor Yellow
git commit -m $msg

if ($LASTEXITCODE -eq 0) {
    Write-Host "Commit feito com sucesso." -ForegroundColor Green
} else {
    Write-Host "Nenhuma alteração para commitar ou ocorreu um erro." -ForegroundColor Red
}
