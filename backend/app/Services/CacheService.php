<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    /**
     * Generate cache key from request data
     */
    public static function generateKey(string $prefix, array $data): string
    {
        $normalized = self::normalizeData($data);
        return $prefix . ':' . md5(json_encode($normalized));
    }

    /**
     * Normalize data for consistent cache keys
     */
    private static function normalizeData(array $data): array
    {
        ksort($data);
        
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = self::normalizeData($value);
            }
        }
        
        return $data;
    }

    /**
     * Cache response with metadata
     */
    public static function remember(
        string $key,
        int $ttl,
        callable $callback,
        array $metadata = []
    ) {
        return Cache::remember($key, $ttl, function () use ($callback, $metadata, $ttl) {
            $response = $callback();
            
            return [
                'data' => $response,
                'metadata' => array_merge($metadata, [
                    'cached_at' => now()->toIso8601String(),
                    'ttl_seconds' => $ttl,
                    'hit' => false,
                ]),
            ];
        });
    }

    /**
     * Get cached data with hit metadata
     */
    public static function get(string $key): ?array
    {
        $cached = Cache::get($key);
        
        if ($cached !== null && is_array($cached) && isset($cached['metadata'])) {
            $cached['metadata']['hit'] = true;
        }
        
        return $cached;
    }

    /**
     * Flush restaurant caches
     */
    public static function flushRestaurants(): void
    {
        // Get all cache keys and flush restaurant-related ones
        // For database/file driver, we'll use a prefix pattern
        Cache::flush(); // In production with Redis, use Cache::tags(['restaurants'])->flush()
    }

    /**
     * Flush specific restaurant cache
     */
    public static function flushRestaurant(int $restaurantId): void
    {
        // For database/file driver, flush all caches
        // In production with Redis, use Cache::tags(['restaurants', "restaurant:{$restaurantId}"])->flush()
        Cache::flush();
    }

    /**
     * Clear specific cache by key pattern
     */
    public static function clearByPattern(string $pattern): void
    {
        // For simple drivers, flush all
        Cache::flush();
    }
}
