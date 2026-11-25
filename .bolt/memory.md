# Project memory

## Product intent & audience

- Pet management app for Arabic-speaking pet owners (Egypt-focused)
- Tagline: "كل الي حيوانك الأليف محتاجه في مكان واحد" (Everything your pet needs in one place)
- Credited to Mohamed Gamil
- Onboarding is required; no skip option; sequential flow only

## Brand personality & voice

- Arabic-first UI (RTL layout expected)
- Friendly, approachable tone; mascot imagery used in onboarding
- Localized for Egypt: phone numbers (+20 prefix), Egypt geo cascade (governorate → markaz → city → village)

## Visual design & UX direction

- Onboarding flow: 6 sequential screens (Splash → Welcome → Auth Method → Owner Details → Has Pet → Pet Details)
- Splash: full-screen logo, auto-advances after ~7s
- Step-dot navigation: backwards only (correct for required sequential flow)
- Auth screen bundles login/signup, forgot-password, OTP recovery, and password-reset sub-views in one large function
- Apple sign-in button permanently disabled with "قريبًا" (coming soon) badge — intentional
- Google sign-in delegates to `signInWithGoogleSupabaseOAuth` (native Android Credential Manager + browser fallback)
- Owner-details form reused for later editing via `renderOwnerEditView`
- Pet details: species (cat/dog), 3 photo slots, name, color, breed, hybrid flag, age, gender, vaccination status, 3–6 personality traits, notes

## Decisions, constraints & rationale

- Framework: DEFAULT_TO_DEV
- Auth via Supabase (`supabaseAuthService.ts`)
- Terms checkbox is signup-only and required before submit
- Recovery cooldown timer uses raw `setInterval`; must be stopped on step changes
- `OnboardingView.ts` uses heavy module-level mutable state (`authMode`, `authSubView`, `authEmail`, flags, cooldown timers, form drafts) — edits ripple across all auth sub-screens
- `renderAuthMethodStep` is ~560 lines bundling 4 sub-screens — highest-risk area for modifications
- User workflow: review-only requests here; actual edits made locally outside this environment; revert if something breaks

## Open questions & assumptions

- User plans to make edits inside the codebase directly, not through this assistant
- Specific planned changes not yet disclosed
- No `.bolt/prompt` authoritative instructions exist yet
- App scope beyond onboarding/registration not yet reviewed