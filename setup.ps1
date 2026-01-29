# HealthTrackPro v2.0 - Setup Script
# This script automates the setup process for the enhanced version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HealthTrackPro v2.0 Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
$mongoCheck = mongosh --eval "db.version()" --quiet 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB is not running or not installed" -ForegroundColor Yellow
    Write-Host "   Please start MongoDB or install from https://www.mongodb.com" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installing Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend dependency installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Install backend dependencies
Write-Host ""
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend dependency installation failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setting Up Environment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Create backend .env if it doesn't exist
if (-not (Test-Path "backend/.env")) {
    Write-Host ""
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    Copy-Item "backend/.env.example" "backend/.env"
    Write-Host "✅ Backend .env created" -ForegroundColor Green
    Write-Host "⚠️  Please edit backend/.env with your configuration" -ForegroundColor Yellow
} else {
    Write-Host "✅ Backend .env already exists" -ForegroundColor Green
}

# Create frontend .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Frontend .env created" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend .env already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Running Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Running backend tests..." -ForegroundColor Yellow
Set-Location backend
npm test -- --passWithNoTests
$testResult = $LASTEXITCODE
Set-Location ..

if ($testResult -eq 0) {
    Write-Host "✅ All tests passed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Edit backend/.env with your MongoDB URI and JWT secrets" -ForegroundColor White
Write-Host "2. Edit .env with your API URL (default: http://10.0.2.2:5000)" -ForegroundColor White
Write-Host "3. Start MongoDB if not running: mongod" -ForegroundColor White
Write-Host "4. Start the application: npm start" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Green
Write-Host "  npm start          - Start both frontend and backend" -ForegroundColor White
Write-Host "  npm run dev        - Start backend in development mode" -ForegroundColor White
Write-Host "  npm test           - Run tests" -ForegroundColor White
Write-Host "  npm run lint       - Check code quality" -ForegroundColor White
Write-Host "  npm run format     - Format code" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Green
Write-Host "  README_V2.md       - Full v2.0 documentation" -ForegroundColor White
Write-Host "  MIGRATION_GUIDE.md - Migration from v1.0" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan
