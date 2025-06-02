# TrueVibe - Emotion-Aware Social Media PWA

## Project Overview

TrueVibe is a revolutionary social media Progressive Web App (PWA) that prioritizes emotional intelligence over engagement manipulation. Unlike traditional platforms that rely on simple like/dislike systems, TrueVibe uses sophisticated emotion detection algorithms to create meaningful human connections through psychological research-backed interactions.

## Key Features

### Core Innovation: The Five-Reaction System

Traditional social media reduces complex human emotions to binary reactions. TrueVibe introduces five nuanced reactions that encourage thoughtful engagement:

1. **Resonate** - "I feel the same way"
2. **Support** - "I'm here for you"
3. **Learn** - "Help me understand"
4. **Challenge** - "I respectfully disagree"
5. **Amplify** - "This needs to be heard"

### Implemented Components

- **Authentication System**: Email/password signup with validation
- **Profile Header**: Circular avatar upload, adjective tags, and social stats
- **Stories Carousel**: Instagram-style 24-hour expiring stories with emotion themes
- **Thread Composer**: Real-time emotion analysis as users type
- **Navigation System**: Top bar and bottom tabs with notification badges
- **Loading Screen**: Emotion-themed loading animations throughout the app

## Technical Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS v3 with Plutchik emotion color palette
- **State Management**: Zustand
- **PWA**: Vite PWA plugin with service workers
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Emotion Detection**: Enhanced VADER sentiment analysis

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Database Schema

The application uses the following core tables in Supabase:

- **user_profiles**: User data with adjectives
- **threads**: Emotion-aware posts
- **comments**: Threaded comments with reaction context
- **reactions**: Five-reaction system data
- **stories**: 24-hour expiring stories

## Current Status

The application has the following components implemented:

- [x] Authentication and user profiles
- [x] Profile Header with avatar upload
- [x] Stories Carousel with emotion themes
- [x] Thread Composer with real-time emotion analysis
- [x] Navigation system (TopBar and BottomTabs)
- [x] Loading Screen with emotion animations
- [ ] Thread Feed (in progress)
- [ ] Five-reaction system (in progress)
- [ ] Vibes tab (Phase 2)

## License

This project is proprietary and confidential.
