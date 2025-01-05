# Neuronix

Neuronix is an advanced no-code AI agent creation platform that enables robust, secure workflow design for intelligent automation.

## Features

- 🤖 No-code AI Agent Creation
- 🔄 Visual Workflow Designer
- 🛡️ Enhanced Security Protocols
- 📊 Multi-platform Export
- 🔌 Seamless Integration Capabilities
- 🎨 Modern React Frontend
- 🚀 Express.js Backend
- 💾 PostgreSQL Database

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, ShadcnUI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query
- **Workflow Design**: ReactFlow
- **Authentication**: Passport.js
- **Type Safety**: Zod, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/neuronix.git
cd neuronix
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file with the following variables
DATABASE_URL=postgresql://user:password@localhost:5432/neuronix
```

4. Push the database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run check` - Run TypeScript checks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
