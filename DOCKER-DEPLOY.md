# Vault Access - Self-Hosted Deployment

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git

### 1. Clone and Configure

```bash
# Clone the repository
git clone <your-repo-url>
cd vault-access

# Copy environment file
cp .env.example .env

# Edit .env with your secure passwords
nano .env
```

### 2. Generate Secure Keys

```bash
# Generate a secure JWT secret
openssl rand -base64 32

# Generate a secure database password
openssl rand -base64 24
```

Update these values in your `.env` file.

### 3. Start the Stack

```bash
# Build and start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

### 4. Access Your App

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8000
- **Database**: localhost:5432

## 📦 Services Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐     ┌─────────────┐                    │
│  │   Frontend  │     │    Kong     │ :8000              │
│  │   (Nginx)   │────▶│  API Gateway│                    │
│  │   :3000     │     └──────┬──────┘                    │
│  └─────────────┘            │                           │
│                             ▼                           │
│         ┌─────────────────────────────────┐             │
│         │                                 │             │
│    ┌────┴────┐  ┌──────────┐  ┌─────────┐│             │
│    │  Auth   │  │   REST   │  │Realtime ││             │
│    │(GoTrue) │  │(PostgREST│  │         ││             │
│    │  :9999  │  │  :3000   │  │ :4000   ││             │
│    └────┬────┘  └────┬─────┘  └────┬────┘│             │
│         │            │             │      │             │
│         └────────────┼─────────────┘      │             │
│                      ▼                    │             │
│              ┌──────────────┐             │             │
│              │  PostgreSQL  │◀────────────┘             │
│              │    :5432     │                           │
│              └──────────────┘                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Configuration

### Update Frontend Supabase Client

After deployment, update `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:8000'; // Your API Gateway URL
const supabaseAnonKey = 'your-anon-key-from-env';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Production Deployment

For production, you'll need:

1. **Reverse Proxy (Traefik/Nginx)** with SSL
2. **Domain Names** configured
3. **Secure Passwords** in `.env`
4. **SMTP Configuration** for email verification

Example with custom domain:

```env
API_EXTERNAL_URL=https://api.yourdomain.com
SITE_URL=https://vault.yourdomain.com
```

## 🔐 Security Checklist

- [ ] Change all default passwords in `.env`
- [ ] Generate new JWT secret with `openssl rand -base64 32`
- [ ] Generate new API keys for production
- [ ] Enable HTTPS with SSL certificates
- [ ] Configure firewall rules
- [ ] Set up regular database backups
- [ ] Disable email auto-confirm and configure SMTP

## 📊 Useful Commands

```bash
# View logs
docker-compose logs -f vault-access-app
docker-compose logs -f vault-db

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Database shell
docker exec -it vault-db psql -U postgres

# Backup database
docker exec vault-db pg_dump -U postgres postgres > backup.sql

# Restore database
cat backup.sql | docker exec -i vault-db psql -U postgres postgres
```

## 🆘 Troubleshooting

### Database connection issues
```bash
# Check if database is healthy
docker-compose ps
docker-compose logs vault-db
```

### Auth not working
```bash
# Check auth service logs
docker-compose logs vault-auth

# Verify JWT secret matches everywhere
```

### API returning 401
- Verify ANON_KEY matches in frontend and kong.yml
- Check JWT_SECRET is the same across all services
