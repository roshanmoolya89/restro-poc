<?php

namespace App\Http\Controllers;

use App\Dto\ResponseDto;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public static function getAllOrders(Request $request)
    {
        try {
            return ResponseDto::success(OrderService::getAllOrders($request->all()));
        }catch (\Exception $e){
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getOrderById($order_id)
    {
        try {
            $order = OrderService::getOrderById($order_id);
            return ResponseDto::success($order);
        }catch (\Exception $e){
            return ResponseDto::error($e->getMessage());
        }
    }
}
