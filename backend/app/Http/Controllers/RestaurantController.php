<?php

namespace App\Http\Controllers;

use App\Dto\ResponseDto;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public static function getAllRestaurants(Request $request)
    {
        try {
            return ResponseDto::success(Restaurant::getRestaurantList($request));
        }catch (\Exception $e){
            return ResponseDto::error($e->getMessage());
        }
    }
}
