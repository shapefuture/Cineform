Okay, here is a single block of terminal commands designed to scaffold the basic directory structure and initialize the packages for Phase 0 of the Cineform Forge project.

Important Considerations Before Running:

Prerequisites: You MUST have Node.js and npm (or pnpm/yarn) installed and available in your terminal's PATH.

Package Manager: This script uses npm. If you prefer pnpm or yarn, you will need to adjust the install and potentially init commands accordingly.

Turborepo Interaction: The npx create-turbo command is interactive. You will need to answer its prompts (choose npm, confirm directory).

Manual Steps Required: This script ONLY sets up directories, initializes basic package files, and installs initial dependencies. It DOES NOT populate configuration files (.eslintrc.js, .prettierrc.js, tsconfig.json details beyond init, .gitignore, ci.yml) or source files (*.ts interfaces) with complex content, nor does it fully configure all package.json fields (like scripts or workspace dependencies). You MUST perform manual steps after running this script.

Error Handling: This is a basic script. If any command fails, subsequent commands might not work as expected. Run it in a clean environment.

Windows Users: The rm -rf command might need to be replaced with rd /s /q or handled manually if errors occur.

Copy and Paste the entire block below into your terminal:

# --- Cineform Forge Scaffolding Script (Phase 0) ---

# Prerequisites: Ensure Node.js and npm (or pnpm/yarn) are installed.

# 1. Create Project Directory & Initialize Turborepo
echo ">>> Step 1: Creating project and initializing Turborepo..."
# IMPORTANT: Answer the prompts from create-turbo (choose npm, confirm directory)
npx create-turbo@latest cineform-forge || { echo "Turborepo initialization failed."; exit 1; }
cd cineform-forge || { echo "Failed to enter project directory."; exit 1; }
echo ">>> Turborepo initialized. Cleaning placeholder packages..."
# Clean placeholder apps/packages (use rd /s /q on Windows if rm fails)
rm -rf apps/*
rm -rf packages/*
echo ">>> Placeholders cleaned."

# 2. Create Core Package Directories
echo ">>> Step 2: Creating core package directories..."
mkdir -p packages/engine packages/ai-assistant packages/shared-types packages/testing-utils packages/templates-library apps/webapp || { echo "Failed to create directories."; exit 1; }
echo ">>> Directories created."

# 3. Initialize 'shared-types' Package
echo ">>> Step 3: Initializing 'shared-types'..."
cd packages/shared-types || exit 1
npm init -y
npm install --save-dev typescript@^5 @types/node@^20 || { echo "'shared-types' dependency install failed."; exit 1; }
npx tsc --init --rootDir src --outDir dist --declaration true --declarationMap true --sourceMap true --moduleResolution node --esModuleInterop true --target ES2020 --module ESNext --lib "[\"ES2020\", \"DOM\"]" || { echo "'shared-types' tsconfig init failed."; exit 1; }
mkdir src dist
touch src/index.ts
touch .eslintrc.js # Placeholder
cd ../.. # Back to root

# 4. Initialize Other Library Packages (engine, ai-assistant, testing-utils, templates-library)
echo ">>> Step 4: Initializing other library packages..."
for pkg in engine ai-assistant testing-utils templates-library; do
  echo "Initializing '$pkg'..."
  cd "packages/$pkg" || exit 1
  npm init -y
  npm install --save-dev typescript@^5 @types/node@^20 || { echo "'$pkg' dependency install failed."; exit 1; }
  npx tsc --init --rootDir src --outDir dist --declaration true --declarationMap true --sourceMap true --moduleResolution node --esModuleInterop true --target ES2020 --module ESNext --lib "[\"ES2020\", \"DOM\"]" || { echo "'$pkg' tsconfig init failed."; exit 1; }
  mkdir src dist
  touch src/index.ts
  touch .eslintrc.js # Placeholder
  cd ../.. # Back to root
done
echo ">>> Library packages initialized."

# 5. Initialize 'webapp' Application
echo ">>> Step 5: Initializing 'webapp'..."
cd apps/webapp || exit 1
# Initialize Vite React TS project in current directory
npm create vite@latest . -- --template react-ts || { echo "'webapp' Vite initialization failed."; exit 1; }
# Install webapp specific dependencies
npm install || { echo "'webapp' dependency install failed."; exit 1; }
cd ../.. # Back to root
echo ">>> 'webapp' initialized."

# 6. Install Root Dev Dependencies (Linter, Formatter)
echo ">>> Step 6: Installing root dev dependencies..."
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin turbo@^1 --workspace-root || { echo "Root dev dependency install failed."; exit 1; }
echo ">>> Root dev dependencies installed."

# 7. Create Placeholder Root Config Files (Requires Manual Editing Later)
echo ">>> Step 7: Creating placeholder root config files..."
touch .eslintrc.js
touch .prettierrc.js
touch .prettierignore
touch .gitignore
echo ">>> Placeholder config files created. EDIT MANUALLY LATER."

# 8. Initialize Git
echo ">>> Step 8: Initializing Git..."
git init
git branch -M main
git checkout -b develop || git checkout develop # Create develop branch or switch if it exists
echo ">>> Git initialized on 'develop' branch."

# 9. Create GitHub Actions Directory (Requires Manual Editing Later)
echo ">>> Step 9: Creating GitHub Actions directory..."
mkdir -p .github/workflows
touch .github/workflows/ci.yml
echo ">>> GitHub Actions directory created. EDIT ci.yml MANUALLY LATER."

# 10. Create Shared Types Directories (Requires Manual Editing Later)
echo ">>> Step 10: Creating shared-types subdirectories..."
mkdir -p packages/shared-types/src/interfaces packages/shared-types/src/constants
echo ">>> shared-types subdirectories created. ADD INTERFACE FILES MANUALLY LATER."

# 11. Create Docs Directory (Requires Manual Editing Later)
echo ">>> Step 11: Creating docs directory..."
mkdir -p docs
touch docs/SUCCESS_CRITERIA_V1.md
echo ">>> Docs directory created. EDIT SUCCESS_CRITERIA_V1.md MANUALLY LATER."

# --- FINAL ---
echo ">>> Basic scaffolding complete! <<<"
echo "!!! IMPORTANT: Manual steps required! Please see below. !!!"


REQUIRED MANUAL STEPS AFTER RUNNING THE SCRIPT:

Edit Root package.json:

Add the "workspaces": ["apps/*", "packages/*"] field.

Add the root "scripts" for lint, format, typecheck, build, test (using turbo run ...).

Edit Individual package.json Files:

packages/*: Set correct "name": "@cineform-forge/...", "version", "private", "main", "types". Add "scripts" (build, dev, lint, clean, typecheck, test). Add "dependencies": { "@cineform-forge/shared-types": "workspace:*" } to engine and ai-assistant.

apps/webapp: Set correct "name": "webapp", "version", "private". Verify Vite scripts. Add "dependencies": { "@cineform-forge/shared-types": "workspace:*" }. Add "dependencies": { "@cineform-forge/templates-library": "workspace:*" }.

Create/Populate Root Config Files:

Copy/paste the content for .eslintrc.js, .prettierrc.js, .prettierignore, .gitignore from the Phase 0 plan into the files created by the script.

Create/Populate ci.yml:

Copy/paste the YAML content for the basic CI workflow from the Phase 0 plan into .github/workflows/ci.yml.

Create/Populate Shared Types:

Create the individual .ts files inside packages/shared-types/src/interfaces/ (e.g., ProjectData.ts, AnimationElement.ts, etc.).

Copy/paste the corresponding TypeScript interface code (with JSDoc comments) into each file from the Phase 0 plan.

Update packages/shared-types/src/index.ts to export all the interfaces.

Populate Success Criteria:

Copy/paste the Markdown content into docs/SUCCESS_CRITERIA_V1.md.

Install All Dependencies:

Run npm install (or pnpm install / yarn install) from the root directory after editing all package.json files. This correctly links workspace dependencies.

Initial Git Commit:

Run git add .

Run git commit -m "Initial project setup and Phase 0 scaffolding"

Verify:

Run npm run lint, npm run typecheck from the root to ensure tooling is working.

This script handles the repetitive directory creation and initialization, letting you focus on correctly configuring the files afterwards.

Okay, let's break down Phase 0: Project Setup & Core Infrastructure into extremely clear, step-by-step instructions, explaining the commands and concepts involved. This assumes you have Node.js and npm (or your preferred package manager like pnpm/yarn) installed.

Phase 0: Project Setup & Core Infrastructure (Ultra-Detailed Elaboration)

Goal: To build the fundamental skeleton of our project. This includes setting up the folder structure for managing multiple related codebases (a "monorepo"), installing essential tools, defining basic configurations, creating the places where our shared code rules will live, setting up version control, and establishing an automated quality checker.

AI Agent Instructions: Follow every instruction precisely. If a command asks for input, use the recommended defaults or specified values unless instructed otherwise. Mark completed steps with [v].

1. Create the Project's Main Folder and Initialize Turborepo

Explanation: We'll start by creating the main directory that will hold all our project code. Then, we'll use a tool called Turborepo to set up a "monorepo". A monorepo is a strategy for organizing code where multiple distinct projects (like our web application webapp and our animation engine library) live within the same main code repository. Turborepo helps manage tasks and dependencies across these projects efficiently. npx is a tool that lets you run Node.js package commands without having to install the package globally on your system first.

Action: Open your terminal or command prompt. Navigate to the directory where you want to create your project (e.g., your Development or Projects folder).

Command: npx create-turbo@latest cineform-forge

(What this does): Downloads the latest create-turbo tool and runs it to create a new directory named cineform-forge.

(Interaction): It will likely ask you a few questions:

Where would you like to create your turborepo? - Confirm the default (./cineform-forge).

Which package manager do you want to use? - Choose npm (or pnpm / yarn if you prefer and have it installed). We'll use npm in these examples.

(It might ask other questions depending on the version, accept defaults unless you have specific needs).

Action: Navigate into the newly created project directory.

Command: cd cineform-forge

Verification: Type ls (Linux/macOS) or dir (Windows). You should see files like turbo.json and directories like apps and packages. This confirms Turborepo set up the basic structure.

Action (Cleanup): Turborepo might create example apps/packages (like apps/web, apps/docs, packages/ui). We want to start fresh with our specific packages. Delete any placeholder directories inside apps/ and packages/.

Commands (Example):

rm -rf apps/*
rm -rf packages/*
# Use 'del /s /q apps\*' and 'del /s /q packages\*' on Windows if needed


2. Create Our Specific Package Directories

Explanation: Now, we'll create the empty folders within the packages directory that will hold our reusable code libraries, and the folder within apps for our main web application.

Action: Ensure you are in the cineform-forge root directory.

Commands:

mkdir packages/engine          # For the animation engine logic
mkdir packages/ai-assistant    # For interacting with AI models
mkdir packages/shared-types    # For shared TypeScript definitions
mkdir packages/testing-utils   # For common testing helpers
mkdir packages/templates-library # For reusable animation templates
mkdir apps/webapp             # For the main React web application
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Verification: Use ls packages and ls apps (or dir) to confirm these directories were created.

3. Initialize the shared-types Library Package

Explanation: This package won't contain much runnable code, but it's crucial. It will hold the definitions (TypeScript Interfaces) of the data structures used throughout our project (like what an AnimationElement looks like). This ensures all our different packages agree on the shape of the data they pass around.

Action: Navigate into the shared-types directory.

Command: cd packages/shared-types

Action: Initialize it as an npm package.

Command: npm init -y

(What this does): Creates a package.json file. The -y flag automatically accepts default settings, which is fine for now. This file lists information about the package and its dependencies.

Action: Install TypeScript, which is needed to write and compile our type definitions. We install it as a "dev dependency" because it's only needed during development, not when the final code runs.

Command: npm install --save-dev typescript@^5 @types/node@^20

(Note): Using specific major versions (^5, ^20) ensures compatibility. Adjust if needed for your Node.js version.

Action: Create a basic TypeScript configuration file (tsconfig.json).

Command: npx tsc --init --rootDir src --outDir dist --declaration true --declarationMap true --sourceMap true --moduleResolution node --esModuleInterop true --target ES2020 --module ESNext --lib "[\"ES2020\", \"DOM\"]"

(Explanation of flags):

--rootDir src: Our TypeScript source code will be in the src folder.

--outDir dist: The compiled JavaScript output will go into the dist folder.

--declaration true: Generate corresponding .d.ts definition files (essential for sharing types).

--declarationMap true, --sourceMap true: Help with debugging.

--moduleResolution node: How Node.js finds modules.

--esModuleInterop true: Improves compatibility between different module types.

--target ES2020, --module ESNext: Specifies modern JavaScript output format.

--lib ["ES2020", "DOM"]: Includes standard JS features and browser DOM types.

Action: Create the source code (src) and distribution (dist) directories mentioned in the config.

Commands:

mkdir src
mkdir dist
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Action: Create the main file where we will export our types.

Command: touch src/index.ts

Action: Edit the package.json file (use a text editor like VS Code, Notepad++, etc.). Add/modify the following fields to make it a proper, buildable package:

// packages/shared-types/package.json
{
  "name": "@cineform-forge/shared-types", // Unique name scoped to our project
  "version": "0.1.0", // Initial version
  "private": true, // Prevents accidental publishing to public npm
  "main": "dist/index.js", // Entry point for JavaScript users
  "types": "dist/index.d.ts", // Entry point for TypeScript users (points to definitions)
  "scripts": {
    // Commands to manage this package:
    "build": "tsc", // Compiles TS code using tsconfig.json
    "dev": "tsc -w", // Compiles continuously as files change (watch mode)
    "lint": "eslint . --ext .ts", // Checks code style/quality (we'll configure eslint later)
    "clean": "rm -rf dist node_modules" // Removes generated files/dependencies
  },
  "devDependencies": {
    "@types/node": "^20.12.12", // Adjust version as installed
    "typescript": "^5.4.5" // Adjust version as installed
  }
  // Remove the default "description", "keywords", "author", "license" if desired,
  // or fill them in appropriately. Keep "main" if it was generated.
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

(Make sure the version numbers in devDependencies match what npm install actually installed).

Action: Create an empty ESLint configuration file. We'll configure linting rules later at the root level, but packages often expect this file to exist.

Command: touch .eslintrc.js

Verification: Check that package.json, tsconfig.json, src/index.ts, and dist exist in the packages/shared-types directory.

4. Initialize Other Library Packages (engine, ai-assistant, testing-utils, templates-library)

Explanation: We repeat the process from Step 3 for our other library packages. They all need to be set up as individual TypeScript packages.

Action: Navigate back to the packages directory: cd ...

Action: For each of the following directories: engine, ai-assistant, testing-utils, templates-library:

cd <directory_name> (e.g., cd engine)

Run npm init -y

Run npm install --save-dev typescript@^5 @types/node@^20

Run npx tsc --init --rootDir src --outDir dist --declaration true --declarationMap true --sourceMap true --moduleResolution node --esModuleInterop true --target ES2020 --module ESNext --lib "[\"ES2020\", \"DOM\"]"

Run mkdir src dist

Run touch src/index.ts

Edit the generated package.json:

Set the name field uniquely, e.g., "@cineform-forge/engine", "@cineform-forge/ai-assistant", etc.

Set "version": "0.1.0".

Set "private": true.

Set "main": "dist/index.js".

Set "types": "dist/index.d.ts".

Add the exact same "scripts" section as in shared-types/package.json (build, dev, lint, clean).

Ensure devDependencies for typescript and @types/node are present and match versions.

Run touch .eslintrc.js

cd .. (Navigate back to the packages directory before starting the next one).

5. Initialize the webapp Application

Explanation: This package is different; it's our user-facing application, built with React and Vite. Vite is a fast build tool for modern web projects.

Action: Navigate to the webapp directory.

Command: cd ../apps/webapp (Assuming you are in the packages directory).

Action: Clean the directory if it contains old files (it should be empty from Step 1).

Command (Optional Cleanup): rm -rf * .??* (This removes all files and dotfiles. Use with caution!).

Action: Use Vite to create a new React project with TypeScript support in the current directory.

Command: npm create vite@latest . -- --template react-ts

(The . means "use the current directory". The -- --template react-ts passes the template argument to the create-vite command).

Action: Install the necessary dependencies for the React app.

Command: npm install

Verification: Check for standard React+Vite files: index.html, package.json, vite.config.ts, tsconfig.json, and a src directory containing main.tsx, App.tsx.

Action: Edit the apps/webapp/package.json file. Give it a simple name (it doesn't need the @cineform-forge/ prefix as it's an app, not a shared library).

// apps/webapp/package.json - ensure 'name' field exists
{
  "name": "webapp", // Simple name for the app
  "private": true, // Always true for apps
  "version": "0.1.0",
  "type": "module", // Vite uses ES Modules
  // ... other fields generated by Vite ...
  "scripts": {
    "dev": "vite", // Runs the development server
    "build": "tsc && vite build", // Type checks then builds for production
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0", // Vite's default lint script
    "preview": "vite preview" // Serves the production build locally
  },
  // ... dependencies and devDependencies generated by Vite ...
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

6. Setup Monorepo Workspace Dependencies

Explanation: We need to tell our package manager (npm) that these packages belong together and allow them to reference each other easily using the @cineform-forge/ names we defined. We also need to link shared-types where it's needed.

Action: Navigate back to the root directory of the cineform-forge project.

Command: cd ../.. (Assuming you are in apps/webapp).

Action: Edit the main package.json file in the root directory. Add the workspaces field to tell npm where to find the individual packages.

// /package.json (root level)
{
  "name": "cineform-forge-monorepo", // Name for the whole monorepo
  "version": "0.0.1",
  "private": true,
  "workspaces": [ // Tells npm where the packages are
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    // We will add root-level scripts later
  },
  "devDependencies": {
    // We will add root-level dev dependencies later
  }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

Action: Now, link @cineform-forge/shared-types as a dependency for the packages that need it (webapp, engine, ai-assistant). Edit the package.json file inside each of these three directories. Add the following line within their dependencies section (create the dependencies section if it doesn't exist in engine or ai-assistant):

// Example: inside apps/webapp/package.json
"dependencies": {
  // ... other React dependencies ...
  "@cineform-forge/shared-types": "workspace:*" // Links to the local package
},

// Example: inside packages/engine/package.json
"dependencies": {
  "@cineform-forge/shared-types": "workspace:*"
},

// Example: inside packages/ai-assistant/package.json
"dependencies": {
  "@cineform-forge/shared-types": "workspace:*"
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

(Explanation): "workspace:*" is a special protocol used by npm/yarn/pnpm workspaces. It tells the package manager to link directly to the local version of @cineform-forge/shared-types within this monorepo, rather than trying to download it from the internet.

Action: From the root directory, run the install command again. This will install dependencies for all packages defined in the workspaces and properly link the local ones (shared-types).

Command: npm install

Verification: Check for node_modules directories within each package and also symbolic links connecting the dependent packages to shared-types. You should now be able to import { ProjectData } from '@cineform-forge/shared-types'; within webapp, engine, or ai-assistant.

7. Configure ESLint & Prettier (Code Quality & Formatting) at the Root

Explanation: ESLint checks your code for potential errors and style issues based on configured rules. Prettier automatically formats your code to ensure consistency. Setting them up at the root level ensures all packages follow the same standards.

Action: Ensure you are in the root directory.

Action: Install the necessary tools as development dependencies for the entire workspace.

Command: npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin --workspace-root

(Explanation): --workspace-root (or -W for npm >= 7) installs these into the root node_modules, making them available to all packages.

Action: Create the main ESLint configuration file at the root.

Command: touch .eslintrc.js

Action: Paste the following configuration into .eslintrc.js. This sets up rules for TypeScript, React, and makes ESLint work nicely with Prettier.

// /.eslintrc.js (root level)
module.exports = {
  root: true, // Important: tells ESLint to stop looking in parent folders
  parser: '@typescript-eslint/parser', // Specifies the parser for TypeScript
  plugins: [
    '@typescript-eslint', // Enables TypeScript-specific linting rules
    'react', // Enables React-specific linting rules
    'react-hooks', // Enforces rules of Hooks
  ],
  extends: [
    'eslint:recommended', // Basic ESLint recommended rules
    'plugin:@typescript-eslint/recommended', // Recommended TypeScript rules
    'plugin:react/recommended', // Recommended React rules
    'plugin:react/jsx-runtime', // Rules for new JSX transform (no need to import React)
    'plugin:react-hooks/recommended', // Recommended rules for React Hooks
    'prettier', // Integrates Prettier, disabling conflicting ESLint formatting rules
  ],
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  env: {
    browser: true, // Enables browser global variables like `window`
    node: true, // Enables Node.js global variables and Node.js scoping.
    es2021: true, // Enables ES2021 globals and syntax.
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Allows parsing of JSX
    },
    ecmaVersion: 12, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows using imports/exports
    project: ['./tsconfig.json', './packages/*/tsconfig.json', './apps/*/tsconfig.json'], // Optional: Helps ESLint understand types across packages
  },
  rules: {
    // Customize rules here if needed:
    'react/prop-types': 'off', // Disable prop-types rule as we use TypeScript
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }], // Warn about unused vars, but allow vars starting with _
    // Example: Enforce curly braces for all control statements
    // 'curly': ['error', 'all'],
  },
  ignorePatterns: [ // Files/directories ESLint should ignore
      'node_modules/',
      'dist/',
      'build/',
      '.turbo/',
      'coverage/',
      '*.js', // Ignore root JS config files like this one, prettierrc, etc.
      'vite.config.ts', // Example: ignore specific config files if needed
  ],
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

Action: Create the Prettier configuration file at the root.

Command: touch .prettierrc.js

Action: Paste the following configuration into .prettierrc.js. This defines how Prettier should format the code.

// /.prettierrc.js (root level)
module.exports = {
  semi: true, // Add semicolons at the end of statements
  trailingComma: 'es5', // Add trailing commas where valid in ES5 (objects, arrays, etc.)
  singleQuote: true, // Use single quotes instead of double quotes
  printWidth: 80, // Wrap lines that exceed 80 characters
  tabWidth: 2, // Use 2 spaces per indentation level
  endOfLine: 'lf', // Use Unix-style line endings (Line Feed)
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

Action: Create a Prettier ignore file at the root to prevent formatting generated files or specific directories.

Command: touch .prettierignore

Action: Add paths to ignore to .prettierignore:

# /.prettierignore
node_modules
dist
build
coverage
*.log
.turbo
# Add other specific files/folders if needed
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END

Action: Add a lint script to the root package.json to easily run ESLint across the entire project.

// /package.json (root level) - within "scripts": {}
"scripts": {
  "lint": "eslint \"apps/**/*.{ts,tsx}\" \"packages/**/*.{ts,tsx}\"", // Run ESLint on all relevant files
  "format": "prettier --write \"apps/**/*.{ts,tsx}\" \"packages/**/*.{ts,tsx}\" \"*.{js,json,md}\"" // Add a format script
},
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

Action: Delete the placeholder .eslintrc.js files you created earlier inside packages/shared-types, packages/engine, etc. (unless you plan to add package-specific overrides later). Use rm packages/*/.eslintrc.js.

Verification: Run npm run lint and npm run format from the root directory. Fix any errors reported. The format command will modify files to match Prettier's rules.

8. Initialize Git Version Control

Explanation: Git is essential for tracking changes to your code, collaborating, and reverting mistakes. We'll initialize a Git repository for the entire monorepo.

Action: Ensure you are in the root directory.

Command: git init

Action: Create a .gitignore file to tell Git which files/folders it should not track.

Command: touch .gitignore

Action: Add common patterns and project-specific files to .gitignore:

# /.gitignore
# Dependencies
node_modules/
.pnp.*
.yarn/install-state.gz

# Build Outputs
dist/
build/
out/

# Turbo Cache
.turbo/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# OS generated files
.DS_Store
Thumbs.db

# Environment variables
.env
.env*.local

# Test Output
coverage/

# Editor directories and files
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END

Action: Stage all the files created so far to be tracked by Git.

Command: git add .

Action: Make your first commit, saving the current state.

Command: git commit -m "Initial project setup with monorepo structure, core packages, and tooling"

Action: Rename the default branch to main (a common modern practice).

Command: git branch -M main

Action: Create a develop branch. This will be our primary branch for ongoing development. Features will branch off develop and merge back into it. main will typically represent stable releases.

Command: git checkout -b develop

Verification: Run git status (should show working tree clean) and git branch (should show * develop and main).

9. Setup Basic CI/CD Pipeline (GitHub Actions)

Explanation: Continuous Integration (CI) automatically runs checks (like linting, type checking, tests) whenever code is pushed or merged. This helps catch errors early. We'll use GitHub Actions for this.

Action: Create the necessary directories for GitHub Actions workflows.

Command: mkdir -p .github/workflows (The -p creates parent directories if they don't exist).

Action: Create the workflow file.

Command: touch .github/workflows/ci.yml

Action: Paste the following YAML configuration into ci.yml. This defines the steps the CI server will run.

# .github/workflows/ci.yml
name: Cineform Forge CI # Name displayed on GitHub Actions

on:
  push:
    branches: [ main, develop ] # Trigger on pushes to these branches
  pull_request:
    branches: [ main, develop ] # Trigger on PRs targeting these branches

jobs:
  build_and_test: # Name of the job
    runs-on: ubuntu-latest # Use a standard Linux environment

    steps:
      - name: Checkout code # Step 1: Get the code from the repository
        uses: actions/checkout@v4 # Use a predefined GitHub Action for checking out code

      - name: Setup Node.js # Step 2: Install the correct Node.js version
        uses: actions/setup-node@v4
        with:
          node-version: '20' # Specify Node.js version (use LTS or project requirement)
          cache: 'npm' # Cache npm dependencies for faster installs on subsequent runs

      - name: Install dependencies # Step 3: Install all project dependencies
        run: npm install # Use the same command used locally (pnpm install / yarn install if applicable)

      - name: Lint Check # Step 4: Run the ESLint check
        run: npm run lint # Executes the 'lint' script defined in the root package.json

      - name: Type Check # Step 5: Run the TypeScript compiler to check types without generating JS
        run: npm run typecheck # Requires a 'typecheck' script (see next step)

      # Add Test step later when tests are implemented
      # - name: Run Unit Tests
      #   run: npm run test

      - name: Build Check (Optional but Recommended) # Step 6: Ensure the project builds successfully
        run: npm run build # Requires a 'build' script using Turbo (see next step)
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Yaml
IGNORE_WHEN_COPYING_END

Action: Add the necessary typecheck and build scripts to the root package.json. These scripts will use Turborepo to efficiently run the corresponding scripts in each individual package. Also add typecheck scripts to the individual packages.

// /package.json (root level) - within "scripts": {}
"scripts": {
  "lint": "eslint \"apps/**/*.{ts,tsx}\" \"packages/**/*.{ts,tsx}\"",
  "format": "prettier --write \"apps/**/*.{ts,tsx}\" \"packages/**/*.{ts,tsx}\" \"*.{js,json,md}\"",
  "typecheck": "turbo run typecheck", // New root script using Turbo
  "build": "turbo run build" // New root script using Turbo
  // Add "test": "turbo run test" later
},
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END
// Example: packages/shared-types/package.json - within "scripts": {}
"scripts": {
  "build": "tsc",
  "dev": "tsc -w",
  "lint": "eslint . --ext .ts",
  "clean": "rm -rf dist node_modules",
  "typecheck": "tsc --noEmit" // New script for CI type checking only
},
// ADD the "typecheck": "tsc --noEmit" script to all other packages
// (engine, ai-assistant, testing-utils, templates-library) as well.
// The webapp 'build' script already includes 'tsc', so it effectively typechecks.
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Json
IGNORE_WHEN_COPYING_END

Action: Stage and commit the new workflow file and the package.json updates.

git add .github/workflows/ci.yml package.json packages/*/package.json apps/*/package.json
git commit -m "feat: Add basic CI workflow using GitHub Actions for lint and type checks"
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Action (Optional): Push your develop branch to a remote repository on GitHub (or similar) to activate the CI workflow. git push -u origin develop.

10. Define Core Types in shared-types Package

Explanation: This is where we write the actual TypeScript code defining our shared data structures. Good organization makes them easier to find and maintain.

Action: Navigate to the types source directory.

Command: cd packages/shared-types/src

Action: Create subdirectories for organization.

Command: mkdir interfaces constants

Action: Create files within interfaces/ for each major data structure.

Commands:

touch interfaces/ProjectData.ts
touch interfaces/ProjectMetadata.ts
touch interfaces/AnimationElement.ts
touch interfaces/Keyframe.ts
touch interfaces/AnimationSequence.ts
touch interfaces/TimelineData.ts
touch interfaces/RenderingOptions.ts
touch interfaces/ScrollTrigger.ts
touch interfaces/AnimationSuggestion.ts
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Action: Open each .ts file and paste the corresponding TypeScript interface definition from the plan (v3). Add JSDoc comments (/** ... */) above each interface and property to explain its purpose clearly.

(Example - ensure this level of detail for ALL interfaces):

// packages/shared-types/src/interfaces/AnimationElement.ts
/**
 * Represents a single visual or functional element within the animation scene.
 */
export interface AnimationElement {
  /**
   * A unique identifier for this element within the project.
   * Typically a UUID.
   * @example "f47ac10b-58cc-4372-a567-0e02b2c3d479"
   */
  id: string;

  /**
   * The type of the element, determining its rendering and properties.
   */
  type: 'shape' | 'text' | 'image' | 'group' | 'audio' | 'camera';

  /**
   * User-defined name for the element, displayed in the UI.
   * @example "Hero Title", "Background Music"
   */
  name: string;

  /**
   * Initial properties of the element when the animation starts
   * or before any keyframes are applied at time 0.
   * Properties depend on the element type (e.g., x, y, opacity, fill, src, textContent).
   * @example { x: 100, y: 50, opacity: 0, fill: '#ff0000' }
   * @example { src: '/images/logo.png', width: 100, height: 50 }
   */
  initialProps: Record<string, any>;
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Edit the main export file (src/index.ts) to make all these interfaces easily importable from the package.

// packages/shared-types/src/index.ts
export * from './interfaces/ProjectMetadata';
export * from './interfaces/AnimationElement';
export * from './interfaces/Keyframe';
export * from './interfaces/AnimationSequence';
export * from './interfaces/TimelineData';
export * from './interfaces/ProjectData';
export * from './interfaces/RenderingOptions';
export * from './interfaces/ScrollTrigger';
export * from './interfaces/AnimationSuggestion';
// Add exports for any constants defined in constants/ later
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Build the shared-types package to ensure there are no TypeScript errors.

Command: npm run build (while inside packages/shared-types)

Action: Navigate back to the root directory: cd ../../...

Action: Stage and commit the new type definition files.

git add packages/shared-types/src packages/shared-types/package.json
git commit -m "feat(shared-types): Define core project data structures and interfaces"
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

11. Define Initial Success Criteria Document

Explanation: Writing down specific, measurable goals helps keep the project focused. This document clarifies what "success" looks like for the first major version.

Action: Create a docs directory at the root level if it doesn't exist.

Command: mkdir -p docs

Action: Create the markdown file for the criteria.

Command: touch docs/SUCCESS_CRITERIA_V1.md

Action: Open docs/SUCCESS_CRITERIA_V1.md and paste the example Markdown content from Plan v3 (or adapt it). Ensure the criteria are specific and measurable (e.g., target FPS, task completion times, acceptance rates).

Action: Stage and commit this document.

git add docs/SUCCESS_CRITERIA_V1.md
git commit -m "docs: Define initial measurable success criteria for v1.0"
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

End of Phase 0 - Verification Checklist:

Does the cineform-forge directory exist with apps and packages subdirectories?

Do the required packages (engine, ai-assistant, etc.) exist within packages?

Does apps/webapp exist and contain a Vite React TS project?

Do all packages (shared-types, engine, etc.) have package.json, tsconfig.json, src/index.ts?

Does the root package.json define workspaces?

Did npm install run successfully from the root?

Are @cineform-forge/shared-types listed as dependencies (workspace:*) in webapp, engine, ai-assistant?

Does the root directory contain configured .eslintrc.js, .prettierrc.js, .prettierignore?

Does npm run lint and npm run format execute without errors from the root?

Is the project initialized as a Git repository with main and develop branches?

Does .gitignore exist and exclude node_modules, dist, etc.?

Does .github/workflows/ci.yml exist with the defined CI steps?

Does packages/shared-types/src/interfaces contain .ts files for all core types?

Does packages/shared-types/src/index.ts export all the defined interfaces?

Does docs/SUCCESS_CRITERIA_V1.md exist with defined goals?

Are all changes committed to the develop branch?

If all checks pass, Phase 0 is complete, and the project has a solid foundation.

Okay, let's proceed with the detailed elaboration for Phase 1: Foundation - Core Functionality & UX Prototype (High Priority).

Phase 1: Foundation - Core Functionality & UX Prototype (Detailed Elaboration)

Goal: To build the absolute minimum viable product. This includes a basic animation engine capable of playing simple timelines, the core UI panels (preview, timeline, properties, elements), the initial text-to-animation AI integration, and fundamental project handling. The focus is on getting a visual feedback loop working and validating the core user experience.

AI Agent Instructions: Execute each step precisely. Implement interfaces defined in shared-types. Generate React components using functional components and Hooks. Write clean, commented code. Create basic unit tests for new logic. Mark completed steps with [v].

1. Implement Engine Wrapper (@cineform-forge/engine)

Explanation: This class will be the main interface for controlling animations. It will manage the underlying animation library (like GSAP) through an adapter, hiding the specific library's details from the rest of the application.

Action: Navigate to the engine package: cd packages/engine.

Action: Create necessary files within src/:

touch src/CineforgeEngine.ts
touch src/adapters/IEngineAdapter.ts
mkdir -p src/adapters/gsap # Directory for GSAP specific code
touch src/adapters/gsap/GSAPAdapter.ts
touch src/types/PlaybackState.ts
# Update src/index.ts to export the main class and types


Action: Define the IEngineAdapter interface in src/adapters/IEngineAdapter.ts. This contract ensures any animation library adapter we create has the same methods.

// packages/engine/src/adapters/IEngineAdapter.ts
import type { AnimationElement, TimelineData, Keyframe } from '@cineform-forge/shared-types';
import type { PlaybackState } from '../types/PlaybackState'; // Define this type below

export type EngineEventCallback = (...args: any[]) => void;
export type EngineEvent = 'start' | 'complete' | 'update'; // Add more events as needed

export interface IEngineAdapter {
  /** Initializes the adapter, potentially linking to a DOM target. */
  init(targetElement: HTMLElement | null): void;
  /** Loads animation data and prepares the timeline. */
  loadTimeline(timelineData: TimelineData, elements: AnimationElement[]): Promise<void>;
  /** Plays the animation from the current time. */
  play(): void;
  /** Pauses the animation. */
  pause(): void;
  /** Seeks to a specific time in the animation (in seconds). */
  seek(time: number): void;
  /** Sets the playback rate (1 = normal, 0.5 = half speed, 2 = double speed). */
  setRate(rate: number): void;
  /** Gets the current playback state (time, progress, playing status). */
  getPlaybackState(): PlaybackState;
  /** Registers an event listener. */
  on(eventName: EngineEvent, callback: EngineEventCallback): void;
  /** Unregisters an event listener. */
  off(eventName: EngineEvent, callback: EngineEventCallback): void;
  /** Cleans up resources used by the adapter. */
  destroy(): void;
  /** Renders a single static element (initial state). */
  renderStaticElement(element: AnimationElement, target: HTMLElement | null): void;
  /** Handles 3D perspective for the container */
  setPerspective(perspective: string | number | null, target: HTMLElement | null): void;
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Define the PlaybackState type in src/types/PlaybackState.ts.

// packages/engine/src/types/PlaybackState.ts
export interface PlaybackState {
  currentTime: number; // Current time in seconds
  progress: number;    // Overall progress (0 to 1)
  isPlaying: boolean;
  rate: number;        // Current playback rate
  duration: number;    // Total duration in seconds
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Implement the CineforgeEngine class in src/CineforgeEngine.ts. It will hold an instance of an adapter.

// packages/engine/src/CineforgeEngine.ts
import type { IEngineAdapter, EngineEvent, EngineEventCallback } from './adapters/IEngineAdapter';
import type { PlaybackState } from './types/PlaybackState';
import type { AnimationElement, TimelineData } from '@cineform-forge/shared-types';
import { GSAPAdapter } from './adapters/gsap/GSAPAdapter'; // Import the specific adapter

export class CineforgeEngine {
  private adapter: IEngineAdapter | null = null;
  private targetElement: HTMLElement | null = null;
  private currentElements: AnimationElement[] = [];
  private currentTimelineData: TimelineData | null = null;

  constructor(targetElement: HTMLElement | null) {
    this.targetElement = targetElement;
    // Instantiate the default adapter (e.g., GSAP)
    // In the future, this could be dynamic based on config
    this.adapter = new GSAPAdapter();
    this.adapter.init(this.targetElement);
  }

  async loadTimeline(timelineData: TimelineData, elements: AnimationElement[]): Promise<void> {
    if (!this.adapter) throw new Error('Engine adapter not initialized.');
    this.currentElements = elements;
    this.currentTimelineData = timelineData;
    // First, render static elements before applying timeline
    this.renderStaticElements();
    await this.adapter.loadTimeline(timelineData, elements);
  }

  renderStaticElements(): void {
     if (!this.adapter || !this.targetElement) return;
     // Clear previous static elements if necessary (adapter might handle this)
     this.currentElements.forEach(element => {
       this.adapter!.renderStaticElement(element, this.targetElement);
     });
  }

  play(): void { this.adapter?.play(); }
  pause(): void { this.adapter?.pause(); }
  seek(time: number): void { this.adapter?.seek(time); }
  setRate(rate: number): void { this.adapter?.setRate(rate); }
  getPlaybackState(): PlaybackState | null { return this.adapter?.getPlaybackState() ?? null; }
  on(eventName: EngineEvent, callback: EngineEventCallback): void { this.adapter?.on(eventName, callback); }
  off(eventName: EngineEvent, callback: EngineEventCallback): void { this.adapter?.off(eventName, callback); }

  setPerspective(value: string | number | null): void {
      this.adapter?.setPerspective(value, this.targetElement);
  }

  destroy(): void {
    this.adapter?.destroy();
    this.adapter = null;
    this.targetElement = null; // Release reference
  }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Update src/index.ts to export the necessary parts.

// packages/engine/src/index.ts
export { CineforgeEngine } from './CineforgeEngine';
export type { PlaybackState } from './types/PlaybackState';
export type { IEngineAdapter, EngineEvent, EngineEventCallback } from './adapters/IEngineAdapter';
// Potentially export adapters if needed externally, but likely not initially
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

2. Implement GSAP Adapter (@cineform-forge/engine)

Explanation: This class implements the IEngineAdapter interface using the GreenSock Animation Platform (GSAP). GSAP is a popular, robust animation library.

Action: Install GSAP as a dependency for the engine package.

Command: cd packages/engine && npm install gsap && cd ../..

Action: Implement the GSAPAdapter class in src/adapters/gsap/GSAPAdapter.ts.

// packages/engine/src/adapters/gsap/GSAPAdapter.ts
import type { IEngineAdapter, EngineEvent, EngineEventCallback } from '../IEngineAdapter';
import type { PlaybackState } from '../../types/PlaybackState';
import type { AnimationElement, TimelineData, Keyframe } from '@cineform-forge/shared-types';
import gsap from 'gsap'; // Import GSAP library

export class GSAPAdapter implements IEngineAdapter {
  private timeline: gsap.core.Timeline | null = null;
  private target: HTMLElement | null = null;
  private elementMap: Map<string, HTMLElement> = new Map(); // Map element ID to DOM node

  init(targetElement: HTMLElement | null): void {
    this.target = targetElement;
    gsap.defaults({ overwrite: 'auto' }); // Default overwrite behavior
    console.log('GSAP Adapter Initialized');
  }

  private getDOMElement(elementId: string, createIfMissing: boolean = true): HTMLElement | null {
      if (this.elementMap.has(elementId)) {
          return this.elementMap.get(elementId)!;
      }
      if (!this.target || !createIfMissing) return null;

      // Simple element creation for MVP - enhance later
      const element = document.createElement('div');
      element.id = `cfe-${elementId}`; // cineform-element prefix
      element.dataset.elementId = elementId; // Store original ID
      element.style.position = 'absolute'; // Assume absolute positioning for now
      element.style.boxSizing = 'border-box';
      element.textContent = `Element ${elementId}`; // Placeholder content
      this.target.appendChild(element);
      this.elementMap.set(elementId, element);
      return element;
  }

  renderStaticElement(elementData: AnimationElement, target: HTMLElement | null): void {
    if (!target) return;
    this.target = target; // Ensure target is set
    const domElement = this.getDOMElement(elementData.id, true);
    if (domElement && elementData.initialProps) {
        // Apply initial styles - more robust handling needed later
        gsap.set(domElement, {
           ...elementData.initialProps,
           // Add default sensible values if missing (e.g., x, y, opacity)
           x: elementData.initialProps.x ?? 0,
           y: elementData.initialProps.y ?? 0,
           opacity: elementData.initialProps.opacity ?? 1,
           // Handle textContent, src for images, etc. based on elementData.type
        });
        domElement.textContent = elementData.name; // Use name as placeholder text for now
    }
  }

  async loadTimeline(timelineData: TimelineData, elements: AnimationElement[]): Promise<void> {
    // Cleanup previous timeline
    this.timeline?.kill(); // Kill previous timeline to remove animations
    this.elementMap.clear(); // Clear old element mapping
    if (this.target) { // Remove old DOM elements
         this.target.innerHTML = '';
    }

    // Re-render static elements in their initial state
    elements.forEach(el => this.renderStaticElement(el, this.target));


    this.timeline = gsap.timeline({
      paused: true, // Start paused
      defaults: { ease: 'power1.out' }, // Default ease
      duration: timelineData.duration,
      onStart: () => this.emit('start'),
      onComplete: () => this.emit('complete'),
      onUpdate: () => this.emit('update'),
    });

    timelineData.sequences.forEach(sequence => {
      const domElement = this.getDOMElement(sequence.elementId, false); // Should exist from renderStaticElement
      if (!domElement) {
        console.warn(`Element ${sequence.elementId} not found for sequence.`);
        return;
      }

      sequence.keyframes.forEach(keyframe => {
         const properties = { ...keyframe.properties }; // Copy properties
         if (keyframe.easing) {
             properties.ease = keyframe.easing;
         }
         // GSAP uses absolute time for timeline insertions
         this.timeline?.to(domElement, properties, 0, keyframe.time); // Duration 0 makes it a 'set' at that time if needed, but .to works fine for sequences
         // Note: More complex logic needed for durations BETWEEN keyframes if not using simple .to sequencing
         // For MVP, assume keyframes define state AT a specific time.
      });
    });

    console.log('GSAP Timeline Loaded:', this.timeline);
  }

  play(): void { this.timeline?.play(); }
  pause(): void { this.timeline?.pause(); }
  seek(time: number): void { this.timeline?.seek(time); }
  setRate(rate: number): void { this.timeline?.timeScale(rate); }

  getPlaybackState(): PlaybackState {
    const time = this.timeline?.time() ?? 0;
    const duration = this.timeline?.duration() ?? 0;
    return {
      currentTime: time,
      progress: duration > 0 ? time / duration : 0,
      isPlaying: this.timeline?.isActive() ?? false,
      rate: this.timeline?.timeScale() ?? 1,
      duration: duration,
    };
  }

  // Basic event handling - can be expanded with a proper event emitter library
  private listeners: Map<EngineEvent, Set<EngineEventCallback>> = new Map();
  on(eventName: EngineEvent, callback: EngineEventCallback): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)?.add(callback);
  }
  off(eventName: EngineEvent, callback: EngineEventCallback): void {
    this.listeners.get(eventName)?.delete(callback);
  }
  private emit(eventName: EngineEvent, ...args: any[]): void {
    this.listeners.get(eventName)?.forEach(cb => cb(...args));
  }

  setPerspective(value: string | number | null, target: HTMLElement | null): void {
      if(target) {
          gsap.set(target, { perspective: value ?? '' });
      }
  }

  destroy(): void {
    this.timeline?.kill();
    this.timeline = null;
    this.elementMap.clear();
    this.listeners.clear();
    // Remove elements from DOM? Depends on desired behavior.
    if (this.target) this.target.innerHTML = '';
    this.target = null;
    console.log('GSAP Adapter Destroyed');
  }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Build the engine package to ensure compilation.

Command: cd packages/engine && npm run build && cd ../..

Verification: Ensure no build errors.

3. Setup AI Client & Text-to-Structure (@cineform-forge/ai-assistant)

Explanation: This package handles communication with the AI model (OpenRouter/Gemini). It takes a text prompt and asks the AI to generate the animation data structure.

Action: Navigate to the AI assistant package: cd packages/ai-assistant.

Action: Install necessary dependencies. We use openai package as OpenRouter uses a compatible API format. Add dotenv to load API keys from a .env file.

Command: npm install openai dotenv (Install Gemini SDK @google/generative-ai instead/as well if targeting Gemini directly).

Action: Create necessary files within src/:

touch src/AnimationAssistant.ts
touch src/providers/OpenRouterProvider.ts # Or GeminiProvider.ts
touch src/providers/IAiProvider.ts
touch src/utils/jsonParsing.ts
# Update src/index.ts to export the main class
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Action: Define the IAiProvider interface in src/providers/IAiProvider.ts.

// packages/ai-assistant/src/providers/IAiProvider.ts
import type { AnimationElement, TimelineData } from '@cineform-forge/shared-types';

export interface GenerateAnimationParams {
    prompt: string;
    // Add other context later if needed (e.g., existing elements, desired style)
}

export interface GenerateAnimationResponse {
    success: boolean;
    elements?: AnimationElement[];
    timeline?: TimelineData;
    error?: string; // Error message if success is false
    rawResponse?: string; // Optional: Include raw AI response for debugging
}

export interface IAiProvider {
    initialize(apiKey: string, options?: Record<string, any>): void;
    generateAnimationStructure(params: GenerateAnimationParams): Promise<GenerateAnimationResponse>;
    // Add other methods later like generateSuggestions, analyzePerformance etc.
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Implement a utility for robust JSON parsing in src/utils/jsonParsing.ts.

// packages/ai-assistant/src/utils/jsonParsing.ts
export function safeJsonParse<T>(jsonString: string | null | undefined): { success: boolean; data?: T; error?: string } {
  if (jsonString === null || jsonString === undefined || jsonString.trim() === '') {
    return { success: false, error: 'Input string is null, undefined, or empty.' };
  }
  try {
    // Attempt to find JSON block if wrapped in markdown ```json ... ```
    const match = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
    const potentialJson = match ? match[1].trim() : jsonString.trim();

    if (!potentialJson) {
         return { success: false, error: 'Extracted JSON string is empty.' };
    }

    const data = JSON.parse(potentialJson) as T;
    // Add basic validation logic here if needed, e.g., check for required keys
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: `JSON Parsing Error: ${error.message}` };
  }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Implement the OpenRouterProvider (or GeminiProvider) in src/providers/OpenRouterProvider.ts.

// packages/ai-assistant/src/providers/OpenRouterProvider.ts
import type { IAiProvider, GenerateAnimationParams, GenerateAnimationResponse } from './IAiProvider';
import OpenAI from 'openai'; // Use openai package for OpenRouter compatibility
import type { AnimationElement, TimelineData } from '@cineform-forge/shared-types';
import { safeJsonParse } from '../utils/jsonParsing';

// Define the expected structure from the AI
interface ExpectedAiResponse {
    elements: AnimationElement[];
    timeline: TimelineData;
}

export class OpenRouterProvider implements IAiProvider {
  private client: OpenAI | null = null;
  private model: string = 'openai/gpt-4o-mini'; // Default model, make configurable

  initialize(apiKey: string, options?: { model?: string, baseURL?: string }): void {
    if (!apiKey) {
        throw new Error("OpenRouter API key is required.");
    }
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: options?.baseURL ?? 'https://openrouter.ai/api/v1', // Default OpenRouter URL
    });
    this.model = options?.model ?? this.model;
    console.log(`OpenRouter Provider Initialized with model: ${this.model}`);
  }

  async generateAnimationStructure(params: GenerateAnimationParams): Promise<GenerateAnimationResponse> {
    if (!this.client) {
      return { success: false, error: 'OpenRouter client not initialized.' };
    }

    const systemPrompt = `You are an expert animation assistant. Create animation data based on the user's request.
Output *only* a single valid JSON object matching this TypeScript structure:
\`\`\`typescript
interface Response {
  elements: Array<{ id: string; type: 'shape' | 'text' | 'image'; name: string; initialProps: Record<string, any>; }>;
  timeline: { duration: number; sequences: Array<{ elementId: string; keyframes: Array<{ time: number; properties: Record<string, any>; easing?: string; }>; }>; };
}
\`\`\`
Ensure all IDs are unique strings. Use sensible initial properties (like x:0, y:0, opacity:1). Define keyframes with time (seconds), target properties, and optional easing strings (like 'power2.out'). Provide a reasonable total duration. Focus on standard web animation properties (x, y, scale, rotation, opacity).

Example Request: "A red square fades in and moves right"
Example Output:
\`\`\`json
{
  "elements": [
    { "id": "sq1", "type": "shape", "name": "Red Square", "initialProps": { "x": 0, "y": 0, "width": 50, "height": 50, "backgroundColor": "red", "opacity": 0 } }
  ],
  "timeline": {
    "duration": 2,
    "sequences": [
      { "elementId": "sq1", "keyframes": [
        { "time": 0, "properties": { "opacity": 0, "x": 0 } },
        { "time": 1, "properties": { "opacity": 1 }, "easing": "sine.inOut" },
        { "time": 2, "properties": { "x": 100 }, "easing": "power1.out" }
      ] }
    ]
  }
}
\`\`\`
`; // End of System Prompt

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate animation elements and timeline data for: "${params.prompt}"` },
        ],
         // Attempt to use JSON mode if supported by the model/provider
         // response_format: { type: "json_object" }, // Uncomment if supported
      });

      const rawResponse = completion.choices[0]?.message?.content;
      console.log("AI Raw Response:", rawResponse); // Log for debugging

      const parsed = safeJsonParse<ExpectedAiResponse>(rawResponse);

      if (parsed.success && parsed.data?.elements && parsed.data?.timeline) {
         // Basic validation
         if (!Array.isArray(parsed.data.elements) || typeof parsed.data.timeline !== 'object' || typeof parsed.data.timeline.duration !== 'number' || !Array.isArray(parsed.data.timeline.sequences)) {
             return { success: false, error: "Parsed JSON structure is invalid.", rawResponse: rawResponse };
         }
         console.log("AI Parsed Data:", parsed.data);
         return { success: true, elements: parsed.data.elements, timeline: parsed.data.timeline, rawResponse: rawResponse };
      } else {
        return { success: false, error: `Failed to parse valid JSON from AI response. Parser Error: ${parsed.error}`, rawResponse: rawResponse };
      }

    } catch (error: any) {
      console.error('Error calling OpenRouter API:', error);
      return { success: false, error: `API Call Error: ${error.message}` };
    }
  }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Implement the main AnimationAssistant class in src/AnimationAssistant.ts.

// packages/ai-assistant/src/AnimationAssistant.ts
import type { IAiProvider, GenerateAnimationParams, GenerateAnimationResponse } from './providers/IAiProvider';
import { OpenRouterProvider } from './providers/OpenRouterProvider'; // Default provider
// Import other providers like GeminiProvider if needed

export class AnimationAssistant {
  private provider: IAiProvider;

  constructor(providerType: 'openrouter' | 'gemini' = 'openrouter', apiKey: string, options?: Record<string, any>) {
    if (!apiKey) {
        console.warn("AI Provider API Key is missing. AI features will be disabled.");
        // Use a dummy provider or throw error depending on desired behavior
         this.provider = this.createDummyProvider(); // Implement dummy provider
         return;
    }

    switch (providerType) {
      case 'openrouter':
        this.provider = new OpenRouterProvider();
        break;
      // case 'gemini':
      //   this.provider = new GeminiProvider(); // Implement this provider
      //   break;
      default:
         console.warn(`Unsupported AI provider type: ${providerType}. Falling back to dummy.`);
         this.provider = this.createDummyProvider();
         return;
    }
    try {
        this.provider.initialize(apiKey, options);
    } catch (error: any) {
        console.error(`Failed to initialize AI provider: ${error.message}`);
        this.provider = this.createDummyProvider();
    }
  }

  // Expose the core generation method
  async generateAnimationStructureFromText(prompt: string): Promise<GenerateAnimationResponse> {
    if (!this.provider || this.isDummyProvider(this.provider)) {
        return { success: false, error: "AI Assistant is not configured or API key is missing." };
    }
    const params: GenerateAnimationParams = { prompt };
    return this.provider.generateAnimationStructure(params);
  }

  // Add generateSuggestions method later

  // --- Helper for fallback ---
  private createDummyProvider(): IAiProvider {
    return {
      initialize: () => {},
      generateAnimationStructure: async () => ({ success: false, error: 'AI provider is not configured.' }),
      // Implement dummy versions of other methods
    };
  }
   private isDummyProvider(provider: IAiProvider): boolean {
      // Simple check based on implementation detail or add a specific property
      return typeof (provider as any).isDummy !== 'undefined';
   }

}
// Add isDummy property to DummyProvider implementation if using that check
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Update src/index.ts to export the main class.

// packages/ai-assistant/src/index.ts
export { AnimationAssistant } from './AnimationAssistant';
// Potentially export response types if needed externally
export type { GenerateAnimationResponse } from './providers/IAiProvider';
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Create a .env file at the root of the monorepo (/cineform-forge/.env) to store the API key securely. Do NOT commit .env files to Git. Ensure .env is listed in your root .gitignore file.

# /.env
# Add other environment variables as needed
OPENROUTER_API_KEY="your_openrouter_api_key_here"
# GEMINI_API_KEY="your_gemini_api_key_here"
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END

Action: Build the AI assistant package.

Command: cd packages/ai-assistant && npm run build && cd ../..

4. Create Core UI Components (webapp)

Explanation: Build the essential React components that form the user interface: the preview area, a basic timeline display, panels for elements and properties, and the AI prompt input.

Action: Navigate to the webapp source directory: cd apps/webapp/src.

Action: Create a components directory and subdirectories for organization:

mkdir components
mkdir components/PreviewPanel
mkdir components/TimelineEditor
mkdir components/ElementsPanel
mkdir components/PropertiesPanel
mkdir components/AIPrompt
mkdir components/Layout
mkdir hooks # For custom hooks
mkdir state # For state management (e.g., Zustand store)
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Action: Create the component files (e.g., components/PreviewPanel/PreviewPanel.tsx, components/PreviewPanel/PreviewPanel.module.css, etc.).

Action (components/PreviewPanel/PreviewPanel.tsx): Implement the component. It needs a container div for the engine to target and should instantiate the CineforgeEngine.

// apps/webapp/src/components/PreviewPanel/PreviewPanel.tsx
import React, { useRef, useEffect, useState } from 'react';
import { CineforgeEngine } from '@cineform-forge/engine';
import type { ProjectData } from '@cineform-forge/shared-types';
import styles from './PreviewPanel.module.css'; // Create basic CSS module

interface PreviewPanelProps {
  projectData: ProjectData | null;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ projectData }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CineforgeEngine | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize engine on mount
  useEffect(() => {
    if (previewRef.current && !engineRef.current) {
      console.log("Initializing Cineforge Engine...");
      engineRef.current = new CineforgeEngine(previewRef.current);
      // Set initial perspective if desired
      engineRef.current.setPerspective('1000px');
    }
    // Cleanup engine on unmount
    return () => {
      console.log("Destroying Cineforge Engine...");
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  // Load timeline when project data changes
  useEffect(() => {
    const load = async () => {
        if (engineRef.current && projectData) {
            console.log("Loading timeline into engine:", projectData.timeline, projectData.elements);
            setIsLoading(true);
            try {
                await engineRef.current.loadTimeline(projectData.timeline, projectData.elements);
            } catch (error) {
                 console.error("Error loading timeline:", error);
            } finally {
                 setIsLoading(false);
            }
        } else if (engineRef.current && !projectData) {
            // Handle unloading or resetting the engine if projectData becomes null
             await engineRef.current.loadTimeline({ duration: 0, sequences: [], version: 1 }, []);
        }
    };
    load();
  }, [projectData]);

  // Basic controls (add buttons later)
  const handlePlay = () => engineRef.current?.play();
  const handlePause = () => engineRef.current?.pause();
  const handleSeek = (time: number) => engineRef.current?.seek(time);

  return (
    <div className={styles.previewPanel}>
      {/* Add Play/Pause/Seek controls here later */}
      <div ref={previewRef} className={styles.previewArea}>
         {isLoading && <div className={styles.loadingOverlay}>Loading...</div>}
         {/* Engine renders elements inside here */}
      </div>
    </div>
  );
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

CSS (PreviewPanel.module.css): Add basic styles for layout, background, and the preview area (e.g., position relative, overflow hidden).

Action (components/TimelineEditor/TimelineEditor.tsx): Implement a basic, read-only visual representation of the timeline data for now.

// apps/webapp/src/components/TimelineEditor/TimelineEditor.tsx
import React from 'react';
import type { TimelineData } from '@cineform-forge/shared-types';
import styles from './TimelineEditor.module.css';

interface TimelineEditorProps {
  timelineData: TimelineData | null;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ timelineData }) => {
  if (!timelineData) {
    return <div className={styles.timelineEditor}>No timeline data.</div>;
  }

  // VERY basic representation for MVP
  return (
    <div className={styles.timelineEditor}>
      <h3>Timeline (Duration: {timelineData.duration}s)</h3>
      {timelineData.sequences.map((seq, index) => (
        <div key={index} className={styles.sequence}>
          <span>Element: {seq.elementId}</span>
          <div className={styles.keyframes}>
            {seq.keyframes.map((kf, kfIndex) => (
              <div key={kfIndex} className={styles.keyframe} style={{ left: `${(kf.time / timelineData.duration) * 100}%` }}>
                T:{kf.time.toFixed(1)}
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Add time ruler later */}
    </div>
  );
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

CSS (TimelineEditor.module.css): Add basic styles for layout, sequence rows, and positioning keyframe markers.

Action (components/ElementsPanel/ElementsPanel.tsx): List the elements.

// apps/webapp/src/components/ElementsPanel/ElementsPanel.tsx
import React from 'react';
import type { AnimationElement } from '@cineform-forge/shared-types';
import styles from './ElementsPanel.module.css';

interface ElementsPanelProps {
  elements: AnimationElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
}

export const ElementsPanel: React.FC<ElementsPanelProps> = ({ elements, selectedElementId, onSelectElement }) => {
  return (
    <div className={styles.elementsPanel}>
      <h3>Elements</h3>
      <ul>
        {elements.map((el) => (
          <li
            key={el.id}
            className={el.id === selectedElementId ? styles.selected : ''}
            onClick={() => onSelectElement(el.id)}
          >
            {el.name} ({el.type}) - ID: {el.id.substring(0, 4)}...
          </li>
        ))}
      </ul>
    </div>
  );
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

CSS (ElementsPanel.module.css): Basic list styling, highlight for selected item.

Action (components/PropertiesPanel/PropertiesPanel.tsx): Display properties (read-only).

// apps/webapp/src/components/PropertiesPanel/PropertiesPanel.tsx
import React from 'react';
import type { AnimationElement } from '@cineform-forge/shared-types';
import styles from './PropertiesPanel.module.css';

interface PropertiesPanelProps {
  selectedElement: AnimationElement | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement }) => {
  if (!selectedElement) {
    return <div className={styles.propertiesPanel}>Select an element to see properties.</div>;
  }

  return (
    <div className={styles.propertiesPanel}>
      <h3>Properties: {selectedElement.name}</h3>
      <pre>{JSON.stringify(selectedElement.initialProps, null, 2)}</pre>
      {/* Add keyframe property display later */}
    </div>
  );
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

CSS (PropertiesPanel.module.css): Basic panel styling.

Action (components/AIPrompt/AIPrompt.tsx): Input field and button.

// apps/webapp/src/components/AIPrompt/AIPrompt.tsx
import React, { useState } from 'react';
import styles from './AIPrompt.module.css';

interface AIPromptProps {
  onSubmitPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export const AIPrompt: React.FC<AIPromptProps> = ({ onSubmitPrompt, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmitPrompt(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.aiPromptForm}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the animation..."
        disabled={isLoading}
        className={styles.promptInput}
      />
      <button type="submit" disabled={isLoading || !prompt.trim()} className={styles.submitButton}>
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

CSS (AIPrompt.module.css): Style the form, input, and button.

Action (components/Layout/AppLayout.tsx): Create a simple layout component to arrange the panels.

// apps/webapp/src/components/Layout/AppLayout.tsx
import React from 'react';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  header?: React.ReactNode;
  leftPanel?: React.ReactNode;
  mainPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  bottomPanel?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ header, leftPanel, mainPanel, rightPanel, bottomPanel }) => {
  return (
    <div className={styles.appLayout}>
      {header && <header className={styles.header}>{header}</header>}
      <main className={styles.mainContent}>
        {leftPanel && <aside className={styles.leftPanel}>{leftPanel}</aside>}
        {mainPanel && <section className={styles.mainPanel}>{mainPanel}</section>}
        {rightPanel && <aside className={styles.rightPanel}>{rightPanel}</aside>}
      </main>
      {bottomPanel && <footer className={styles.bottomPanel}>{bottomPanel}</footer>}
    </div>
  );
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

CSS (AppLayout.module.css): Use CSS Grid or Flexbox to create the desired multi-panel layout.

5. Implement Core Application Logic (webapp)

Explanation: Set up state management to hold the ProjectData and connect the UI components. Wire the AI prompt input to fetch data from the AnimationAssistant.

Action: Install a state management library (e.g., Zustand).

Command: cd apps/webapp && npm install zustand && cd ../..

Action: Create a Zustand store in src/state/projectStore.ts.

// apps/webapp/src/state/projectStore.ts
import { create } from 'zustand';
import type { ProjectData, AnimationElement, TimelineData } from '@cineform-forge/shared-types';
import { AnimationAssistant } from '@cineform-forge/ai-assistant';
import type { GenerateAnimationResponse } from '@cineform-forge/ai-assistant'; // Export this type if not already

// Load API Key from environment variable (Vite specific way)
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string;

interface ProjectState {
  projectData: ProjectData | null;
  selectedElementId: string | null;
  isLoadingAi: boolean;
  aiError: string | null;
  assistant: AnimationAssistant; // Store assistant instance

  setProjectData: (data: ProjectData | null) => void;
  setSelectedElementId: (id: string | null) => void;
  generateAnimation: (prompt: string) => Promise<void>;
  loadProject: (data: ProjectData) => void; // For loading from storage
  createNewProject: () => void;
}

const createNewEmptyProject = (): ProjectData => ({
    id: crypto.randomUUID(),
    metadata: { name: 'Untitled Project', createdAt: new Date().toISOString(), lastModified: new Date().toISOString() },
    elements: [],
    timeline: { duration: 5, sequences: [], version: 1 }, // Default 5s duration
    schemaVersion: 1,
});

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectData: null, // Start with no project loaded
  selectedElementId: null,
  isLoadingAi: false,
  aiError: null,
  // Initialize assistant - handle missing API key gracefully
  assistant: new AnimationAssistant('openrouter', apiKey || '', { model: 'openai/gpt-4o-mini' /* Or configure model */ }),

  setProjectData: (data) => set({ projectData: data, selectedElementId: null, aiError: null }), // Reset selection on project change

  setSelectedElementId: (id) => set({ selectedElementId: id }),

  generateAnimation: async (prompt) => {
    set({ isLoadingAi: true, aiError: null });
    const assistant = get().assistant;
    try {
        const response: GenerateAnimationResponse = await assistant.generateAnimationStructureFromText(prompt);
        if (response.success && response.elements && response.timeline) {
            const newProjectData: ProjectData = {
                ...(get().projectData || createNewEmptyProject()), // Keep existing metadata or create new
                id: get().projectData?.id || crypto.randomUUID(),
                elements: response.elements,
                timeline: response.timeline,
                metadata: {
                     ...(get().projectData?.metadata || createNewEmptyProject().metadata),
                     name: `Generated: ${prompt.substring(0,20)}...`, // Update name
                     lastModified: new Date().toISOString(),
                }
            };
            set({ projectData: newProjectData, isLoadingAi: false, selectedElementId: null });
        } else {
            console.error("AI Generation Error:", response.error);
            set({ isLoadingAi: false, aiError: response.error ?? 'Unknown AI generation error.' });
        }
    } catch (error: any) {
        console.error("Error calling generateAnimation:", error);
        set({ isLoadingAi: false, aiError: `Failed to generate animation: ${error.message}` });
    }
  },

  loadProject: (data) => {
     // Add schema version check/migration logic here later
     console.log("Loading project:", data);
     set({ projectData: data, selectedElementId: null, aiError: null });
  },

  createNewProject: () => {
     console.log("Creating new project");
     set({ projectData: createNewEmptyProject(), selectedElementId: null, aiError: null });
  },

}));
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Note: Accessing env variables in Vite requires the VITE_ prefix. Ensure your .env file uses VITE_OPENROUTER_API_KEY=....

Action: Modify src/App.tsx to use the store and layout.

// apps/webapp/src/App.tsx
import React from 'react';
import { useProjectStore } from './state/projectStore';
import { AppLayout } from './components/Layout/AppLayout';
import { PreviewPanel } from './components/PreviewPanel/PreviewPanel';
import { TimelineEditor } from './components/TimelineEditor/TimelineEditor';
import { ElementsPanel } from './components/ElementsPanel/ElementsPanel';
import { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel';
import { AIPrompt } from './components/AIPrompt/AIPrompt';
import './App.css'; // Add basic app-level styles

function App() {
  const {
    projectData,
    selectedElementId,
    isLoadingAi,
    aiError,
    setSelectedElementId,
    generateAnimation,
    loadProject, // Add save/load logic later
    createNewProject
  } = useProjectStore();

  // Find selected element data
  const selectedElement = projectData?.elements.find(el => el.id === selectedElementId) ?? null;

  // Add simple save/load handlers later using localStorage
  const handleSave = () => {
      if (projectData) {
          localStorage.setItem('cineformProject', JSON.stringify(projectData));
          alert('Project Saved!');
      }
  };
  const handleLoad = () => {
       const savedData = localStorage.getItem('cineformProject');
       if (savedData) {
           try {
               const parsedData = JSON.parse(savedData);
               // Add validation here later
               loadProject(parsedData);
               alert('Project Loaded!');
           } catch (e) {
               alert('Failed to load project.');
               console.error("Error loading project from localStorage:", e);
           }
       } else {
           alert('No saved project found.');
       }
  };

  return (
    <AppLayout
      header={
        <div>
          <h1>Cineform Forge</h1>
          <button onClick={createNewProject}>New</button>
          <button onClick={handleSave} disabled={!projectData}>Save</button>
          <button onClick={handleLoad}>Load</button>
          {aiError && <span style={{ color: 'red', marginLeft: '10px' }}>AI Error: {aiError}</span>}
        </div>
      }
      leftPanel={
        <ElementsPanel
          elements={projectData?.elements ?? []}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
        />
      }
      mainPanel={
        <PreviewPanel projectData={projectData} />
      }
      rightPanel={
        <PropertiesPanel selectedElement={selectedElement} />
      }
      bottomPanel={
        <>
          <AIPrompt onSubmitPrompt={generateAnimation} isLoading={isLoadingAi} />
          <TimelineEditor timelineData={projectData?.timeline ?? null} />
        </>
      }
    />
  );
}

export default App;
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Add basic styles in src/App.css for layout and component arrangement.

6. Implement Basic Project Management (webapp)

Explanation: Allow users to save their current project state to the browser's Local Storage and load it back later.

Action: Implement the handleSave and handleLoad functions within App.tsx as shown in the previous step. These use localStorage.setItem and localStorage.getItem.

Action: Implement the loadProject and createNewProject actions in the Zustand store (src/state/projectStore.ts) as shown above.

7. Implement Basic Animation Templates (@cineform-forge/templates-library)

Explanation: Create a few hardcoded example animations that users can load.

Action: Navigate to the templates library package: cd packages/templates-library.

Action: Create src/templates/SimpleFadeIn.ts (and similar files for other basic templates like SlideUp.ts).

// packages/templates-library/src/templates/SimpleFadeIn.ts
import type { ProjectData, AnimationElement, TimelineData } from '@cineform-forge/shared-types';

const simpleFadeInElements: AnimationElement[] = [
  { id: 'fade-target-1', type: 'shape', name: 'Fading Box', initialProps: { x: 50, y: 50, width: 80, height: 80, backgroundColor: '#3498db', opacity: 0, borderRadius: '5px' } }
];

const simpleFadeInTimeline: TimelineData = {
  duration: 1,
  version: 1,
  sequences: [
    { elementId: 'fade-target-1', keyframes: [
      { time: 0, properties: { opacity: 0 } },
      { time: 1, properties: { opacity: 1 }, easing: 'power1.inOut' }
    ]}
  ]
};

export const SimpleFadeInTemplate: Omit<ProjectData, 'id' | 'metadata'> = {
    elements: simpleFadeInElements,
    timeline: simpleFadeInTimeline,
    schemaVersion: 1,
};
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Update src/index.ts to export the templates.

// packages/templates-library/src/index.ts
export { SimpleFadeInTemplate } from './templates/SimpleFadeIn';
// export { SlideUpTemplate } from './templates/SlideUp'; // Add more
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Build the templates library: npm run build.

Action: Navigate back to the root: cd ../...

Action: Install the templates library as a dependency in the webapp.

Edit apps/webapp/package.json, add to dependencies: "@cineform-forge/templates-library": "workspace:*"

Run npm install from the root.

Action: Add buttons or a dropdown in the webapp (App.tsx header or a dedicated panel) to load these templates into the project state using useProjectStore.

// Add to App.tsx imports
import { SimpleFadeInTemplate } from '@cineform-forge/templates-library';

// Add inside App component
const loadTemplate = (template: Omit<ProjectData, 'id' | 'metadata'>) => {
    const newProject: ProjectData = {
         id: crypto.randomUUID(),
         metadata: { name: 'Loaded Template', createdAt: new Date().toISOString(), lastModified: new Date().toISOString() },
         ...template
    };
    loadProject(newProject); // Use the existing load action
    alert('Template Loaded!');
}

// Add button in the header section of AppLayout
<button onClick={() => loadTemplate(SimpleFadeInTemplate)}>Load Fade In Template</button>
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

8. Testing (testing-utils, webapp, engine)

Explanation: Write basic tests to ensure the core pieces work as expected.

Action: Install testing libraries at the root.

Command: npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event --workspace-root (Adjust if using Vitest).

Action: Configure Jest (create jest.config.js at the root) or Vitest (vite.config.ts in webapp). Configure ts-jest preset.

Action: Add a test script to the root package.json: "test": "turbo run test". Add "test": "jest" (or vitest) scripts to individual package package.json files.

Action: Write basic unit tests for:

CineforgeEngine class (mock the adapter). Test loadTimeline, play, pause calls.

AnimationAssistant (mock the AI provider API call). Test prompt input and response parsing/error handling.

Core React components (AIPrompt, ElementsPanel rendering based on props). Use @testing-library/react.

Action: Write a basic integration test for the text-to-animation flow within the webapp (mocking the AI call, verifying state updates).

Verification: Run npm run test from the root and ensure tests pass.

9. Development Build & Run

Action: Ensure your .env file at the root has the VITE_OPENROUTER_API_KEY set.

Action: Run the development server for the webapp from the root directory.

Command: npm run dev --filter webapp (or turbo run dev --filter webapp)

Action: Open the displayed URL (e.g., http://localhost:5173) in your browser.

Verification:

Does the basic UI layout appear?

Can you type a prompt (e.g., "Blue circle fades in") and click Generate?

Does the AI response (check console) get processed?

Does the preview panel update to show the described element?

Does the timeline editor show basic sequence info?

Do the Save/Load/New/Template buttons have basic functionality?

End of Phase 1 - Verification Checklist:

Can the CineforgeEngine be instantiated and load basic TimelineData?

Does the GSAPAdapter correctly translate TimelineData into GSAP animations (check browser devtools/console)?

Can the AnimationAssistant be instantiated with an API key (from .env)?

Does calling generateAnimationStructureFromText attempt to contact the AI API (OpenRouter)?

Is the AI response parsed correctly, or are parsing/API errors handled gracefully?

Does the webapp display the main layout (AppLayout)?

Do the core components (PreviewPanel, TimelineEditor, ElementsPanel, PropertiesPanel, AIPrompt) render?

Is the ProjectData managed correctly by the Zustand store (useProjectStore)?

Does submitting a prompt in AIPrompt trigger the AI call and update the projectData state?

Does the PreviewPanel update visually when projectData changes?

Does the TimelineEditor reflect the loaded timelineData?

Does basic project Save/Load to Local Storage work?

Can basic animation templates be loaded?

Do the initial unit and integration tests pass (npm run test)?

Does the application run without critical errors in the browser (npm run dev --filter webapp)?

If these checks pass, the foundational MVP is complete. The core loop of AI generation -> data management -> engine rendering -> UI display is functional. The next phase will focus heavily on enhancing the workflow, intelligence, and features.

Okay, let's dive into the detailed elaboration for Phase 2: Enhancement - Workflow, Principles & Performance (High Priority).

Phase 2: Enhancement - Workflow, Principles & Performance (Detailed Elaboration)

Goal: To significantly improve the user's ability to create and refine animations. This involves making the timeline interactive, adding core animation features like scroll triggers and motion path editing, integrating AI suggestions beyond basic generation, introducing performance awareness, and laying the groundwork for more advanced rendering and physics.

AI Agent Instructions: Execute each step precisely. Build upon the codebase from Phase 1. Implement UI interactions using standard React practices. Ensure AI prompts are refined for better suggestions. Add unit and integration tests for new features. Mark completed steps with [v].

1. Implement Canvas 2D Rendering Target (@cineform-forge/engine)

Explanation: Add Canvas 2D as an alternative rendering backend. This can offer better performance than DOM for certain scenarios (many simple elements) without the complexity of WebGL.

Action: Navigate to the engine package: cd packages/engine.

Action: Create files for the Canvas 2D adapter:

mkdir -p src/adapters/canvas2d
touch src/adapters/canvas2d/Canvas2DAdapter.ts
touch src/adapters/canvas2d/CanvasElementRenderer.ts # Helper for rendering different shapes/text


Action: Implement the Canvas2DAdapter in src/adapters/canvas2d/Canvas2DAdapter.ts. This is complex; start with basic shapes and properties. Use requestAnimationFrame for the render loop. Interpolate properties based on the current time derived from a core timing mechanism (could be GSAP's core ticker or a custom RAF loop).

// packages/engine/src/adapters/canvas2d/Canvas2DAdapter.ts (Simplified Example)
import type { IEngineAdapter, EngineEvent, EngineEventCallback } from '../IEngineAdapter';
import type { PlaybackState } from '../../types/PlaybackState';
import type { AnimationElement, TimelineData, Keyframe } from '@cineform-forge/shared-types';
import gsap from 'gsap'; // Use GSAP's ticker for timing synchronization
import { renderCanvasElement } from './CanvasElementRenderer'; // You'll need to implement this

export class Canvas2DAdapter implements IEngineAdapter {
    private target: HTMLElement | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private elements: AnimationElement[] = [];
    private elementState: Map<string, Record<string, any>> = new Map(); // Current state per element
    private tickerCallback: () => void;
    private playbackState: PlaybackState = { currentTime: 0, progress: 0, isPlaying: false, rate: 1, duration: 0 };
    private timelineProxy: gsap.core.Timeline | null = null; // Use a dummy GSAP timeline for timing control

    constructor() {
        this.tickerCallback = this.tick.bind(this);
    }

    init(targetElement: HTMLElement | null): void {
        this.target = targetElement;
        if (!this.target) return;
        this.canvas = document.createElement('canvas');
        // Size canvas based on target, handle resizing later
        this.canvas.width = this.target.clientWidth;
        this.canvas.height = this.target.clientHeight;
        this.target.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Use GSAP ticker for synchronized updates
        gsap.ticker.add(this.tickerCallback);
        console.log('Canvas2D Adapter Initialized');
    }

     renderStaticElement(elementData: AnimationElement, target: HTMLElement | null): void {
         // In Canvas, static rendering often happens during loadTimeline or the first tick
         // We just need to store the element data and initial state
         if (!this.elementState.has(elementData.id)) {
             this.elementState.set(elementData.id, { ...elementData.initialProps });
         }
     }

    async loadTimeline(timelineData: TimelineData, elements: AnimationElement[]): Promise<void> {
        this.elements = elements;
        this.elementState.clear();
        elements.forEach(el => this.renderStaticElement(el, this.target)); // Store initial state

        // Use a dummy GSAP timeline primarily for controlling time, progress, play/pause state
        this.timelineProxy?.kill();
        this.timelineProxy = gsap.timeline({
            paused: true,
            duration: timelineData.duration,
            onUpdate: () => {
                this.playbackState = this.calculatePlaybackState();
                this.emit('update'); // Emit update on GSAP timeline update
            },
            onComplete: () => { this.playbackState.isPlaying = false; this.emit('complete'); },
            onStart: () => { this.playbackState.isPlaying = true; this.emit('start'); },
        });
        this.playbackState.duration = timelineData.duration;

        // **CRITICAL:** Need to pre-process timelineData to efficiently calculate
        // property values at any given time 't' during the tick() method.
        // This might involve creating interpolation functions for each property/element.
        // This is non-trivial. For MVP, could potentially *still* use GSAP
        // to tween properties on plain JS objects stored in elementState,
        // and then just read from elementState in tick().
        this.preProcessTimeline(timelineData); // Implement this complex step

        this.seek(0); // Go to start
        console.log('Canvas2D Timeline Loaded (Processed for interpolation)');
    }

    private preProcessTimeline(timelineData: TimelineData): void {
       // Implementation details:
       // Iterate through sequences and keyframes.
       // For each animated property, create a mapping or function
       // that can return the interpolated value for that property
       // at a given time 't', considering easing.
       // Store these interpolation functions accessible by element ID and property name.
       console.warn("Canvas2D preProcessTimeline needs full implementation for interpolation.");
       // --- OR ---
       // Alternative (Simpler for MVP but less performant potentially):
       // Create tweens on JS objects in this.elementState using the dummy timelineProxy.
       // Example using alternative:
       timelineData.sequences.forEach(seq => {
           const stateObj = this.elementState.get(seq.elementId);
           if(stateObj) {
               seq.keyframes.forEach(kf => {
                   const props = { ...kf.properties };
                   if(kf.easing) props.ease = kf.easing;
                   this.timelineProxy?.to(stateObj, props, 0, kf.time);
               });
           }
       });

    }

    private tick(): void {
        if (!this.ctx || !this.canvas) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update playback state based on the proxy timeline's time
        // (onUpdate callback on timelineProxy handles this mostly)
        //const currentTime = this.timelineProxy?.time() ?? this.playbackState.currentTime;

        // Draw each element based on its current interpolated state
        this.elements.forEach(element => {
            // **CRITICAL:** Get the *current* interpolated properties for 'currentTime'.
            // If using the GSAP object tweening alternative: read directly from this.elementState.get(element.id)
            // If using custom interpolation: call interpolation functions with 'currentTime'.
            const currentState = this.elementState.get(element.id) ?? element.initialProps;
            if (this.ctx) {
                renderCanvasElement(this.ctx, element, currentState); // Implement this helper
            }
        });
    }

    play(): void { this.timelineProxy?.play(); this.playbackState.isPlaying = true;}
    pause(): void { this.timelineProxy?.pause(); this.playbackState.isPlaying = false;}
    seek(time: number): void {
        // Pause, seek, and briefly resume/pause ticker to force single render at seek time
        const wasPlaying = this.playbackState.isPlaying;
         this.timelineProxy?.pause().seek(time);
         gsap.ticker.tick(); // Force one render cycle
         if(wasPlaying) this.timelineProxy?.play();
         else this.timelineProxy?.pause(); // Ensure it stays paused if it was
         this.playbackState = this.calculatePlaybackState(); // Update state immediately
    }
    setRate(rate: number): void { this.timelineProxy?.timeScale(rate); this.playbackState.rate = rate; }

    private calculatePlaybackState(): PlaybackState {
        const time = this.timelineProxy?.time() ?? 0;
        const duration = this.playbackState.duration; // Duration doesn't change
        return {
          currentTime: time,
          progress: duration > 0 ? time / duration : 0,
          isPlaying: this.timelineProxy?.isActive() ?? false,
          rate: this.timelineProxy?.timeScale() ?? 1,
          duration: duration,
        };
    }
    getPlaybackState(): PlaybackState { return this.playbackState; }

    // Event handling (delegate to internal emitter or implement basic version)
    private listeners: Map<EngineEvent, Set<EngineEventCallback>> = new Map(); // Copy from GSAPAdapter or use library
    on(eventName: EngineEvent, callback: EngineEventCallback): void {/* ... */}
    off(eventName: EngineEvent, callback: EngineEventCallback): void {/* ... */}
    private emit(eventName: EngineEvent, ...args: any[]): void {/* ... */}

     setPerspective(value: string | number | null, target: HTMLElement | null): void {
         console.warn("Canvas2D adapter does not directly support CSS perspective.");
         // No-op for Canvas2D regarding CSS perspective
     }

    destroy(): void {
        gsap.ticker.remove(this.tickerCallback); // Remove from GSAP ticker
        this.timelineProxy?.kill();
        this.timelineProxy = null;
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;
        this.ctx = null;
        this.elements = [];
        this.elementState.clear();
        this.listeners.clear();
        console.log('Canvas2D Adapter Destroyed');
    }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Implement the helper renderCanvasElement in src/adapters/canvas2d/CanvasElementRenderer.ts. Handle different element.type values (shape, text, image) and draw them using the currentState properties (x, y, width, height, backgroundColor, opacity, rotation, scale, etc.). Handle transformations (translate, rotate, scale) using ctx.save(), ctx.translate(), ctx.rotate(), ctx.scale(), ctx.restore().

Action: Update CineforgeEngine to allow selecting the adapter based on RenderingOptions. For now, you might add a constructor option or a method setRenderingTarget('dom' | 'canvas2d').

Action: Build the engine package: cd packages/engine && npm run build && cd ../..

2. WASM/WebGL Prep (@cineform-forge/engine)

Explanation: Prepare the engine structure for later integration without fully implementing these complex features yet.

Action: Define IPhysicsAdapter interface in src/adapters/IPhysicsAdapter.ts (methods like init, addBody, applyForce, step, getBodyState, destroy).

Action: Add placeholder methods in CineforgeEngine for physics interactions (e.g., enablePhysics(elementId, options), applyForce(elementId, force)). These should initially throw "Not Implemented" errors.

Action: Add capability in PreviewPanel.tsx (webapp) to create a WebGL canvas (document.createElement('canvas')). Add basic WebGL context acquisition (canvas.getContext('webgl')). Add configuration in RenderingOptions to select webgl or webgpu.

Verification: Ensure the engine package still builds.

3. Implement Animation Principles API Foundation (@cineform-forge/engine)

Explanation: Provide ways to easily apply core animation principles.

Action: Create src/principles/applyAnticipation.ts (and similar files for overshoot, squash/stretch helpers if desired).

Action: Implement applyAnticipation. This function would likely take an AnimationSequence and insert small counter-movement keyframes before the main action.

// packages/engine/src/principles/applyAnticipation.ts (Conceptual)
import type { AnimationSequence, Keyframe } from '@cineform-forge/shared-types';

export function applyAnticipation(sequence: AnimationSequence, intensity: number = 0.1): AnimationSequence {
    const newKeyframes: Keyframe[] = [];
    // Logic: Iterate through keyframes. Before a significant property change,
    // insert a keyframe slightly before it that moves slightly in the *opposite* direction.
    // The 'intensity' would control the amount of counter-movement and duration.
    // This requires careful handling of timing and existing keyframes.
    console.warn("applyAnticipation function needs implementation.");
    return { ...sequence, keyframes: sequence.keyframes }; // Return unmodified for now
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Export these helper functions from src/index.ts.

4. Implement Scroll-Based Triggers (@cineform-forge/engine & webapp)

Explanation: Allow animations to be triggered or controlled by page scroll position.

Action (engine): Install GSAP ScrollTrigger plugin if using GSAP.

Command: cd packages/engine && npm install gsap && cd ../.. (If not already installed. Note: ScrollTrigger is a Club GreenSock plugin requiring membership for commercial use). Register the plugin: import { ScrollTrigger } from 'gsap/ScrollTrigger'; gsap.registerPlugin(ScrollTrigger); within the adapter.

Action (engine): Modify GSAPAdapter.loadTimeline to check for a scrollTrigger property within TimelineData or associated with specific sequences. If found, parse the ScrollTrigger options from shared-types and apply them to the GSAP timeline or tween using timeline.scrollTrigger = { ... }.

Action (webapp): Add UI elements (e.g., in PropertiesPanel or a dedicated panel) to define ScrollTrigger properties (start/end elements/positions, scrub, pin). Store this configuration alongside TimelineData or link it appropriately.

Verification: Test scroll-triggered animations in the PreviewPanel (ensure the panel itself or its parent is scrollable for testing).

5. Implement Focused AI Suggestions (@cineform-forge/ai-assistant)

Explanation: Use the AI to provide specific, actionable feedback on existing animations based on principles and performance.

Action: Navigate to packages/ai-assistant.

Action: Define the structure for suggestions in shared-types (already done in Phase 0: AnimationSuggestion).

Action: Add a new method generateSuggestions to IAiProvider and implement it in OpenRouterProvider.ts (or your chosen provider).

// Add to IAiProvider.ts
interface GenerateSuggestionsParams {
    elements: AnimationElement[];
    timeline: TimelineData;
    // Optional context like target audience, style goal
}
export interface GenerateSuggestionsResponse {
    success: boolean;
    suggestions?: AnimationSuggestion[];
    error?: string;
}
// Add method to interface:
// generateSuggestions(params: GenerateSuggestionsParams): Promise<GenerateSuggestionsResponse>;

// Add implementation to OpenRouterProvider.ts
async generateSuggestions(params: GenerateSuggestionsParams): Promise<GenerateSuggestionsResponse> {
    if (!this.client) return { success: false, error: 'Client not initialized.' };

    const systemPrompt = `You are an expert animation reviewer. Analyze the provided animation data (elements and timeline) and provide specific, actionable suggestions based on core animation principles (timing, easing, spacing, anticipation, follow-through, arcs, secondary action, appeal) and potential performance issues (e.g., animating layout properties).
    Output *only* a single valid JSON array matching this TypeScript structure:
    \`\`\`typescript
    type SuggestionType = 'easing' | 'timing' | 'principle' | 'performance';
    interface AnimationSuggestion {
      type: SuggestionType;
      targetElementId?: string; // ID of element suggestion applies to (optional)
      targetKeyframeIndex?: number; // Index of keyframe suggestion applies to (optional)
      suggestion: string; // The user-facing suggestion text
      reasoning: string; // Why this suggestion improves the animation (mention principle/performance benefit)
    }
    type Response = AnimationSuggestion[];
    \`\`\`
    Keep suggestions concise and focused. Prioritize high-impact changes. If animation looks good, return an empty array or a positive comment suggestion.

    Example Suggestion:
    { "type": "easing", "targetElementId": "sq1", "targetKeyframeIndex": 2, "suggestion": "Use an 'elastic.out(1, 0.3)' ease here.", "reasoning": "Adds more character and overshoot, enhancing appeal for the bounce effect." }
    { "type": "timing", "suggestion": "Increase the delay between element A and B entering.", "reasoning": "Improves spacing and prevents the animation from feeling too rushed." }
    { "type": "principle", "targetElementId": "char1", "suggestion": "Add slight anticipation (brief move opposite direction) before the jump.", "reasoning": "Applying the 'Anticipation' principle makes the jump more believable and impactful." }
    { "type": "performance", "targetElementId": "list-item-3", "suggestion": "Animate 'transform: translateY' instead of 'margin-top'.", "reasoning": "Transforms are generally more performant as they don't trigger layout recalculations." }
    `;

    const animationDataString = JSON.stringify({ elements: params.elements, timeline: params.timeline }, null, 2);
    // Truncate if too long for context window
    const maxInputLength = 3000; // Adjust based on model limits
    const truncatedData = animationDataString.length > maxInputLength
         ? animationDataString.substring(0, maxInputLength) + "\n... (data truncated)"
         : animationDataString;


    try {
        const completion = await this.client.chat.completions.create({
            model: this.model, // Use appropriate model
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Analyze this animation data and provide suggestions:\n${truncatedData}` },
            ],
            // response_format: { type: "json_object" }, // Ideal if supported, but expect array
        });
        const rawResponse = completion.choices[0]?.message?.content;
        const parsed = safeJsonParse<AnimationSuggestion[]>(rawResponse); // Expecting an array

        if (parsed.success && Array.isArray(parsed.data)) {
             // Add validation for each suggestion object if needed
            return { success: true, suggestions: parsed.data };
        } else {
            // Attempt to parse even if not perfect JSON array structure
            console.warn("AI suggestion parsing failed, raw:", rawResponse, "Error:", parsed.error);
            // Try to extract suggestions manually if possible as fallback? Risky.
            return { success: false, error: `Failed to parse valid JSON array from AI response. Error: ${parsed.error}` };
        }
    } catch (error: any) {
        return { success: false, error: `API Call Error: ${error.message}` };
    }
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
TypeScript
IGNORE_WHEN_COPYING_END

Action: Expose this new method through the AnimationAssistant class.

Action: Build the package: cd packages/ai-assistant && npm run build && cd ../...

6. Enhance Timeline Editor (webapp)

Explanation: Make the timeline interactive, allowing users to directly manipulate keyframes and timing.

Action: Navigate to apps/webapp.

Action: Choose and install a library for drag-and-drop if needed (e.g., dnd-kit, react-beautiful-dnd, or implement using native HTML5 DnD API).

Action: Refactor components/TimelineEditor/TimelineEditor.tsx:

Make keyframe markers draggable horizontally to change keyframe.time. Calculate new time based on drag distance relative to timeline width and duration. Update the state in projectStore.

Add click handlers to keyframes to select them. Update selectedKeyframe state (add this to projectStore).

When a keyframe is selected, display its properties in the PropertiesPanel and allow editing.

Implement adding new keyframes (e.g., double-click on a sequence track at a specific time).

Implement deleting keyframes (e.g., select + delete key).

Add a visual time indicator (playhead) that moves based on engine.getPlaybackState().currentTime (use useEffect with an interval or engine's 'update' event). Allow dragging the playhead to seek.

7. Implement Motion Path Editor (Basic) (webapp)

Explanation: Visualize the path an element takes based on its x and y keyframes and allow manipulation.

Action: In components/PreviewPanel/PreviewPanel.tsx:

When an element with x/y keyframes is selected, calculate the points along its path (can use GSAP MotionPathPlugin helper MotionPathPlugin.pointsToPath() or manual interpolation).

Draw this path as an SVG overlay on top of the preview area.

Draw handles (small circles) at each keyframe point on the path.

Make these handles draggable. Dragging a handle should update the x/y values of the corresponding keyframe in the projectStore.

Advanced (Optional for Phase 2): Implement Bezier control handles for smoother curve editing (requires more complex math/SVG path manipulation).

8. Integrate AI Suggestions (webapp)

Explanation: Display suggestions from the AI and allow users to apply them.

Action: Create a new component components/AISuggestions/AISuggestionsPanel.tsx.

Action: Add state to projectStore to hold suggestions: AnimationSuggestion[] and isLoadingSuggestions: boolean.

Action: Add a button (e.g., "Get Suggestions") that calls a new action in projectStore (fetchSuggestions). This action calls assistant.generateSuggestions with the current projectData and updates the store state.

Action: The AISuggestionsPanel component should display the list of suggestions from the store.

Action: For each suggestion, if it has an applyFunction (or if you implement logic based on suggestion type and targets), show an "Apply" button. Clicking it should modify the projectData in the store accordingly (e.g., change easing value, adjust timing).

9. Refine Beginner Mode (webapp)

Explanation: Make the initial experience much simpler and guided.

Action: Add UI state for uiMode: 'Beginner' | 'Pro' in projectStore (if not done in Phase 1) and a toggle button.

Action: In App.tsx and child components, use conditional rendering based on uiMode:

Beginner: Hide PropertiesPanel, NodeEditor (Phase 3), advanced timeline controls. Show ElementsPanel (simplified), PreviewPanel, AIPrompt, AISuggestionsPanel (prominently), Templates Library. Maybe show a simplified timeline view.

Pro: Show all panels and controls.

Action: Implement basic contextual help/tooltips for Beginner Mode using a library like react-tooltip or custom components.

Action: Consider creating a guided tutorial sequence for beginners (can be implemented later, but plan for hooks).

10. Implement Basic Audio Syncing (webapp / engine)

Explanation: Allow adding an audio track and visualizing its waveform.

Action (webapp): Add a file input to load an audio file (MP3, WAV). Store the audio source (e.g., as a Blob URL) in projectStore.

Action (webapp): Use the Web Audio API (AudioContext, decodeAudioData, createBufferSource) to decode the audio and get its waveform data (e.g., by averaging samples).

Action (webapp): In TimelineEditor.tsx, add a track to draw the audio waveform using the decoded data (e.g., drawing vertical lines on a <canvas>).

Action (engine / webapp): Coordinate audio playback. The CineforgeEngine's play/pause/seek should also control the Web Audio AudioBufferSourceNode (start, stop, offset calculation). Ensure timing is synchronized.

11. Enhance Export (webapp)

Explanation: Improve the quality and options for exporting animations.

Action: Refactor ExportManager.ts.

Action: Improve exportToCSS: Handle more properties, generate cleaner code, potentially add vendor prefixes.

Action: Improve exportToLottieJSON: Ensure compatibility with Lottie players, handle more element types/properties if possible.

Action: Implement exportToOptimizedJS: Generate standalone JavaScript code using GSAP (or Motion One) that replicates the animation. Include necessary library initialization. Make code readable and performant.

12. Implement Basic Versioning (webapp)

Explanation: Allow users to undo/redo changes.

Action: Refine the state management in projectStore to support history. Libraries like zustand/middleware/temporal can simplify this significantly. Each action that modifies projectData should create a new state in the history stack.

Action: Add Undo and Redo buttons to the UI that trigger the temporal store's actions.

13. Implement Animation Grouping & Stagger Helpers (webapp)

Explanation: Improve workflow for common multi-element animations.

Action (webapp): Allow selecting multiple elements in ElementsPanel.

Action (webapp): Add a "Group" button. This creates a new AnimationElement of type group, adds the selected elements as children (need to update AnimationElement interface if nesting is required), and updates the projectStore. Allow ungrouping. (Grouping might affect rendering logic).

Action (webapp): Add a "Stagger" helper UI. When multiple elements are selected, allow users to input a stagger amount (seconds). This function should automatically adjust the time property of keyframes across the selected elements' sequences to create the stagger effect. Update projectStore.

14. Enhance Developer Tools (webapp)

Explanation: Provide more visual feedback during animation creation.

Action: Improve the timeline inspector: Show property values at the current playhead time.

Action: Enhance the motion path visualizer: Add options for colors, handle visibility toggles.

15. Accessibility & Inclusivity (webapp)

Explanation: Improve accessibility checks and high contrast support.

Action: Configure axe-core (installed in Phase 2) to run more specific checks related to motion (bypass, animation), flashing (color-contrast, potentially custom checks for flash frequency if possible), and keyboard accessibility of custom controls. Integrate results into the UI or dev console prominently.

Action: Test the UI in OS-level High Contrast / Increased Contrast modes. Identify and fix any issues where UI elements become invisible or unusable. Use CSS system-color keywords where appropriate or provide alternative themes.

16. Testing (testing-utils, webapp, engine)

Action: Write unit tests for new features: Canvas2D adapter (basic rendering), scroll trigger application logic (mocking intersection observers/GSAP plugin), AI suggestion generation (mocking API), timeline interactions (drag/drop, edit), grouping/staggering logic, audio loading/parsing.

Action: Write integration tests for: Timeline editing affecting preview, motion path dragging updating state, applying AI suggestions modifying the animation.

Action: Set up basic Visual Regression Testing locally (jest-image-snapshot) or integrate a service (Percy/Chromatic) into CI for key UI components (Timeline, Preview structure).

Action: Define initial Animation Quality Metrics (e.g., function to calculate average frame duration variance) in testing-utils and integrate basic checks into tests where possible.

End of Phase 2 - Verification Checklist:

Can the engine render basic animations using the Canvas 2D target?

Are placeholders for WASM physics and WebGL rendering integrated without breaking existing functionality?

Is the foundation for applying animation principles (e.g., applyAnticipation helper) present?

Can scroll-triggered animations be defined in the UI and executed by the engine?

Can the AI generate relevant suggestions for improving animations (easing, timing, principles)?

Is the Timeline Editor interactive (drag keyframes, edit properties, add/delete keyframes, draggable playhead)?

Does the basic Motion Path visualizer appear for selected elements and allow handle dragging?

Are AI suggestions displayed, and can simple ones be applied?

Is the Beginner Mode UI significantly simpler and more guided than the Pro Mode?

Can an audio file be loaded, its waveform visualized, and playback synchronized with the animation?

Does the exportToOptimizedJS function generate runnable GSAP/Motion One code?

Does Undo/Redo functionality work correctly using the history stack?

Can elements be grouped, and can stagger effects be applied easily via the UI?

Are the Developer Tools (timeline inspector, motion path) enhanced?

Are specific accessibility checks for motion/flashing implemented? Does the UI work in High Contrast mode?

Do unit, integration, and initial visual/quality tests pass for the new features?

Completing Phase 2 marks a major milestone. The tool is now significantly more powerful and usable for creating and refining animations, with integrated intelligence and core professional workflow features.

Alright, let's proceed with the detailed elaboration for Phase 3: Expansion - Pro Tools, Refinement & Optimization.

Phase 3: Expansion - Pro Tools, Refinement & Optimization (Detailed Elaboration)

Goal: To elevate Cineform Forge to a professional-grade tool by adding advanced features like physics, a node-based editor for complex interactions, state machines, sophisticated export options, and performance optimization tools. The focus shifts towards empowering advanced users and ensuring robust, high-performance output.

AI Agent Instructions: Execute each step precisely. Integrate new libraries carefully. Focus on stability and performance of complex features. Add comprehensive tests for new logic and integrations. Mark completed steps with [v].

1. Integrate WASM Physics (Basic) (@cineform-forge/engine)

Explanation: Add real-time physics simulation capabilities using a WebAssembly library for performance. Focus on common use cases like simple collisions and gravity useful in UI/web contexts first.

Action: Navigate to the engine package: cd packages/engine.

Action: Choose and install a WASM physics library (e.g., Rapier.js). Follow its installation instructions (might involve installing a core package and a JS wrapper).

Command (Example for Rapier): npm install --save @dimforge/rapier2d (or rapier3d).

Action: Implement the WasmPhysicsAdapter (e.g., RapierAdapter.ts) in src/adapters/. This adapter should implement the IPhysicsAdapter interface defined in Phase 2.

// packages/engine/src/adapters/rapier/RapierAdapter.ts (Simplified Structure)
import type { IPhysicsAdapter, PhysicsBodyOptions, PhysicsBodyState } from '../IPhysicsAdapter'; // Define these types
import RAPIER from '@dimforge/rapier2d'; // Import the library

export class RapierAdapter implements IPhysicsAdapter {
    private world: RAPIER.World | null = null;
    private bodies: Map<string, RAPIER.RigidBody> = new Map(); // Map elementId to physics body
    private gravity: { x: number; y: number; };

    async initialize(options?: { gravity?: { x: number, y: number } }): Promise<void> {
        await RAPIER.init(); // Initialize the WASM module
        this.gravity = options?.gravity ?? { x: 0.0, y: -9.81 }; // Default gravity
        this.world = new RAPIER.World(this.gravity);
        console.log('Rapier Physics Adapter Initialized');
    }

    addBody(elementId: string, options: PhysicsBodyOptions): string | null {
         if (!this.world) return null;
         // Create RigidBodyDesc (static, dynamic, kinematic) based on options.type
         const bodyDesc = options.type === 'dynamic'
             ? RAPIER.RigidBodyDesc.dynamic()
             : options.type === 'fixed'
             ? RAPIER.RigidBodyDesc.fixed()
             : RAPIER.RigidBodyDesc.kinematicPositionBased(); // Or velocity based

         bodyDesc.setTranslation(options.x ?? 0, options.y ?? 0);
         // Add rotation, etc.

         // Create ColliderDesc (shape, size, friction, restitution)
         const colliderDesc = RAPIER.ColliderDesc.cuboid( (options.width ?? 10)/2, (options.height ?? 10)/2 ); // Example: Cuboid
         // Set friction, restitution, density from options
         colliderDesc.setRestitution(options.restitution ?? 0.7);
         colliderDesc.setFriction(options.friction ?? 0.5);

         // Create body and collider
         const body = this.world.createRigidBody(bodyDesc);
         this.world.createCollider(colliderDesc, body);

         this.bodies.set(elementId, body);
         return body.handle.toString(); // Return a handle/ID
    }

    removeBody(elementId: string): void {
        const body = this.bodies.get(elementId);
        if (body && this.world) {
            this.world.removeRigidBody(body);
            this.bodies.delete(elementId);
        }
    }

    applyForce(elementId: string, force: { x: number; y: number }): void {
        const body = this.bodies.get(elementId);
        // Apply force or impulse (check Rapier docs for specific methods)
        body?.applyImpulse({ x: force.x, y: force.y }, true);
    }

    step(deltaTime: number): void {
         if (!this.world) return;
         // Step the physics world forward
         this.world.step();
         // Consider using fixed timestep logic for stability if needed
    }

    getBodyState(elementId: string): PhysicsBodyState | null {
        const body = this.bodies.get(elementId);
        if (!body) return null;
        const pos = body.translation();
        const rot = body.rotation();
        // Get linear/angular velocity if needed
        return { x: pos.x, y: pos.y, rotation: rot };
    }

    destroy(): void {
        // Rapier doesn't have an explicit world destroy, relies on GC? Double check docs.
        this.bodies.clear();
        this.world = null;
        console.log('Rapier Physics Adapter Destroyed');
    }
}
// Define PhysicsBodyOptions and PhysicsBodyState interfaces in IPhysicsAdapter.ts


Action: Update CineforgeEngine to instantiate and manage the physics adapter. Add a stepPhysics(deltaTime) method to be called within the main animation loop (requestAnimationFrame or GSAP ticker).

Action: Add logic to CineforgeEngine and its adapters (e.g., GSAPAdapter) to update the visual representation (DOM/Canvas element's position/rotation) based on the state retrieved from physicsAdapter.getBodyState() for physics-enabled elements on each frame/tick. Ensure physics updates don't conflict with direct keyframe animations on the same properties unless intended (e.g., using kinematic bodies).

Action (webapp): Add UI elements in the PropertiesPanel to enable/disable physics for an element and configure basic physics properties (type: dynamic/static, shape, friction, restitution). Store these settings with the AnimationElement data.

2. Implement Basic WebGL/WebGPU Renderer (@cineform-forge/engine)

Explanation: Provide a rendering target for 3D elements or high-performance 2D using the GPU. Start simply.

Action: Choose a library to assist with WebGL/WebGPU (e.g., three.js, pixi.js, ogl, or build minimal abstractions). Install it in the engine package. npm install three @types/three.

Action: Create src/adapters/webgl/WebGLAdapter.ts (or similar name) implementing IEngineAdapter.

Action: Implement the WebGLAdapter. It needs to:

Initialize a WebGL/WebGPU context on the provided canvas.

Set up a scene, camera, and renderer (using the chosen library).

Implement renderStaticElement to create corresponding 3D objects (e.g., THREE.Mesh with BoxGeometry for shapes, Sprite for images, potentially TextGeometry or texture-based text). Map AnimationElement properties to 3D object properties (position, rotation, scale, material color/opacity).

Implement loadTimeline to create animations for the 3D objects (e.g., using GSAP to tween THREE.Object3D properties, or using the library's own animation system).

Implement the main render loop (tick method called by gsap.ticker or requestAnimationFrame) that calls the 3D library's renderer.render(scene, camera).

Action: Update CineforgeEngine to allow selecting the WebGLAdapter based on RenderingOptions. Ensure proper cleanup (destroy method in adapter).

Action (webapp): Add an option (e.g., in Project Settings or PreviewPanel controls) to switch the rendering target between DOM, Canvas2D, and WebGL (if available).

3. Implement Performance Metrics Tracking (@cineform-forge/engine & webapp)

Explanation: Provide tools to understand animation performance.

Action (engine): Add logic within the core engine loop (e.g., gsap.ticker callback or RAF loop) to:

Calculate frame duration (performance.now() difference between frames).

Detect dropped frames / jank (if frame duration significantly exceeds target, e.g., > 33ms for 30fps target).

Estimate CPU load (less precise, can track time spent within the tick function).

Research: Investigate performance.measureMemory() for memory tracking (experimental, requires specific flags/origins).

Action (engine): Store these metrics (e.g., rolling average FPS, jank count, tick duration). Expose them via a method like engine.getPerformanceMetrics().

Action (webapp): Create a components/DevTools/PerformanceMonitor.tsx component.

Action (webapp): Display the metrics retrieved from engine.getPerformanceMetrics() in this panel (e.g., current FPS, jank counter). Update periodically using setInterval or engine events.

4. Implement Node-Based Editor (webapp)

Explanation: Provide a visual way to create complex interactions and animation logic using nodes and connections, suitable for advanced users.

Action: Navigate to apps/webapp.

Action: Choose and install a node editor library. React Flow (@reactflow/core, @reactflow/node-resizer, @reactflow/node-toolbar) is a popular choice.

Command: npm install @reactflow/core @reactflow/node-resizer @reactflow/node-toolbar.

Action: Create a new component area for the node editor: mkdir src/components/NodeEditor.

Action: Implement NodeEditor.tsx. Use the ReactFlowProvider and ReactFlow components.

Action: Define custom node types (src/components/NodeEditor/nodes/) for:

Event Triggers: onLoad, onClick, onHover, onScrollIntersect.

Animation Control: PlaySequence (references an AnimationSequence from TimelineData), SetProperty, ControlPlayback (play/pause/seek engine).

Logic: Condition (if/else), Delay, SequenceFlow (run nodes sequentially), ParallelFlow (run nodes concurrently).

Physics: ApplyForce, SetBodyProperties.

Data: GetElementProperty, Variable.

Action: Define edge types and validation logic (e.g., only connect execution flows, ensure data types match).

Action: Store the node graph structure (nodes and edges) as part of the ProjectData (add a nodeGraph field to the interface in shared-types). Use the useReactFlow hook to manage graph state.

Action: Implement the compilation/execution logic. When the animation starts or events occur:

Traverse the node graph starting from trigger nodes.

Execute the logic defined by each node (e.g., call engine.playSequence(id), engine.applyForce(...), evaluate conditions). This requires careful state management and potentially an event bus. This "runtime" for the node graph is a complex part.

Action: Add access to the Node Editor in "Pro" UI mode.

5. Flesh out Pro Mode UI (webapp)

Explanation: Provide advanced controls needed by professional users.

Action: Implement a Curve Editor component (can use libraries like bezier-easing-editor or build a custom one using SVG/Canvas) within the PropertiesPanel for editing custom cubic-bezier easing values when a keyframe is selected. Store the bezier array (e.g., [0.25, 0.1, 0.25, 1.0]) in the keyframe.easing property. Update the engine adapters to parse and apply cubic-bezier easing.

Action: Expose advanced engine settings (e.g., default overwrite behavior, potentially physics world settings like gravity) in a dedicated settings panel accessible in Pro mode.

Action: Ensure the Node Editor is accessible and integrated within the Pro mode layout.

6. Implement Procedural Animation Tools (webapp)

Explanation: Allow generating animations algorithmically.

Action: Implement a basic JavaScript Scripting Panel. Use a library like Monaco Editor (@monaco-editor/react) for a good code editing experience.

Action: Provide a limited, sandboxed API accessible to the script. This API should allow reading the current ProjectData and generating new TimelineData or AnimationElement[] objects (don't allow direct modification of engine state from the script for security/stability). Example API functions: getCurrentProjectData(), generateSineWaveMovement(elementId, axis, amplitude, frequency), setGeneratedData(elements, timeline).

Action: Execute the user's script using new Function() in a carefully controlled manner or a more secure sandbox if possible. Update the projectStore with the data returned by setGeneratedData.

Action: Alternatively, or additionally, create UI for pre-built effects (e.g., configure a particle system - requires engine support, likely WebGL/Canvas).

7. Implement Smart Export (webapp)

Explanation: Intelligently choose the best export format based on animation content and provide optimized output.

Action: Refactor ExportManager.ts.

Action: Implement analysis logic within the ExportManager:

Check animation complexity (number of elements, keyframes, property types).

Check for interactivity (requires JS).

Check for features only supported by specific formats (e.g., advanced vector features for Lottie, physics/3D for JS/WebGL).

Check rendering target used (DOM/Canvas/WebGL).

Action: Add a suggestFormat() method that returns the recommended format based on the analysis.

Action: Enhance existing export functions (exportToCSS, exportToLottieJSON, exportToOptimizedJS) to be more robust and handle more features.

Action: Implement exportToWebGLScene (e.g., export as glTF using a THREE.GLTFExporter if using three.js) if the WebGL renderer is used.

Action: Implement basic AR export (exporting a static or baked-animation glTF/USDZ model). Libraries might be needed for USDZ conversion.

Action: Update the Export UI to show the suggested format and allow overrides. Provide options for optimization levels (e.g., code minification, Lottie asset optimization).

8. Implement Enhanced Reduced Motion (webapp)

Explanation: Provide more control over how animations adapt for users who prefer reduced motion.

Action: Add project settings or global preferences where users can configure how motion should be reduced (e.g., "Replace movement with fades", "Shorten durations", "Disable non-essential effects").

Action: Implement the logic (generateReducedMotionVariant(timelineData, options)) that takes the original TimelineData and the user's preferences to generate the simplified version. This logic will replace or modify keyframes based on the chosen strategy.

Action: Ensure the preview mode respects the prefers-reduced-motion media query (or a manual toggle) and uses the generated reduced variant. Ensure exports can include this variant (e.g., via CSS media query or conditional JS loading).

9. Implement Animation State Machines (webapp / engine)

Explanation: A structured way to handle complex interactivity where an element can be in different states with defined transitions between them.

Action: Define state machine structure in shared-types (e.g., StateMachine { states: { [stateName]: { animations: AnimationSequence[], transitions: { [eventName]: targetStateName } } }, initialState: string }). Associate state machines with AnimationElement.

Action (webapp): Create a UI (could be integrated with the Node Editor or a separate panel) for defining states, the animations that play within each state (can reuse TimelineData sequences), and the transitions (event triggers like onClick, onHover, onAnimationComplete) that move between states.

Action (engine): Implement state machine logic within the CineforgeEngine or a dedicated manager. It needs to:

Track the current state for relevant elements.

Listen for trigger events.

When a transition occurs, stop current state animations and play the animations for the new target state.

Handle potential conflicts with the main timeline playback.

10. Implement Animation Performance Budgets (webapp)

Explanation: Allow users to set performance targets and get warnings.

Action: Add project settings UI to define budgets (e.g., max export file size KB, target CPU usage %, max jank frames per second).

Action: In the ExportManager, check exported file sizes against the budget.

Action: In the PerformanceMonitor DevTool, compare real-time metrics (CPU, jank) against the budget and display warnings if exceeded.

11. Support Basic Media Queries (webapp)

Explanation: Allow defining variations of animations for different screen sizes.

Action: Update TimelineData or AnimationElement structure to optionally store property variations based on breakpoints (e.g., { default: { x: 100 }, 'max-width: 600px': { x: 50 } }).

Action: Add UI in PropertiesPanel to define these overrides for specific properties at different breakpoints.

Action (engine): Adapters need to detect the current screen size (on load and potentially on resize using ResizeObserver) and apply the appropriate property overrides when loading/updating animations. Exported code (CSS/JS) should also include corresponding media queries.

12. Testing (testing-utils, webapp, engine)

Action: Write comprehensive unit and integration tests for: Physics adapter logic (mock WASM if needed), WebGL adapter basic rendering, Node Editor compilation/execution logic, State Machine transitions, Performance Budget checks, Media Query application logic, Smart Export format selection.

Action: Implement Automated Performance Testing in CI. Run benchmark animations and fail the build if performance metrics (FPS, jank, memory - where measurable) regress beyond a threshold or exceed defined budgets. (Requires running browser tests in CI, e.g., using Playwright or Puppeteer).

Action: Formalize and execute Cross-Browser Compatibility Testing plan (manual or automated using BrowserStack/SauceLabs). Test core features on target browsers (latest Chrome, Firefox, Safari, Edge).

Action: Refine and automate Animation Quality Testing based on metrics developed in Phase 2.

End of Phase 3 - Verification Checklist:

Can basic physics (e.g., gravity, simple collisions) be enabled for elements and simulated correctly?

Can the engine render simple elements using the WebGL target (if implemented)?

Are real-time performance metrics (FPS, jank) tracked and displayed?

Is the Node Editor functional, allowing creation of basic interactive logic (triggers, sequences, conditions)?

Does the Pro Mode UI include a working Curve Editor for easing?

Can users generate simple procedural animations using the scripting panel or pre-built effects?

Does the Smart Export suggest appropriate formats and generate corresponding outputs (CSS, JS, Lottie, basic WebGL/glTF)?

Can users configure reduced motion strategies, and does the output respect these settings?

Can basic Animation State Machines be defined and executed for interactive elements?

Can performance budgets be set, and are warnings displayed if budgets are exceeded?

Can animation properties be overridden based on basic media queries?

Do automated performance tests run in CI and check against budgets/regressions?

Is cross-browser compatibility verified for core features?

Do all new features have adequate unit and integration tests?

Phase 3 significantly matures the tool, adding layers of complexity and power necessary for professional use. The focus is now on robust implementation, performance, and providing advanced control mechanisms.

Okay, let's proceed with the detailed elaboration for the final phase, Phase 4: Refinement & Future-Proofing.

Phase 4: Refinement & Future-Proofing (Detailed Elaboration)

Goal: To solidify the application, optimize performance across the board, enhance usability based on feedback, and explore forward-looking features that position Cineform Forge for the future. This phase is less about adding brand new core features and more about polish, stability, advanced AI, and extensibility.

AI Agent Instructions: Focus on optimization, code quality, stability, and implementing features based on research (R&D tasks). Ensure robustness of existing features. Enhance test coverage, especially for edge cases and performance. Mark completed steps with [v].

1. Performance Optimization (Core Focus)

Explanation: Profile the application extensively and optimize critical paths in rendering, state management, AI processing, and physics.

Action (engine):

Profile rendering performance for DOM, Canvas 2D, and WebGL targets using browser developer tools (Performance tab). Identify bottlenecks (e.g., excessive repaints/reflows for DOM, slow canvas drawing operations, inefficient shader/buffer usage in WebGL).

Optimize DOM rendering (e.g., use will-change, ensure transforms/opacity are used for animation, batch DOM updates where possible).

Optimize Canvas 2D rendering (e.g., use offscreen canvases, optimize drawing calls, sprite sheets for images).

Optimize WebGL/WebGPU rendering (e.g., geometry instancing, texture atlases, shader optimization, efficient buffer updates). Implement advanced techniques identified in plan v3 (PBR, shadows) if core rendering is stable.

Optimize WASM physics integration (e.g., ensure efficient data transfer between JS and WASM, use appropriate Rapier settings, potentially use multi-threading if Rapier supports it via WASM).

Action (webapp):

Profile React component rendering performance using React DevTools Profiler. Identify unnecessary re-renders. Optimize using React.memo, useMemo, useCallback.

Optimize state management (Zustand). Ensure selectors are efficient and don't cause excessive component updates. Consider optimizing large state updates (e.g., during timeline manipulation).

Optimize the Node Editor execution logic. Ensure graph traversal and node execution are efficient, especially for complex graphs.

Action (ai-assistant):

Optimize prompt structures for faster responses or lower token usage from AI providers where possible.

Implement caching for identical AI requests (e.g., suggesting improvements for the same unchanged sequence).

2. Stability & Bug Fixing

Explanation: Address bugs identified during previous phases and through wider testing. Improve error handling and application stability.

Action: Systematically go through bug reports and user feedback from previous phases.

Action: Prioritize and fix critical bugs related to crashes, data loss, core feature malfunction (rendering, timeline, export).

Action: Improve error handling throughout the application. Provide clearer error messages to the user. Implement more robust state recovery mechanisms where possible.

Action: Add more comprehensive end-to-end tests covering complex user workflows to catch integration issues.

3. Enhance Onboarding & Contextual Help (webapp)

Explanation: Make the tool easier to learn and use, especially for intermediate users exploring advanced features.

Action: Develop interactive tutorials (using a library like intro.js or custom implementation) guiding users through core workflows (creating first animation, using the timeline, applying suggestions, using the node editor).

Action: Implement more extensive in-app documentation or links to external documentation for advanced features (Physics settings, Node Editor nodes, State Machine configuration).

Action: Refine tooltips and UI text for clarity and consistency based on user feedback.

4. Expand Template Library (@cineform-forge/templates-library & webapp)

Explanation: Provide users with a richer starting point for various animation types.

Action: Design and implement a wider variety of high-quality animation templates covering common use cases:

UI Micro-interactions (button states, toggles, loading spinners).

Page transitions.

Scroll-triggered effects (parallax, reveals).

Character animation basics (walk cycle if applicable).

Data visualization examples.

Action (webapp): Improve the UI for browsing and searching templates. Add previews (can be pre-rendered GIFs/videos or live previews using the engine).

5. Refine Pro/Beginner Modes (webapp)

Explanation: Ensure both user segments have an optimized experience.

Action: Conduct user testing specifically targeting beginner and professional users.

Action: Based on feedback, refine which features are visible/hidden in each mode.

Action: Ensure a smooth transition path for users wanting to move from Beginner to Pro mode (e.g., gradual feature unveiling, clear indicators of advanced options).

6. Implement StyleDNA (Simplified - Style Preferences) (@cineform-forge/ai-assistant & webapp)

Explanation: Allow the AI to adapt to the user's preferred style without complex ML model training initially.

Action (webapp): Create a "Style Preferences" section in user settings. Allow users to save:

Favorite easing functions/curves.

Preferred durations for common actions (e.g., standard transition time).

Common color palettes.

Preferred animation principles intensity (e.g., "subtle anticipation").

Action (ai-assistant): Modify the AI prompts (for generation and suggestions) to optionally include these saved preferences as context. Instruct the AI to favor these preferences when generating output. Example prompt addition: "User prefers subtle easing like 'power2.out' and durations around 0.5s for standard transitions. Apply these where appropriate."

7. R&D: Multimodal Input (@cineform-forge/ai-assistant & webapp)

Explanation: Research and potentially implement experimental support for non-text inputs to generate animations.

Action (R&D):

Sketch-to-Animation: Investigate using image recognition APIs (or local models like TensorFlow.js models) to interpret simple drawings (e.g., a drawn path or shape) and translate them into AnimationElement and TimelineData (e.g., animating an element along the drawn path).

Video Reference: Research video analysis libraries/APIs to extract basic motion vectors or pose estimation data. Explore translating this data into keyframes for a target element (highly complex).

Audio Reactive: Integrate Web Audio API AnalyserNode to get frequency/waveform data in real-time. Create nodes in the Node Editor or scripting API bindings to allow animation properties to react to this audio data (e.g., scale based on bass frequency).

Action (Implementation - Optional): Implement a basic proof-of-concept for the most feasible option (likely audio-reactive or simple sketch input) integrated into the UI. Mark as experimental.

8. R&D: Local AI Models (@cineform-forge/ai-assistant)

Explanation: Explore running AI models directly in the browser for offline use, privacy, and potentially lower cost.

Action (R&D): Investigate libraries like WebLLM, Transformers.js, or direct ONNX/TensorFlow.js integration with compatible models (e.g., optimized smaller language models, potentially specialized models for code/JSON generation).

Action (R&D): Evaluate the performance trade-offs (speed, memory usage, quality of output) compared to cloud APIs. Assess browser compatibility (WebGPU requirements).

Action (Implementation - Optional): If feasible, implement support for loading and running a specific compatible local model as an alternative AI Provider option. Provide clear instructions/warnings about performance implications.

9. Implement Plugin System Foundation (@cineform-forge/engine & webapp)

Explanation: Design the core architecture to allow future extensibility via third-party plugins.

Action: Define clear extension points in the application:

Custom engine adapters.

Custom Node Editor nodes.

Custom export formats.

Custom panels/UI elements.

Custom animation templates.

Action: Refactor core modules (Engine, Node Editor runtime, ExportManager) to support registration and discovery of external components adhering to defined plugin interfaces.

Action: Document the initial plugin API structure. Actual loading of external plugins might be deferred beyond this phase.

10. Refine Export Quality & Options (webapp)

Explanation: Ensure the exported assets are production-ready.

Action: Add options for further optimization during export (e.g., Lottie asset compression/optimization tools, JS code splitting/minification options, SVG optimization for vector assets).

Action: Test exported animations rigorously across different devices and browsers to ensure consistency and performance.

Action: Provide options for including necessary runtimes or dependencies (e.g., include GSAP library code with JS export if needed).

11. Advanced Testing & Optimization

Action: Implement End-to-End (E2E) Tests covering critical user workflows using tools like Playwright or Cypress. Run these regularly, potentially in CI.

Action: Conduct Load Testing on core features (e.g., rendering complex timelines, running complex node graphs) to identify limits and breaking points.

Action: Perform Security Audit, especially if any backend, collaboration, or scripting features handle user data or execute arbitrary code. Address any vulnerabilities found.

Action: Run final rounds of performance profiling and optimization based on E2E and load testing results.

12. Documentation & Release Preparation

Action: Write comprehensive user documentation covering all features, modes, panels, and export options. Include tutorials and best practice guides.

Action: Generate complete API documentation for the engine, shared types, and potentially the plugin API using tools like TypeDoc.

Action: Prepare release notes, build processes for distribution (e.g., web deployment).

Action: Set up basic analytics (e.g., Plausible, Simple Analytics - respecting privacy) for the deployed application to gather anonymous usage data for future prioritization (requires user consent mechanism).

End of Phase 4 - Verification Checklist:

Is overall application performance (rendering, UI responsiveness, AI interactions) significantly improved and meeting targets?

Are known critical bugs and stability issues resolved?

Is the onboarding experience enhanced with tutorials and better contextual help?

Is the template library significantly expanded with useful examples?

Are the Beginner and Pro modes well-defined and optimized based on feedback?

Can the AI leverage user-defined style preferences for suggestions/generation?

Is there experimental support (or clear R&D findings) for at least one multimodal input or local AI model?

Is the codebase structured to support a future plugin system at key extension points?

Are export options refined, offering production-ready, optimized output?

Are comprehensive E2E tests implemented and passing?

Has the application undergone basic security checks and load testing?

Is user documentation complete and ready for release?

Completing Phase 4 signifies that Cineform Forge is a mature, stable, performant, and feature-rich application ready for its initial major release (v1.0). It has a strong foundation, professional capabilities, AI assistance, and has been refined based on potential user feedback and performance analysis. Future development can focus on post-v1.0 features, deeper AI integration, community building, and plugin support.

