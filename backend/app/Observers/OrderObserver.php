<?php

namespace App\Observers;

use App\Models\Order;
use App\Services\CacheService;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        // Clear restaurant cache when orders change (affects revenue)
        if ($order->restaurant_id) {
            CacheService::flushRestaurant($order->restaurant_id);
        }
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if ($order->restaurant_id) {
            CacheService::flushRestaurant($order->restaurant_id);
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        if ($order->restaurant_id) {
            CacheService::flushRestaurant($order->restaurant_id);
        }
    }
}
