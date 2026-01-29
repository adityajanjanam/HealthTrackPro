#!/bin/bash

# HealthTrackPro v2.0 - Setup Script
# This script automates the setup process for the enhanced version

echo "========================================"
echo "  HealthTrackPro v2.0 Setup"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js $NODE_VERSION found${NC}"

# Check if MongoDB is running
echo -e "${YELLOW}Checking MongoDB connection...${NC}"
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.version()" --quiet &> /dev/null; then
        echo -e "${GREEN}✅ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}⚠️  MongoDB is not running or not installed${NC}"
        echo -e "${YELLOW}   Please start MongoDB or install from https://www.mongodb.com${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  mongosh not found${NC}"
fi

echo ""
echo "========================================"
echo "  Installing Dependencies"
echo "========================================"

# Install frontend dependencies
echo ""
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend dependency installation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

# Install backend dependencies
echo ""
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    cd ..
    exit 1
fi
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
cd ..

echo ""
echo "========================================"
echo "  Setting Up Environment"
echo "========================================"

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo ""
    echo -e "${YELLOW}Creating backend .env file...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Backend .env created${NC}"
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your configuration${NC}"
else
    echo -e "${GREEN}✅ Backend .env already exists${NC}"
fi

# Create frontend .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo -e "${YELLOW}Creating frontend .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Frontend .env created${NC}"
else
    echo -e "${GREEN}✅ Frontend .env already exists${NC}"
fi

echo ""
echo "========================================"
echo "  Running Tests"
echo "========================================"

echo ""
echo -e "${YELLOW}Running backend tests...${NC}"
cd backend
npm test -- --passWithNoTests
TEST_RESULT=$?
cd ..

if [ $TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed${NC}"
fi

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Edit backend/.env with your MongoDB URI and JWT secrets"
echo "2. Edit .env with your API URL (default: http://10.0.2.2:5000)"
echo "3. Start MongoDB if not running: mongod"
echo "4. Start the application: npm start"
echo ""
echo -e "${GREEN}Useful commands:${NC}"
echo "  npm start          - Start both frontend and backend"
echo "  npm run dev        - Start backend in development mode"
echo "  npm test           - Run tests"
echo "  npm run lint       - Check code quality"
echo "  npm run format     - Format code"
echo ""
echo -e "${GREEN}Documentation:${NC}"
echo "  README_V2.md       - Full v2.0 documentation"
echo "  MIGRATION_GUIDE.md - Migration from v1.0"
echo ""
echo -e "${CYAN}Happy coding! 🚀${NC}"
