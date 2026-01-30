<?php

namespace App\Models;

class Order extends BaseModel
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'orders';


    public static function getOrderById($id){
        return self::findorfail($id);
    }

    public static function getAllOrders()
    {
        return self::query()->get();
    }

    public static function getOrderList(){
        return self::select('id', 'order_amount', 'order_time')->get();
    }

    public static function getRestaurantOrders($restaurant_id){
        return self::where('restaurant_id', $restaurant_id)->get();
    }
}
