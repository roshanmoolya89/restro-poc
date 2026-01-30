<?php

use App\Dto\ResponseDto;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\RestaurantController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ResponseDto::info('Welcome to the KitchenSpurs API');
});

Route::prefix('location')->group(function (){
    Route::get('/list', [LocationController::class, 'getLocationList']);
});

Route::prefix('restaurant')->group(function (){
    Route::get('/list', [RestaurantController::class, 'getAllRestaurants']);
});
