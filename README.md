# Simbrella Vault

A modern, secure digital wallet solution that enables users to manage their finances with ease. Built with a focus on security, performance, and user experience.

## 🌟 Features

- **Secure Transactions**: Bank-grade security for all transactions and personal information
- **Instant Transfers**: Send money instantly to anyone, anywhere
- **Smart Analytics**: Track spending patterns and get financial insights
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- **Real-time Updates**: Stay informed with instant transaction notifications

## 🏗️ Tech Stack

### Frontend

- Next.js 15 (React)
- Tailwind CSS
- Shadcn UI Components
- TypeScript

### Backend

- Node.js
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Jest (Testing)

### Infrastructure

- Docker
- CI/CD Pipeline
- Automated Testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/simbrella-vault.git
cd simbrella-vault
```

2. Set up the development environment:

```bash
# Start the development environment
docker-compose up -d

# Install frontend dependencies
cd frontend/simbrella-frontend
npm install

# Install backend dependencies
cd ../../backend
npm install
```

3. Set up environment variables:

```bash
# Frontend (.env.local)
cp frontend/simbrella-frontend/.env.example frontend/simbrella-frontend/.env.local

# Backend (.env)
cp backend/.env.example backend/.env
```

4. Start the development servers:

```bash
# Frontend
cd frontend/simbrella-frontend
npm run dev

# Backend
cd backend
npm run dev
```

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Architecture Decisions](docs/TECH_DECISIONS.md)
- [Development Guide](docs/DEVELOPMENT.md)

## 🧪 Testing

```bash
# Run frontend tests
cd frontend/simbrella-frontend
npm test

# Run backend tests
cd backend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ by the Simbrella Team
