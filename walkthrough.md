# Security Summary

This document summarizes the production security hardening applied to **Meow** (`com.meow.app`) across HTML rendering, URL/deep-link handling, file uploads, OTA/APK updates, release signing, and production bundle hygiene.

## Key Protections Applied

1. **HTML & Attribute Escaping Across All Templates (`src/utils/sanitize.ts`)**
   - Every dynamic user, pet, clinic, store, notification, group, and chat field interpolated into DOM strings now passes through `escapeHtml()` or `escapeAttr()`.
   - This prevents untrusted display names, bios, pet notes, or chat text from injecting active HTML or event attributes into the webview.

2. **Strict URL, Image, Audio & Phone Allowlists (`src/utils/sanitize.ts`)**
   - External links and media URLs are filtered through `sanitizeUrl()` and `sanitizeImageSrc()`, permitting only `https:`, `http:`, `blob:`, relative paths, or safe base64 raster image data URLs (rejecting `javascript:`, `vbscript:`, control-character obfuscation, and arbitrary inline SVG scripts).
   - Audio playback sources in chat (`sanitizeAudioSrc()`) only permit safe `data:audio/...;base64` payloads or `http(s):`/`blob:` URLs, and phone links (`sanitizeTelUrl()`) strip non-dialable characters.
   - Native Android OAuth callbacks (`isSafeDeepLink()`) accept only the registered `com.meow.app://auth-callback` scheme or the active HTTPS origin.

3. **File Upload Validation & Development-Only Guardrails**
   - Profile avatars, pet photos, chat attachments, and custom stickers are checked by `validateUploadedFile()` for non-empty size, maximum byte limits (8 MB for images, 10 MB for documents/audio), and allowed MIME types.
   - Development fallback voice-note simulation in `ChatView.ts` and the optional `?xr` dev overlay in `src/index.ts` are strictly gated behind `import.meta.env.DEV`, and `vite.config.ts` forces `import.meta.env.DEV = false` during production builds so simulator/fallback paths are eliminated from release bundles.
   - Dev-only AI Studio static assets under `public/assets/aistudio/` were deleted and excluded from production outputs.

4. **Signed Release Builds & Self-Hosted HTTPS Updates**
   - Release Android builds (`android/app/build.gradle`) require R8 minification/resource shrinking (`minifyEnabled true`, `shrinkResources true`) and fail fast if release signing secrets are absent.
   - In GitHub Actions (`android-release-apk.yml`), the Base64 keystore is decoded only into `$RUNNER_TEMP` during the Gradle signing step and removed unconditionally in an `if: always()` cleanup step without ever entering the repository or workspace.
   - Self-hosted OTA bundles (`capacitor.config.ts`, `src/services/updateService.ts`) enforce `httpsOnly: true` for production downloads, gate manifests by channel and native semver bounds (`minNativeVersion` / `maxNativeVersion`), and verify bundle startup with `CapacitorUpdater.notifyAppReady()` for automatic rollback protection.

---

## PoC Verification

All local verification checks below were executed in the workspace (`/app/applet`) after final source, Vite, and test updates:

- **Sanitization, Upload, Update & Auth Tests (`npm test` -> `vitest run`)**:
  - **Passed (5 test files, 20 tests)** covering:
    - `tests/sanitize.test.ts` (7 tests): confirmed `<img ... onerror=...>` escaping, rejection of `javascript:`, `vbscript:`, `data:text/html`, and arbitrary SVG data URLs, phone link stripping, MIME/size rejection for unsupported uploads (`.svg`, `.html`, empty/oversized files), and strict deep-link scheme verification.
    - `tests/updateService.test.ts` (4 tests): confirmed rejection of non-HTTPS OTA bundle URLs, channel mismatch isolation (`production` vs `testing`), native semver gating, and `minSupportedVersion` mandatory APK triggers.
    - `tests/otpRecovery.test.ts` (4 tests): confirmed email validation, 45-second per-email OTP resend cooldown, and 6-digit numeric token sanitization before `verifyOtp`.
    - `tests/classifyReleaseChange.test.ts` (4 tests): confirmed native vs web-only vs docs/test path classification for CI release routing.
    - `tests/splash.test.ts` (1 test): confirmed splash screen 3000ms minimum hold and blocked premature skips.

- **Static Type & Lint Checks (`npm run typecheck` & `npm run lint:eslint`)**:
  - `tsc --noEmit` completed with **0 errors**.
  - `eslint .` (including `@firebase/eslint-plugin-security-rules`) completed with **0 errors**.

- **Production Bundle & Capacitor Sync Verification (`npm run build` & `npx cap sync android`)**:
  - `vite build` transformed 116 modules cleanly into `dist/` with `sourcemap: false`.
  - Scanning `dist/` confirmed zero occurrences of `xrblocks`, `aistudio`, `CatScene`, `sendFallbackVoiceNote`, `SERVICE_ROLE`, or `BEGIN PRIVATE KEY`.
  - `npx cap sync android` updated `android/app/src/main/assets/public` and registered `@capacitor/app@8.1.2`, `@capacitor/browser@8.0.5`, and `@capgo/capacitor-updater@8.54.2`.

- **Checks Pending CI / External Environment**:
  - `npm audit` could not run locally because this project uses `bun.lock` rather than `package-lock.json` (`ENOLOCK`).
  - Full Android Gradle signing (`./gradlew assembleRelease bundleRelease`), GitHub Pages OTA publishing, Google OAuth PKCE redirect on device, and Supabase live 6-digit OTP email delivery require GitHub Actions secrets and a physical Android device to verify end-to-end.
