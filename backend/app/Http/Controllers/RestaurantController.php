<?php

namespace App\Http\Controllers;

use App\Dto\ResponseDto;
use App\Services\RestaurantService;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public static function getAllRestaurants(Request $request)
    {
        try {
            return ResponseDto::success(RestaurantService::getRestaurantList($request));
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getRestaurantById($restaurant_id)
    {
        try {
            return ResponseDto::success(RestaurantService::getRestaurantById($restaurant_id));
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getRestaurantOrderById($restaurant_id, $order_id)
    {
        try {
            return ResponseDto::success(RestaurantService::getRestaurantOrderById($restaurant_id, $order_id));
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getRestaurantOrders(Request $request, $restaurant_id)
    {
        try {
            return ResponseDto::success(RestaurantService::getRestaurantOrders($restaurant_id, $request));
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getRestaurantOrderTrends(Request $request, $restaurant_id)
    {
        try {
            $filters = [];
            $filters['order_date_range']['from'] = $request->get('from');
            $filters['order_date_range']['to'] = $request->get('to');
            return ResponseDto::success(RestaurantService::getRestaurantOrderTrends($restaurant_id, $filters));
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }
}
