# CrisisLink.cv - Your Life Passport

## 🚨 The Problem
250,000+ preventable deaths occur annually due to delayed access to medical information in emergencies.

## 💡 Our Solution
Scan QR code → Instant medical info + AI voice assistant + Auto-notify family

## 🛠️ Tech Stack
- **Backend**: Python FastAPI, PostgreSQL
- **Frontend**: Next.js, TypeScript, Tailwind
- **AI**: AI/ML API, CometAPI (translation, TTS)
- **Infrastructure**: Daytona (secure sandboxed backend)
- **Identity**: .cv domains
- **MCP**: LeanMCP (5 AI agents)
- **Security**: Nord Security suite (encryption)

## 🏃 Quick Start
```bash
docker-compose up
```

**Services:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Status:** ✅ All systems operational

## 📱 How It Works
1. **Create Profile**: Visit `/create-profile` for 4-step wizard
2. **Generate QR Code**: Automatic QR generation for wallet/ID
3. **Emergency Access**: Scan QR → `/emergency/[username]`
4. **AI Voice**: Medical summary in responder's language
5. **Auto-Notify**: SMS alerts to emergency contacts

## 🎯 Current Features
- ✅ **Profile Creation**: 4-step wizard (Basic Info, Medical, Contacts, Privacy)
- ✅ **Emergency Access**: Public + Medical Professional views
- ✅ **Contextual Navigation**: Adapts based on page type and user role
- ✅ **Encrypted Storage**: Medical data secured with Fernet encryption
- ✅ **QR Code Generation**: Base64 PNG codes for emergency access
- ✅ **Demo Notifications**: SMS system ready (demo mode)
- ✅ **Responsive Design**: Mobile and desktop optimized

## 🏆 Hackathon Integration
- ✅ **Daytona**: Entire backend runs in secure workspace
- 🔄 **LeanMCP**: 5 MCP agents defined (integration pending)
- 🔄 **AI/ML API**: Translation + TTS (placeholder implementation)
- ✅ **Docker**: Full containerization with PostgreSQL
- ✅ **TypeScript**: Full-stack type safety
- ✅ **Security**: Encrypted medical data storage

## 🛠️ Development Status

### ✅ Completed
- Docker containerization (Backend, Frontend, Database)
- FastAPI backend with SQLAlchemy ORM
- Next.js frontend with TypeScript
- Contextual navigation system
- Profile creation wizard
- Emergency access pages
- Medical data encryption
- QR code generation
- Demo notification system

### 🔄 In Progress
- MCP agents integration
- Real AI/ML API connection
- User authentication system
- Twilio SMS integration

### 📋 Next Steps
- Connect MCP agents to backend
- Implement user registration/login
- Add real TTS/translation APIs
- Deploy to production environment


Technical Specification: CrisisLink.cv
CrisisLink.cv is a specialized "Emergency Life Passport" system designed to provide instant, secure access to medical information during emergencies via QR codes and .cv domains.

1. System Architecture
The application follows a modern decoupled architecture:

Backend: FastAPI (Python 3.11) with SQLAlchemy ORM.
Frontend: Next.js (TypeScript) with Tailwind CSS.
Database: PostgreSQL for persistent storage.
Identity Layer: Integrated with the Ola API for .cv domain resolution and identity mapping.
AI/Agent Layer: LeanMCP orchestration for specialized emergency agents.
2. Core Components
2.1 Backend Services
app.main: Entry point for FastAPI, managing CORS, middleware, and router inclusion.
app.config: Centralized settings via Pydantic BaseSettings, loading from 
.env
.
app.database: SQLAlchemy engine and session management.
2.2 Domain Logic & Services
AI Voice (app.services.ai_voice): Generates emergency speech using the AIML API (TTS). It constructs a standardized medical summary.
Notifications (app.services.notifications): Integrates with Twilio for automated SMS alerts to emergency contacts when a profile is accessed.
Encryption (app.utils.encryption): Uses Fernet (symmetric encryption) to secure sensitive medical data (allergies, medications, medical_conditions) before storage.
QR Generator (app.utils.qr_generator): Creates base64-encoded PNG QR codes pointing to crisislink.cv/username.
3. Data Schema (SQLAlchemy)
User
id (UUID): Primary key.
username (String): Unique identifier and .cv subpath.
hashed_password (String): Securely stored credentials.
MedicalProfile
user_id (ForeignKey): Links to 
User
.
full_name, date_of_birth, blood_type: Publicly accessible emergency info.
allergies, medications, medical_conditions: Encrypted text blobs.
languages: JSON array of spoken languages for the AI Voice agent.
EmergencyContact
user_id (ForeignKey): Owner of the contact.
name, phone, email: Contact details.
relation (String): The relationship type (renamed from relationship to avoid SQLAlchemy shadowing).
priority (Integer): Order of notification.
EmergencyAccess
user_id (ForeignKey): Target profile.
responder_info: Metadata about the person accessing the profile (IP/Agent).
access_type: qr_scan or url_access.
4. Identity & Deployment
Identity Layer (
cv.json
)
The project includes a root manifest mapping the app to the .cv ecosystem:

Defines the crisislink.cv domain.
Maps the OLA_API_KEY for identity layer authentication.
Infrastructure
Docker: Containerized services for Postgres, Backend, and Frontend.
Environment: Root 
.env
 handles secrets like OLA_API_KEY, AIML_API_KEY, and TWILIO_AUTH_TOKEN.
5. Agentic Framework (MCP)
Located in mcp-agents/, providing specialized logic:

Crisis Analyzer: Evaluates the severity of reported incidents.
Medical Retriever: Fetches relevant patient history from the encrypted vault.
Translator: Bridges language gaps between patients and responders.
Mental Health Router: Specialized routing for psychological crises.
Contact Dispatcher: Manages the priority queue for notifications.
6. API Endpoints
POST /api/profiles/: Create and encrypt a new medical profile + generate QR.
GET /api/emergency/{username}: Public endpoint for responders; returns decrypted data and triggers notifications.
GET /api/emergency/{username}/voice: Returns a voice-ready medical brief.
GET /health: System health monitoring.