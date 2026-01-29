<?php

use App\Dto\ResponseDto;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ResponseDto::info('Welcome to the KitchenSpurs API');
});
