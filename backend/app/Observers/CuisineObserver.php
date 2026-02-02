<?php

namespace App\Observers;

use App\Models\Cuisine;
use App\Services\CacheService;

class CuisineObserver
{
    /**
     * Handle the Cuisine "created" event.
     */
    public function created(Cuisine $cuisine): void
    {
        CacheService::clearByPattern('api:response');
    }

    /**
     * Handle the Cuisine "updated" event.
     */
    public function updated(Cuisine $cuisine): void
    {
        CacheService::clearByPattern('api:response');
    }

    /**
     * Handle the Cuisine "deleted" event.
     */
    public function deleted(Cuisine $cuisine): void
    {
        CacheService::clearByPattern('api:response');
    }
}
