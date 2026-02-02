<?php

use App\Dto\ResponseDto;
use App\Http\Controllers\CuisineController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RestaurantController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ResponseDto::info('Welcome to the KitchenSpurs API');
});

// Swagger API Documentation
Route::get('/documentation', function () {
    return view('swagger');
});

Route::prefix('locations')->group(function (){
    // Cache for 1 hour (3600 seconds) - locations change rarely
    Route::get('/', [LocationController::class, 'getLocationList'])
        ->middleware('cache.api:3600');
    
    Route::get('/{id}', [LocationController::class , 'getLocationById'])
        ->middleware('cache.api:3600');
});

Route::prefix('cuisines')->group(function (){
    // Cache for 1 hour (3600 seconds) - cuisines change rarely
    Route::get('/', [CuisineController::class, 'getAllCuisines'])
        ->middleware('cache.api:3600');
    
    Route::get('/{id}', [CuisineController::class , 'getCuisineById'])
        ->middleware('cache.api:3600');
});

Route::prefix('restaurants')->group(function (){
    // Cache for 10 minutes (600 seconds)
    Route::post('/', [RestaurantController::class, 'getAllRestaurants'])
        ->middleware('cache.api:600');
    
    // Cache for 30 minutes (1800 seconds)
    Route::get('/{id}', [RestaurantController::class, 'getRestaurantById'])
        ->middleware('cache.api:1800');
    
    // Cache for 5 minutes (300 seconds) - trends change more frequently
    Route::get('/{id}/trends', [RestaurantController::class, 'getRestaurantOrderTrends'])
        ->middleware('cache.api:300');

    Route::prefix('{id}/orders')->group(function(){
        // Cache for 10 minutes
        Route::post('/', [RestaurantController::class, 'getRestaurantOrders'])
            ->middleware('cache.api:600');
        
        // Cache for 30 minutes
        Route::get('/{order_id}', [RestaurantController::class, 'getRestaurantOrderById'])
            ->middleware('cache.api:1800');
    });

});

Route::prefix('orders')->group(function (){
    // Cache for 10 minutes
    Route::post('/', [OrderController::class, 'getAllOrders'])
        ->middleware('cache.api:600');
    
    // Cache for 30 minutes
    Route::get('/{id}', [OrderController::class, 'getOrderById'])
        ->middleware('cache.api:1800');
});
