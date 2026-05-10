# Known Issues & Resolutions

## Resolved in this Session

### 1. 404 - Missing noise texture (`/noise-texture.png`)
- **Origin**: `src/app/page.tsx:58` referenced a non-existent file
- **Fix**: Created `public/noise-texture.svg` and defined `.bg-noise` CSS class in `globals.css`
- **Status**: ✅ Fixed

### 2. WebGL Shader Warnings (X4122, X4008)
- **Origin**: `Environment` HDR processing + PBR shader precision on Windows/ANGLE
- **Fix**: Changed `preset="city"` → `preset="studio"` with `environmentIntensity={0.4}`, added `gl` options for performance
- **Status**: ✅ Mitigated (warnings may still appear on some drivers due to platform-level precision limits)

## Unrelated Issues Found (in unused components)

- `EmailVerification.tsx`: Missing import (`getTokenExpirySeconds`), invalid JSX comment
- `CinematicExperience.tsx`: Component never imported/rendered, scroll animations inactive

These don't affect the current site operation.