# KitchenSpurs

A full-stack application with Laravel backend and Next.js frontend, containerized with Docker.

## 📁 Project Structure

```
kitchenspurs/
├── docker-compose.yml          # Orchestrates all services
├── backend/                    # Laravel 12 API
│   ├── app/                    # Application logic
│   │   ├── Http/Controllers/   # API controllers
│   │   ├── Models/             # Database models
│   │   └── Providers/          # Service providers
│   ├── config/                 # Laravel configuration
│   ├── database/               # Migrations, seeders, factories
│   ├── routes/                 # API & web routes
│   ├── resources/              # Frontend assets (Vite)
│   │   ├── css/                # Stylesheets with Tailwind
│   │   └── js/                 # JavaScript files
│   ├── tests/                  # Pest PHP tests
│   ├── Dockerfile              # Backend container config
│   ├── composer.json           # PHP dependencies
│   ├── package.json            # Node dependencies (Vite, Tailwind)
│   └── vite.config.js          # Asset bundler config
│
├── frontend/                   # Next.js 16 Application
│   ├── src/
│   │   ├── app/                # App router pages
│   │   └── components/         # React components
│   ├── public/                 # Static assets
│   ├── Dockerfile              # Frontend container config
│   ├── package.json            # Node dependencies
│   └── next.config.ts          # Next.js configuration
│
└── .env                        # Environment variables (create this)
```

## 🏗️ Architecture

The project runs 4 Docker containers:

1. **Backend** (`kitchenspurs-backend`) - Laravel API + Vite dev server
   - Ports: `8000` (Laravel), `5173` (Vite HMR)
   - Stack: PHP 8.4, Composer, Node 20

2. **Frontend** (`kitchenspurs-frontend`) - Next.js app
   - Port: `3000`
   - Stack: Node 20, React 19, TypeScript

3. **Database** (`kitchenspurs-db`) - MySQL 8.0
   - Port: `3306`

4. **phpMyAdmin** (`kitchenspurs-phpmyadmin`) - Database management
   - Port: `8080`

## 🚀 Setup Instructions

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- [Git](https://git-scm.com/) installed

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kitchenspurs
```

### 2. Create Environment File

Create a `.env` file in the project root:

```bash
cat > .env << 'EOF'
# Database Configuration
DB_ROOT_PASSWORD=root_password
DB_NAME=kitchenspurs
DB_USER=kitchenspurs_user
DB_PASSWORD=secure_password
EOF
```

### 3. Build and Start Containers

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

**First-time build takes 3-5 minutes** (installs all dependencies)

### 4. Initialize Laravel Application

In a new terminal, run:

```bash
# Generate Laravel application key
docker exec kitchenspurs-backend php artisan key:generate

# Run database migrations
docker exec kitchenspurs-backend php artisan migrate

# (Optional) Seed database
docker exec kitchenspurs-backend php artisan db:seed
```

### 5. Access the Application

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:8000>
- **phpMyAdmin**: <http://localhost:8080>
- **Vite HMR**: <http://localhost:5173> (auto-connected)

## 🛠️ Development Workflow

### Running Services

```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up backend

# Rebuild after Dockerfile changes
docker-compose up --build

# Stop all services
docker-compose down
```

### Backend Commands

```bash
# Run artisan commands
docker exec kitchenspurs-backend php artisan <command>

# Run migrations commonds
docker exec kitchenspurs-backend php artisan migrate

docker exec kitchenspurs-backend php artisan migrate:rollback

docker exec kitchenspurs-backend php artisan db:seed

# Install PHP package
docker exec kitchenspurs-backend composer require <package>

# Run tests
docker exec kitchenspurs-backend php artisan test

# Access container shell
docker exec -it kitchenspurs-backend sh
```

### Frontend Commands

```bash
# Install npm package
docker exec kitchenspurs-frontend npm install <package>

# Run linting
docker exec kitchenspurs-frontend npm run lint

# Access container shell
docker exec -it kitchenspurs-frontend sh
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🔧 Key Technical Details

### Volume Mounting Strategy

The `docker-compose.yml` uses **anonymous volumes** to prevent host dependencies from overwriting container-installed packages:

```yaml
volumes:
  - ./backend:/app # Sync source code
  - /app/node_modules # Preserve container npm packages
  - /app/vendor # Preserve container composer packages
```

**Why this matters:**

- Native binaries (e.g., `lightningcss`) are platform-specific
- macOS binaries won't work in Linux containers
- Anonymous volumes keep container-built packages intact

### Hot Module Replacement (HMR)

Both frontend and backend have live reload:

- **Frontend**: Next.js Fast Refresh on file changes
- **Backend**: Vite watches `resources/` folder for CSS/JS changes

### Database Persistence

MySQL data is stored in a Docker volume (`db_data`) and persists across container restarts.

## 🐛 Troubleshooting

### Backend Vite Error: "Cannot find package '@tailwindcss/vite'"

**Solution**: Already fixed with anonymous volumes in docker-compose.yml. If persisting:

```bash
docker-compose down
docker-compose up --build backend
```

### Frontend Error: "Cannot find module 'lightningcss.linux-arm64-musl.node'"

**Solution**: Already fixed with anonymous volumes. Rebuild if needed:

```bash
docker-compose down
docker-compose up --build frontend
```

### Port Already in Use

```bash
# Find process using port (e.g., 3000)
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Issues

1. Ensure `.env` file exists with correct credentials
2. Wait 10-15 seconds for MySQL to initialize on first run
3. Check logs: `docker-compose logs db`

### Clear Everything and Start Fresh

```bash
# Stop all containers
docker-compose down

# Remove all data (⚠️ destroys database)
docker-compose down -v

# Rebuild from scratch
docker-compose up --build
```

## 📝 Environment Variables

### Backend (.env in backend folder)

Laravel uses its own `.env` file in the `backend/` directory. Key variables:

```env
APP_NAME=KitchenSpurs
APP_ENV=local
APP_KEY=base64:... # Generated by artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=kitchenspurs
DB_USERNAME=kitchenspurs_user
DB_PASSWORD=secure_password
```

## 🧪 Testing

### Backend (Pest PHP)

```bash
# Run all tests
docker exec kitchenspurs-backend php artisan test

# Run specific test file
docker exec kitchenspurs-backend php artisan test tests/Feature/ExampleTest.php
```

### Frontend

```bash
# Add testing framework first
docker exec kitchenspurs-frontend npm install --save-dev jest @testing-library/react
```

## 📦 Tech Stack

### Backend

- **Framework**: Laravel 12
- **Language**: PHP 8.4
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Testing**: Pest PHP
- **Database**: MySQL 8.0

### Frontend

\*\
\*\*: MySQL 8.0

### Frontend

- **Framework**: Next.js 16
- **Language**: TypeScript 5
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **Build**: Turbopack (Next.js)

## � Git Best Practices

### What NOT to Commit

The `.gitignore` files are configured to exclude:

- ❌ **Dependencies** (`node_modules/`, `vendor/`)
  - Reason: Large files, platform-specific binaries
  - Recreate with: `npm install` / `composer install`

- ❌ **Build Artifacts** (`.next/`, `build/`, `public/build/`)
  - Reason: Generated files, unnecessary bloat
  - Recreate with: `npm run build`

- ❌ **Environment Files** (`.env`, `.env.local`)
  - Reason: Contains secrets and passwords
  - ⚠️ **NEVER** commit real credentials

- ❌ **Logs** (`*.log`, `storage/logs/`)
  - Reason: Temporary runtime data

- ❌ **IDE Settings** (`.vscode/`, `.idea/`)
  - Reason: Personal preferences

### What TO Commit

- ✅ **Source Code** (`.php`, `.ts`, `.tsx`, `.js`)
- ✅ **Configuration** (`package.json`, `composer.json`, `*.config.*`)
- ✅ **Dockerfiles** (`Dockerfile`, `docker-compose.yml`)
- ✅ **Example Env** (`.env.example`) - Template without secrets
- ✅ **Migrations** (`database/migrations/*.php`)
- ✅ **Tests** (`tests/`, `__tests__/`)
- ✅ **Documentation** (`README.md`)

### Initial Repository Setup

```bash
# Initialize git (if not already done)
git init

# Add all files (respects .gitignore)
git add .

# Verify what will be committed
git status

# Check that node_modules and vendor are NOT listed
# If they appear, verify your .gitignore files

# Commit
git commit -m "Initial commit: Laravel + Next.js Docker setup"

# Add remote and push
git remote add origin <your-repo-url>
git push -u origin main
```

### Cloning for New Team Members

When someone clones the repo, they should:

```bash
# 1. Clone repository
git clone <repository-url>
cd kitchenspurs

# 2. Create environment files
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Build and start Docker containers
docker-compose up --build

# 4. Initialize backend
docker exec kitchenspurs-backend php artisan key:generate
docker exec kitchenspurs-backend php artisan migrate
```

**No manual `npm install` or `composer install` needed** - Docker handles everything!

### ⚠️ Common Git Mistakes to Avoid

1. **Committing node_modules**
   - Problem: 100+ MB, thousands of files
   - Fix: Add to `.gitignore` and remove from git:

   ```bash
   git rm -r --cached backend/node_modules frontend/node_modules
   git commit -m "Remove node_modules from git"
   ```

2. **Committing .env with passwords**
   - Problem: Security breach, exposed credentials
   - Fix: Use `.env.example` with dummy values:

   ```bash
   git rm --cached .env backend/.env
   echo ".env" >> .gitignore
   git commit -m "Remove sensitive env files"
   ```

3. **Committing vendor/ folder**
   - Problem: Large PHP dependencies folder
   - Fix: Already in `.gitignore`, remove if present:

   ```bash
   git rm -r --cached backend/vendor
   ```

4. **Committing IDE settings**
   - Problem: Personal config conflicts with team
   - Solution: Already excluded in root `.gitignore`

### Checking Repository Size

Before pushing to GitHub:

```bash
# Check total repository size
du -sh .git

# List largest files
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '/^blob/ {print substr($0,6)}' | \
  sort --numeric-sort --key=2 | \
  tail -20
```

**Good repo size**: < 50 MB  
**Warning signs**: > 100 MB (likely includes dependencies)

## 👥 Contributors

- **Roshan Moolya**
