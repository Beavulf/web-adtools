# Скрипт автоматической сборки и деплоя для Windows
# Использование: .\deploy.ps1

param(
    [string]$DeployPath = "C:\inetpub\wwwroot\web-adtools",
    [switch]$SkipBuild = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WEB AD Tools - Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия .env.production
if (!(Test-Path ".env.production")) {
    Write-Host "⚠️  WARNING: .env.production file not found!" -ForegroundColor Yellow
    Write-Host "   Creating from example..." -ForegroundColor Yellow
    if (Test-Path ".env.production.example") {
        Copy-Item ".env.production.example" ".env.production"
        Write-Host "   ✓ Created .env.production - please configure it!" -ForegroundColor Yellow
    } else {
        Write-Host "   ✗ .env.production.example not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please create .env.production file with:" -ForegroundColor Yellow
        Write-Host "  VITE_APP_URI_GRAPHQL=http://your-server:4000/graphql" -ForegroundColor Yellow
        Write-Host ""
        $continue = Read-Host "Continue anyway? (y/n)"
        if ($continue -ne "y") {
            exit 1
        }
    }
}

# Сборка проекта
if (!$SkipBuild) {
    Write-Host "📦 Building project for production..." -ForegroundColor Green
    npm run build:prod
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Build completed successfully!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⏭️  Skipping build (using existing dist folder)" -ForegroundColor Yellow
    Write-Host ""
}

# Проверка существования dist папки
if (!(Test-Path "dist")) {
    Write-Host "✗ dist folder not found! Please run build first." -ForegroundColor Red
    exit 1
}

# Проверка существования web.config в dist
if (!(Test-Path "dist\web.config")) {
    Write-Host "📝 Copying web.config to dist..." -ForegroundColor Green
    if (Test-Path "web.config") {
        Copy-Item "web.config" "dist\web.config"
        Write-Host "✓ web.config copied" -ForegroundColor Green
    } else {
        Write-Host "⚠️  web.config not found in project root!" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Создание папки для деплоя если не существует
if (!(Test-Path $DeployPath)) {
    Write-Host "📁 Creating deployment directory: $DeployPath" -ForegroundColor Green
    try {
        New-Item -ItemType Directory -Path $DeployPath -Force | Out-Null
        Write-Host "✓ Directory created" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to create directory: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please run this script as Administrator or create the directory manually." -ForegroundColor Yellow
        exit 1
    }
    Write-Host ""
}

# Копирование файлов
Write-Host "📋 Copying files to deployment directory..." -ForegroundColor Green
Write-Host "   Source: dist\" -ForegroundColor Gray
Write-Host "   Destination: $DeployPath" -ForegroundColor Gray
Write-Host ""

try {
    # Очистка старых файлов (опционально, раскомментируйте если нужно)
    # Write-Host "🗑️  Cleaning old files..." -ForegroundColor Yellow
    # Remove-Item "$DeployPath\*" -Recurse -Force -ErrorAction SilentlyContinue
    
    # Копирование новых файлов
    Copy-Item -Path "dist\*" -Destination $DeployPath -Recurse -Force
    Write-Host "✓ Files copied successfully!" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to copy files: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Verify files in: $DeployPath" -ForegroundColor Gray
Write-Host "   2. Check IIS/Nginx configuration" -ForegroundColor Gray
Write-Host "   3. Test application in browser" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tip: If using IIS, you may need to restart the website" -ForegroundColor Cyan
Write-Host ""

