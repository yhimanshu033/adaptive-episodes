# ✍️ Co-Writing Platform

> **Write smart. Write fast. Go global.**

A comprehensive AI-powered writing platform designed for collaborative
storytelling with advanced editing features, multi-language adaptation, and
role-based access control.

## 🚀 Features

### 🤖 AI-Powered Writing Assistant (StoryChat AI)

- **Content Review**: Intelligent analysis and feedback on your writing
- **Writing Enhancement**: AI suggestions for tone consistency, character
  development, and plot progression
- **Story Explorer**: Complete overview of characters, arcs, locations, and
  story elements
- **AI Copilot**: Real-time writing assistance to overcome writer's block
- **Metadata Sync**: Automatic story detail updates for better AI assistance

### 🌍 Multi-Language Support

- **10+ Language Adaptation**: Seamlessly adapt stories to different languages
- **Localization Features**: Perfect local adaptations (e.g., "Ram" in India
  becomes "Stepané" in France)
- **Language Version Management**: Switch between different language versions
  effortlessly
- **Google Sheets Integration**: Sync localization data for streamlined
  translation workflows

### 👥 Collaborative Writing

- **Real-time Collaboration**: Build your dream team of writers, editors, and
  friends
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full project management capabilities
  - **Lead**: Advanced editing and team management
  - **Writer**: Content creation and editing
  - **Reader**: View-only access
- **Project Management**: Comprehensive member and permission management
- **Comments & Notes**: Collaborative feedback and annotation system

### ⚡ Advanced Editor

- **Dual View Mode**: Toggle between writing and preview modes
- **Rich Text Editing**: Powered by Plate.js with extensive formatting options
- **Version Control**: Track changes and manage different episode versions
- **Auto-save**: Never lose your work with automatic saving
- **Drag & Drop**: Intuitive content organization

### 📊 Story Management

- **Episode Organization**: Structured approach to story episodes and chapters
- **Status Tracking**: Monitor progress across different stages
- **Series Showcase**: Display successful stories with play counts
- **Import/Export**: Flexible content management options
- **Analytics Dashboard**: Track writing productivity and team performance

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 18** - Modern React with concurrent features
- **Plate.js 49.1.5** - Rich text editor framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives

### State Management & Data

- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **IndexedDB** - Client-side data persistence

### Backend Integration

- **Next Auth** - Authentication system
- **Socket.io** - Real-time communication
- **RESTful APIs** - Backend service integration

### Development Tools

- **ESLint & Prettier** - Code formatting and linting
- **Husky** - Git hooks for code quality
- **Commitlint** - Conventional commit messages
- **TypeScript** - Static type checking

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel routes
│   ├── auth/              # Authentication pages
│   ├── projects/          # Project management
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── plate-ui/          # Editor-specific components
│   └── aural-ui/          # Custom design system
├── page-builders/         # Page-specific components
│   ├── landing/           # Landing page sections
│   ├── episodes/          # Episode management
│   ├── admin/             # Admin functionality
│   └── plate-editor/      # Rich text editor
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── store/                 # State management
├── types/                 # TypeScript definitions
├── constants/             # Application constants
└── providers/             # Context providers
```

## 🚦 Getting Started

### Prerequisites

- Node.js 22+
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd co-writing
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Configure your environment variables
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser** Navigate to
   [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Check Prettier formatting
npm run format:fix   # Fix Prettier formatting
npm run commit       # Interactive commit with commitizen
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET=your-nextauth-secret

# Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000/

# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=https://copilot-prod.pocketfm.com
NEXT_PUBLIC_SOCKET_URL=https://copilot-socket.pocketfm.com
NEXT_PUBLIC_PROMOS_BACKEND_URL=https://pocketfm-copilot-promo-api.pocketfm.com

# API Keys
NEXT_PUBLIC_BACKEND_API_KEY=your-backend-api-key
NEXT_PUBLIC_LASERTOOLS_API_KEY=your-lasertools-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key

# Development Tools
REACT_EDITOR=atom

# Optional: Sentry Configuration (for error tracking)
# NEXT_PUBLIC_SENTRY_DSN_URL=your-sentry-dsn-url
# SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

> **⚠️ Important**: Never commit your actual `.env` file to version control.
> Create a `.env.example` file with placeholder values for team members.

### Backend Environments

The platform supports multiple backend environments:

- **Production**: `copilot-prod.pocketfm.com` - Main production environment
- **Socket Server**: `copilot-socket.pocketfm.com` - Real-time communication
- **Promo API**: `pocketfm-copilot-promo-api.pocketfm.com` - Promotional content
  management
- **Development**: Cloudflare tunnels for local development

### Third-Party Integrations

- **Google OAuth**: User authentication and authorization
- **Google Sheets**: Localization data synchronization
- **Google Drive**: File storage and management
- **ElevenLabs**: AI voice generation for audio content
- **Sentry**: Error tracking and monitoring (optional)

### Customization

- **Themes**: Customize themes in `src/styles/globals.css`
- **Constants**: Modify application constants in `src/constants/`
- **Components**: Extend UI components in `src/components/`

## 📱 Key Features in Detail

### AI Writing Assistant

The platform includes a sophisticated AI chatbot that provides:

- Real-time writing suggestions
- Character development advice
- Plot consistency checks
- Dialogue enhancement
- Scene structure recommendations

### Multi-Language Workflow

1. Create your story in the original language
2. Use AI-powered translation suggestions
3. Localize content for specific regions
4. Manage multiple language versions
5. Sync changes across all versions

### Collaborative Editing

- Multiple users can edit simultaneously
- Track individual contributions
- Comment and suggestion system
- Version history and conflict resolution
- Role-based permissions

## 🔐 Security & Permissions

The platform implements comprehensive RBAC:

- **Project-level permissions**
- **Language-specific access control**
- **Feature-based restrictions**
- **Secure authentication**
- **Data protection**

## 🌟 Success Stories

The platform has been used to create successful series with millions of plays:

- "My Vampire System" - 9.1M plays
- "Saving Nora" - 7.7M plays
- "The Billionaire's Accidental Bride" - 8.1M plays

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows
[Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/updates
- `chore:` - Maintenance tasks

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:

- Create an issue in this repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for writers who want to create amazing stories**
