#!/bin/bash

echo "======================================"
echo "Job Portal - MERN Stack Setup"
echo "======================================"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"
echo ""

# Create .env file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please configure your .env file with:"
    echo "   - MongoDB connection string"
    echo "   - JWT secret"
    echo "   - Cloudinary credentials"
    echo ""
fi

# Seed admin
echo "👤 Seeding admin user..."
npm run seed
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Create .env file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Frontend .env created"
fi

echo ""
echo "======================================"
echo "✨ Setup Complete!"
echo "======================================"
echo ""
echo "To start the application:"
echo ""
echo "Backend (Terminal 1):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Frontend (Terminal 2):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Default Admin Login:"
echo "  Email: admin@jobportal.com"
echo "  Password: Admin@123"
echo ""
echo "======================================"
