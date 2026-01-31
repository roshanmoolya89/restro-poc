<?php

namespace App\Models;


use App\Models\Filters\BaseFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class Restaurant extends BaseModel
{
    use BaseFilter;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'restaurants';

    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'location_id',
        'cuisine_id',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id', 'id');
    }

    public function cuisine()
    {
        return $this->belongsTo(Cuisine::class, 'cuisine_id', 'id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'restaurant_id', 'id');
    }

    public static function getRestaurantById($id)
    {
        return self::findorfail($id);
    }

    public static function getAllRestaurants()
    {
        return self::query()->get();
    }

    public static function getRestaurantList(array $filters = [], $loadRelations = false)
    {
        $location = isset($filters['location']) && !empty($filters['location']) ? $filters['location'] : ($filters['location'] ?? null);
        $cuisine = isset($filters['cuisine']) && !empty($filters['cuisine']) ? $filters['cuisine'] : ($filters['cuisine'] ?? null);
        $order_date_range = isset($filters['order_date_range']) && !empty($filters['order_date_range']) ? $filters['order_date_range'] : false;
        $query = self::query();

        //apply location filter
        if ($location && is_array($location)){
            $query->whereIn('location_id', $location);
        }elseif ($location){
            $query->where('location_id', $location);
        }

        //apply cuisine filter
        if ($cuisine && is_array($cuisine)){
            $query->whereIn('cuisine_id', $cuisine);
        }elseif ($cuisine){
            $query->where('cuisine_id', $cuisine);
        }

        if ($order_date_range && is_array($order_date_range)) {
            $query->whereHas('orders', function (Builder $subQuery) use ($order_date_range , $query) {
                $from_date = isset($order_date_range['from']) && !empty($order_date_range['from']) ? $order_date_range['from'] : null;
                $to_date = isset($order_date_range['to']) && !empty($order_date_range['to']) ? $order_date_range['to'] : null;

                $query->withSum(['orders as revenue' => function ($q) use ($from_date, $to_date) {
                    $q->orderTimeBetween($from_date, $to_date);
                }], 'order_amount');
            });
        }else{
            $query->withSum('orders as revenue', 'order_amount');
        }

//        $query->withCount('orders')->withAvg('orders as average_order_value', 'order_amount');

        $query->search()->sortBy();
        return $loadRelations ? $query->with(['location', 'cuisine']) : $query->perPage();
    }
}
