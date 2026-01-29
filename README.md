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
**: MySQL 8.0

### Frontend

- **Framework**: Next.js 16
- **Language**: TypeScript 5
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **Build**: Turbopack (Next.js)

## 👥 Contributors

- **Roshan Moolya**
