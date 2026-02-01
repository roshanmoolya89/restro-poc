<?php

namespace App\Services;

use App\Dto\ResponseDto;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantService
{
    public static function getRestaurantById($restaurant_id){
        return Restaurant::getRestaurantById($restaurant_id);
    }

    public static function getRestaurantList(Request $request){
        try{
            $params = $request->all();
            return Restaurant::getRestaurantList($params, true);
        }catch(\Exception $e){
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getRestaurantOrders($restaurant_id, $filters){
        return OrderService::getRestaurantOrders($restaurant_id, $filters);
    }

    public static function getRestaurantOrderById($restaurant_id, $order_id){
        return OrderService::getRestaurantOrderById($restaurant_id, $order_id);
    }

    public static function getRestaurantOrderTrends($restaurant_id, $filters){
        try {
            $orders = OrderService::getRestaurantOrderTrends($restaurant_id, $filters)->toArray();
            $trends = [
                'total_orders' => sizeOf($orders),
                'total_revenue' => array_sum(array_column($orders, 'order_amount' )),
                'average_order_value' => count($orders) ? array_sum(array_column($orders, 'order_amount' )) / sizeOf($orders) : 0,
                'peak_hours' => [],
            ];

            //Calculate peak hours and popular items from $orders
            $peakHoursCount = [];
            foreach ($orders as $order) {
                $hour = date('H', strtotime($order['order_time']));
                if (!isset($peakHoursCount[$hour])) {
                    $peakHoursCount[$hour] = 0;
                }
                $peakHoursCount[$hour]++;

            }
            arsort($peakHoursCount);
            $trends['peak_hours'] = array_slice($peakHoursCount, 0, 3, true);

            return $trends;
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }
}
