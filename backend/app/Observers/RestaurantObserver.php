<?php

namespace App\Observers;

use App\Models\Restaurant;
use App\Services\CacheService;

class RestaurantObserver
{
    /**
     * Handle the Restaurant "created" event.
     */
    public function created(Restaurant $restaurant): void
    {
        CacheService::flushRestaurants();
    }

    /**
     * Handle the Restaurant "updated" event.
     */
    public function updated(Restaurant $restaurant): void
    {
        CacheService::flushRestaurant($restaurant->id);
    }

    /**
     * Handle the Restaurant "deleted" event.
     */
    public function deleted(Restaurant $restaurant): void
    {
        CacheService::flushRestaurant($restaurant->id);
    }

    /**
     * Handle the Restaurant "restored" event.
     */
    public function restored(Restaurant $restaurant): void
    {
        CacheService::flushRestaurants();
    }

    /**
     * Handle the Restaurant "force deleted" event.
     */
    public function forceDeleted(Restaurant $restaurant): void
    {
        CacheService::flushRestaurant($restaurant->id);
    }
}
