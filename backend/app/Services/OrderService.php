<?php

namespace App\Services;

use App\Dto\ResponseDto;
use App\Models\Order;

class OrderService
{
    public static function getOrderById($order_id)
    {
        try {
            return Order::getOrderById($order_id);
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getAllOrders($filters = [])
    {
        try {
            return Order::getOrderList($filters);
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getRestaurantOrders($restaurant_id, $filters = [])
    {
        try {
            $filters['restaurant_id'] = $restaurant_id;
            return Order::getOrderList($filters);
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getRestaurantOrderTrends($restaurant_id, $filters = [])
    {
        try {
            $filters['restaurant_id'] = $restaurant_id;
            return Order::getOrderList($filters, false);
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getRestaurantOrderById($restaurant_id, $order_id)
    {
        try {
            return Order::getRestaurantOrderById($restaurant_id, $order_id);
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }
}
