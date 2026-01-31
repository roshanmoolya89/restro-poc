<?php

use App\Dto\ResponseDto;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RestaurantController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ResponseDto::info('Welcome to the KitchenSpurs API');
});

Route::prefix('locations')->group(function (){
    Route::get('/', [LocationController::class, 'getLocationList']);
    Route::get('/{id}', [LocationController::class , 'getLocationById']);
});

Route::prefix('restaurants')->group(function (){
    Route::get('/', [RestaurantController::class, 'getAllRestaurants']);
    Route::get('/{id}', [RestaurantController::class, 'getRestaurantById']);
    Route::get('/{id}/trends', [RestaurantController::class, 'getRestaurantOrderTrends']);


    Route::prefix('{id}/orders')->group(function(){
        Route::post('/', [RestaurantController::class, 'getRestaurantOrders']);
        Route::get('/{order_id}', [RestaurantController::class, 'getRestaurantOrderById']);
    });

});

Route::prefix('orders')->group(function (){
    Route::post('/', [OrderController::class, 'getAllOrders']);
    Route::get('/{id}', [OrderController::class, 'getOrderById']);
});
