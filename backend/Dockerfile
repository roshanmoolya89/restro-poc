FROM php:8.4-fpm

# ---------------- System deps ----------------
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    ca-certificates \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl \
    && rm -rf /var/lib/apt/lists/*

# ---------------- Composer ----------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ---------------- Node (FULL install incl npx) ----------------
COPY --from=node:20-bookworm /usr/local/ /usr/local/

# ---------------- App ----------------
WORKDIR /app
COPY . .

# 🔥 Remove host artifacts
RUN rm -rf node_modules package-lock.json vendor

# ---------------- Install deps ----------------
RUN composer install --no-interaction --prefer-dist
RUN npm install

# ---------------- Permissions ----------------
RUN chown -R www-data:www-data /app \
    && chmod -R 775 storage bootstrap/cache

# ---------------- Ports ----------------
EXPOSE 8000 5173

# ---------------- Run ----------------
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=8000 & npx vite --host 0.0.0.0 --port 5173"]