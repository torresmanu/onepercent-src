# Build Local Command

Interactive command to build the OnePercent application locally.

## What it does

When you run this command, you'll be prompted to choose:
1. **Frontend only** - Builds Angular/Ionic app with local configuration
2. **Backend only** - Builds NestJS API
3. **Both** - Builds both frontend and backend sequentially

## Build Commands Used

- **Frontend**: `npm run build:local` (uses Angular local configuration)
- **Backend**: `npm run build` (creates production-ready NestJS build)

## Output

- Frontend build output: `onepercentapp-fe/www/`
- Backend build output: `onepercentapp-be/dist/`

## Usage

Simply run the "Build Local" command from Cursor's command palette (Cmd/Ctrl + Shift + P) and follow the interactive prompts.

