# MemorIA Mobile App Strategy & Guide

## 1. Mobile App Strategy and Vision
The MemorIA mobile app is designed to be the primary touchpoint for capturing, organizing, and reliving memories. While the web platform excels at deep organization and long-form story editing, the mobile app focuses on immediacy, native device capabilities, and on-the-go consumption. Our vision is to make memory preservation as frictionless as taking a photo.

## 2. Feature Parity with Web Version
The mobile app maintains core feature parity with the web platform while introducing mobile-exclusive enhancements:
- **Core Parity:** AI story generation, media gallery, timeline view, family sharing, and subscription management.
- **Mobile Exclusives:** Native camera integration, offline access, push notifications, and biometric security.
- **Web Exclusives (for now):** Advanced bulk metadata editing, high-resolution PDF exports, and complex legacy management settings.

## 3. Mobile-Specific Optimizations and Native Features
- **Offline Access:** Critical stories and recent memories are cached locally using SQLite/Realm, allowing users to view their narratives without an internet connection.
- **Push Notifications:** Real-time alerts for family comments, shared memories, and completed AI story generations.
- **Native Camera:** Direct integration with iOS/Android camera APIs for optimized capture, ensuring metadata (location, time) is perfectly preserved.
- **Biometric Auth:** Face ID (iOS) and Fingerprint (Android) integration for securing private memories and legacy settings.
- **Haptic Feedback:** Subtle vibrations during key interactions (e.g., saving a story, deleting a memory) to enhance tactile feel.

## 4. App Store Submission Guidelines
- **Apple App Store:** 
  - Ensure all privacy policies are clearly linked within the app.
  - Implement "Sign in with Apple" as it is mandatory when other social logins are present.
  - Clearly explain the use of camera, photo library, and biometric permissions in the `Info.plist`.
- **Google Play Store:**
  - Adhere to Material Design guidelines for Android-specific UI elements.
  - Ensure background processing (for media uploads) complies with Android's battery optimization rules.
  - Provide clear data deletion options within the app settings.

## 5. Cross-Platform Sync Architecture
- **API Sync:** Mobile talks to the Express `/hcgi/api` layer (JWT auth + MySQL) shared with the web app; poll or push updates rather than relying on a separate realtime DB product.
- **Conflict Resolution:** Last-write-wins strategy for metadata edits, with versioning for long-form stories to prevent accidental data loss.
- **Background Uploads:** Media files are queued and uploaded in the background, resilient to network drops, using native background task APIs.

## 6. Performance Benchmarks and Optimization Tips
- **Image Loading:** Use WebP format and request appropriately sized images from `/uploads` (or a CDN in front of them) to minimize bandwidth and memory usage.
- **List Rendering:** Implement virtualized lists (e.g., FlashList in React Native) for the media gallery to maintain 60fps even with thousands of photos.
- **Bundle Size:** Keep the initial download size under 50MB by lazy-loading non-critical modules and optimizing asset compression.

## 7. Security Best Practices for Mobile
- **Secure Storage:** Store authentication tokens and encryption keys in the iOS Keychain and Android Keystore. Never use plain `AsyncStorage` or `SharedPreferences` for sensitive data.
- **Certificate Pinning:** Implement SSL pinning to prevent Man-in-the-Middle (MITM) attacks.
- **Screen Shielding:** Blur or hide the app preview in the OS task switcher to protect sensitive memories from shoulder surfing.

## 8. Future Roadmap for App Development
- **Q3 2026:** Launch AR (Augmented Reality) memory viewing—place your stories in physical locations.
- **Q4 2026:** On-device AI processing for basic image tagging to enhance privacy and reduce server load.
- **Q1 2027:** Collaborative live-editing of stories with family members via mobile.
- **Q2 2027:** Integration with smartwatches for quick voice-memo capture and notification management.