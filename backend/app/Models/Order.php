<?php

namespace App\Models;

use App\Models\Filters\BaseFilter;
use Illuminate\Support\Carbon;

class Order extends BaseModel
{
    use BaseFilter;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'orders';

    protected $fillable = [
        'restaurant_id',
        'order_amount',
        'order_time',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class, 'restaurant_id', 'id');
    }

    public static function getOrderById($id)
    {
        return self::findorfail($id);
    }

    public static function getRestaurantOrderById($restaurant_id, $order_id)
    {
        return self::query()->where('restaurant_id', $restaurant_id)->where('id', $order_id)->firstOrFail();
    }

    public static function getAllOrders()
    {
        return self::query()->get();
    }

    public function scopeOrderTimeBetween($query, $from, $to)
    {
        return $query->whereBetween('order_time', [$from, $to]);
    }

    public static function getOrderList($filters = [], $paginate = true)
    {
        $restaurant_id = isset($filters['restaurant_id']) && !empty($filters['restaurant_id']) ? $filters['restaurant_id'] : false;
        $order_amount_range = isset($filters['order_amount_range']) && !empty($filters['order_amount_range']) ? $filters['order_amount_range'] : false;
        $order_date_range = isset($filters['order_date_range']) && !empty($filters['order_date_range']) ? $filters['order_date_range'] : false;
        $query = self::query();

        if ($restaurant_id && is_array($filters['restaurant_id'])) {
            $query->whereIn('restaurant_id', $restaurant_id);
        } else if ($restaurant_id) {
            $query->where('restaurant_id', $restaurant_id);
        }

        //filter by order amount range
        if ($order_amount_range && is_array($order_amount_range)) {
            //check if from and to exists and numeric
            $from = isset($order_amount_range['from']) && is_numeric($order_amount_range['from']) ? $order_amount_range['from'] : null;
            $to = isset($order_amount_range['to']) && is_numeric($order_amount_range['to']) ? $order_amount_range['to'] : null;
            if (!is_null($from) && !is_null($to)) {
                $query->whereBetween('order_amount', [$from, $to]);
            } else {
                if (!is_null($from)) {
                    $query->where('order_amount', '>=', $from);
                }
                if (!is_null($to)) {
                    $query->where('order_amount', '<=', $to);
                }
            }
        }

        //filter by order date range
        if ($order_date_range && is_array($order_date_range)) {
            $from_date = isset($order_date_range['from']) && !empty($order_date_range['from']) ? $order_date_range['from'] : null;
            $to_date = isset($order_date_range['to']) && !empty($order_date_range['to']) ? $order_date_range['to'] : null;
            if (!is_null($from_date) && !is_null($to_date)) {
                $query->whereBetween('order_time', [Carbon::parse($from_date), Carbon::parse($to_date)]);
            } else {
                if (!is_null($from_date)) {
                    $query->where('order_time', '>=', Carbon::parse($from_date));
                }
                if (!is_null($to_date)) {
                    $query->where('order_time', '<=', Carbon::parse($to_date));
                }
            }
        }

        $query->search()->sortBy();
        return $paginate ? $query->perPage() : $query->get();
    }

    public static function getRestaurantOrders($restaurant_id)
    {
        return self::where('restaurant_id', $restaurant_id)->get();
    }
}
