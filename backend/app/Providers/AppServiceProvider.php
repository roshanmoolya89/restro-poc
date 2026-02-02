<?php

namespace App\Providers;

use App\Models\Cuisine;
use App\Models\Location;
use App\Models\Order;
use App\Models\Restaurant;
use App\Observers\CuisineObserver;
use App\Observers\LocationObserver;
use App\Observers\OrderObserver;
use App\Observers\RestaurantObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register observers for cache invalidation
        Restaurant::observe(RestaurantObserver::class);
        Order::observe(OrderObserver::class);
        Cuisine::observe(CuisineObserver::class);
        Location::observe(LocationObserver::class);
    }
}
