# TrueVibe PWA Launch Guide

## Pre-Launch Checklist

### 1. Environment Setup

Ensure your `.env` file is properly configured with Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Build and Test

```bash
# Install dependencies if not already done
npm install

# Build the application
npm run build

# Preview the production build
npm run preview
```

Alternatively, use the provided script:
```bash
# Make the script executable
chmod +x ./scripts/build-and-preview.sh

# Run the script
./scripts/build-and-preview.sh
```

### 3. PWA Installation Testing

1. Open Chrome or another modern browser
2. Navigate to the preview URL (usually http://localhost:4173)
3. Look for the install icon in the address bar
4. Test installation on desktop
5. Test on mobile devices using a local network URL

## Testing Checklist

### Core Functionality

- [ ] **Authentication**
  - [ ] Sign up with email/password
  - [ ] Log in with existing account
  - [ ] Password reset flow
  - [ ] Session persistence

- [ ] **Profile**
  - [ ] Profile information displays correctly
  - [ ] Avatar upload works
  - [ ] Adjective tags show with correct emotion colors
  - [ ] Edit profile functionality works

- [ ] **Stories**
  - [ ] Stories carousel displays properly
  - [ ] Story creation works
  - [ ] Story viewing with tap navigation functions
  - [ ] 24-hour expiry works correctly

- [ ] **Threads**
  - [ ] Thread composer shows real-time emotion analysis
  - [ ] Creating threads works
  - [ ] Hashtag suggestions appear
  - [ ] Media upload functions correctly

### Loading States

- [ ] **LoadingScreen Component**
  - [ ] Appears during initial app load
  - [ ] Shows during authentication verification
  - [ ] Displays during profile data loading
  - [ ] Appears during thread submission
  - [ ] Shows during media uploads

### Performance

- [ ] **Speed**
  - [ ] Initial load time is reasonable
  - [ ] Navigation between tabs is smooth
  - [ ] Animations run at 60fps

- [ ] **Offline Capability**
  - [ ] App loads when offline (after initial load)
  - [ ] Cached content displays properly
  - [ ] Appropriate offline messages show

### Responsive Design

- [ ] **Mobile**
  - [ ] All components render correctly on small screens
  - [ ] Touch targets are appropriately sized
  - [ ] Bottom navigation is accessible

- [ ] **Tablet/Desktop**
  - [ ] Layout adapts appropriately to larger screens
  - [ ] Navigation remains intuitive

## Known Limitations

- Vibes tab is marked as Phase 2 and not yet implemented
- Thread feed is still in progress
- Five-reaction system implementation is ongoing

## Gathering Feedback

As you test the application, consider the following questions:

1. Does the emotion-aware UI feel intuitive and meaningful?
2. Are the loading states providing a smooth user experience?
3. Does the PWA installation process work seamlessly?
4. Is the application responsive across different device sizes?
5. Are there any performance bottlenecks or UI glitches?

Document your findings to prioritize post-launch improvements.
