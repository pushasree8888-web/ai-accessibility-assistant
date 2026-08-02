# AI Accessibility Assistant (Frontend)

Built with React + Vite + Supabase Authentication.

## Features
- **Vision Assistant**: Image description and text extraction.
- **Hearing Assistant**: Real-time speech-to-text captions and audio controls.
- **Communication Assistant**: Text-to-speech reading with speed controls.
- **Authentication**: Supabase Auth (Email/Password & Google OAuth) with session persistence and protected route navigation.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run local dev server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
