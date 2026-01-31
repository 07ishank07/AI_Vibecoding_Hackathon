# AI Agent Project Guide - CrisisLink.cv

## Current Project State
✅ **FULLY OPERATIONAL** - All core systems running and tested

### Running Services
- Backend: `localhost:8000` (FastAPI + PostgreSQL)
- Frontend: `localhost:3000` (Next.js)
- Database: PostgreSQL in Docker container

### Start Command
```bash
docker-compose up
```

## Architecture Overview

### Backend (`/backend`)
- **FastAPI** with SQLAlchemy ORM
- **PostgreSQL** database with encrypted medical data
- **Key Services**:
  - `app/services/ai_voice.py` - TTS medical summaries
  - `app/services/notifications.py` - SMS alerts (demo mode)
  - `app/utils/encryption.py` - Medical data encryption
  - `app/utils/qr_generator.py` - QR code generation

### Frontend (`/frontend`)
- **Next.js 14** with TypeScript and Tailwind
- **Contextual Navigation System** - adapts based on page type
- **Pages**:
  - `/` - Landing page
  - `/create-profile` - 4-step profile wizard
  - `/emergency/[username]` - Emergency access (public/medical views)
  - `/dashboard` - User profile management
  - `/about` - Service information

### Navigation Logic (`/frontend/src/components/Navigation.tsx`)
```typescript
// Context-aware navigation:
// - Emergency pages: minimal nav (home only)
// - Public pages: full navigation
// - Medical professional: additional items
// - User dashboard: profile management items
```

## Database Schema
- **User**: id, username, hashed_password
- **MedicalProfile**: encrypted medical data, languages, blood_type
- **EmergencyContact**: name, phone, relation, priority
- **EmergencyAccess**: access logs with responder info

## Key Configuration Files
- `docker-compose.yml` - Container orchestration
- `.env` - API keys and secrets
- `backend/requirements.txt` - Python dependencies (includes email-validator fix)
- `frontend/package.json` - Node.js dependencies

## Known Issues & Fixes Applied
1. **Email validator import error** → Added `email-validator` to requirements.txt
2. **Twilio credentials missing** → Implemented demo mode fallback
3. **Navigation not showing** → Fixed import paths and component structure
4. **Frontend build errors** → Updated package.json with proper Next.js config

## Next Steps for AI Agents

### Immediate Priorities
1. **MCP Agents Integration** (`/mcp-agents/` directory exists but not connected)
2. **AI/ML API Integration** (TTS currently uses placeholder)
3. **Real Twilio Setup** (currently in demo mode)
4. **User Authentication** (registration/login flow)

### Development Workflow
1. **Backend changes**: Restart with `docker-compose restart backend`
2. **Frontend changes**: Auto-reload enabled in dev mode
3. **Database changes**: Migrations in `backend/alembic/`
4. **New dependencies**: Update requirements.txt or package.json

### Testing Endpoints
- Health: `curl localhost:8000/health`
- Emergency access: `curl localhost:8000/api/emergency/testuser`
- Frontend pages: Navigate to `localhost:3000/[page]`

### File Structure Guide
```
backend/
├── app/
│   ├── api/          # API routes
│   ├── models/       # SQLAlchemy models
│   ├── services/     # Business logic
│   └── utils/        # Utilities (encryption, QR)
frontend/
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # React components
│   └── lib/          # Utilities
mcp-agents/           # MCP agent definitions (not integrated)
```

### Common Agent Tasks
- **Adding new API endpoint**: Create in `backend/app/api/`
- **New frontend page**: Add to `frontend/src/app/`
- **Database changes**: Use SQLAlchemy models in `backend/app/models/`
- **Styling changes**: Use Tailwind classes
- **Navigation updates**: Modify `frontend/src/components/Navigation.tsx`

### Environment Variables Required
- `OLA_API_KEY` - .cv domain integration
- `AIML_API_KEY` - AI voice services
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` - SMS notifications
- `DATABASE_URL` - PostgreSQL connection

## Agent Collaboration Notes
- **Docker logs**: Use `docker-compose logs [service]` for debugging
- **Database access**: Connect to PostgreSQL container for direct queries
- **API testing**: Backend has OpenAPI docs at `localhost:8000/docs`
- **Frontend dev tools**: React DevTools compatible
- **Code style**: TypeScript strict mode, Tailwind for styling

## Emergency Contact for Issues
- All containers must be running for full functionality
- Frontend depends on backend API
- Database migrations may be needed for schema changes
- Navigation component is context-aware - check page props when modifying