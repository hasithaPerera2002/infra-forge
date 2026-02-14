# InfraForge

> AI-powered visual infrastructure builder that generates production-ready Terraform code with best practices.

InfraForge combines a drag-and-drop canvas with an intelligent AI agent that asks questions, validates architecture, and generates enterprise-grade Infrastructure as Code — the kind of code senior DevOps engineers would actually write.

![InfraForge](https://img.shields.io/badge/status-MVP-yellow)
![Terraform](https://img.shields.io/badge/Terraform-1.5+-623CE4?logo=terraform)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)

## Why InfraForge?

Existing tools like Cloudcraft and Brainboard generate toy-level code. InfraForge uses AI to:

- **Understand requirements** through intelligent questioning
- **Apply best practices** (multi-AZ, encryption, least-privilege IAM)
- **Optimize costs** with reserved instances, spot instances, and right-sizing
- **Enforce security** (no 0.0.0.0/0 on sensitive ports, encryption everywhere)
- **Generate production-ready code** with proper structure, variables, and modules

## Quick Start

```bash
# Clone and start
git clone https://github.com/your-org/infra-forge.git
cd infra-forge

# Using Docker (recommended)
docker-compose up -d

# Or run locally (use two terminals)
# Terminal 1 - Backend
cd packages/backend && npm install && npm run dev

# Terminal 2 - Frontend
cd packages/frontend && npm install && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to access the visual builder.

## Project Structure

```
infraforge/
├── packages/
│   ├── frontend/     # React + Vite + React Flow
│   └── backend/      # Node.js + Express
└── docker-compose.yml
```

## Features

### Phase 1 (MVP)
- [x] Drag-and-drop canvas with React Flow
- [x] Core components: EC2, RDS, ALB, VPC, S3
- [x] Terraform generation with production-ready templates
- [x] Cost estimation with AWS pricing

### Phase 2
- [ ] AI agent with intelligent questioning
- [ ] Security validation and best practices
- [ ] Conversational architecture design
- [ ] Cost optimization suggestions

### Phase 3
- [ ] User accounts and project persistence
- [ ] Export Terraform as ZIP
- [ ] Deployment guide generation

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, React Flow, TailwindCSS, Zustand |
| Backend | Node.js, Express, TypeScript |
| AI | Anthropic Claude API (planned) |
| IaC | Terraform 1.5+ |

## Environment Variables

```bash
# Backend
PORT=8000                       # Server port (default: 8000)

# Frontend (optional)
VITE_API_URL=http://localhost:8000   # API URL for production build
```

## License

MIT License - see [LICENSE](LICENSE) for details.
