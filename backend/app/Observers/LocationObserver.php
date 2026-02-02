<?php

namespace App\Observers;

use App\Models\Location;
use App\Services\CacheService;

class LocationObserver
{
    /**
     * Handle the Location "created" event.
     */
    public function created(Location $location): void
    {
        CacheService::clearByPattern('api:response');
    }

    /**
     * Handle the Location "updated" event.
     */
    public function updated(Location $location): void
    {
        CacheService::clearByPattern('api:response');
    }

    /**
     * Handle the Location "deleted" event.
     */
    public function deleted(Location $location): void
    {
        CacheService::clearByPattern('api:response');
    }
}
