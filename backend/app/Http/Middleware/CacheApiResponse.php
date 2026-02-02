<?php

namespace App\Http\Middleware;

use App\Services\CacheService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheApiResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $ttl = 600)
    {
        // Only cache GET and POST requests
        if (!in_array($request->method(), ['GET', 'POST'])) {
            return $next($request);
        }

        // Generate cache key from method, URL, query params, and body
        $cacheKey = $this->generateCacheKey($request);

        // Try to get cached response
        $cached = CacheService::get($cacheKey);

        if ($cached !== null) {
            return response()->json([
                'success' => true,
                'data' => $cached['data'],
                'cache' => array_merge($cached['metadata'], ['hit' => true])
            ]);
        }

        // Execute request
        $response = $next($request);

        // Cache successful JSON responses
        if ($response->getStatusCode() === 200) {
            $responseData = json_decode($response->getContent(), true);

            // Only cache if response has success flag
            if (isset($responseData['success']) && $responseData['success']) {
                $cacheData = [
                    'data' => $responseData['data'] ?? $responseData,
                    'metadata' => [
                        'cached_at' => now()->toIso8601String(),
                        'ttl_seconds' => $ttl,
                        'request_method' => $request->method(),
                        'request_path' => $request->path(),
                        'request_params' => $request->all(),
                        'hit' => false,
                    ],
                ];

                Cache::put($cacheKey, $cacheData, $ttl);

                // Add cache metadata to response
                if (isset($responseData['data'])) {
                    $responseData['cache'] = $cacheData['metadata'];
                } else {
                    $responseData['cache'] = $cacheData['metadata'];
                    $responseData['data'] = $cacheData['data'];
                }

                $response->setContent(json_encode($responseData));
            }
        }

        return $response;
    }

    /**
     * Generate cache key from request
     */
    private function generateCacheKey(Request $request)
    {
        $data = [
            'method' => $request->method(),
            'path' => $request->path(),
            'query' => $request->query->all(),
            'body' => $request->all(),
        ];

        return CacheService::generateKey('api:response', $data);
    }
}
