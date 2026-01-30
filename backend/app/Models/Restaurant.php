<?php

namespace App\Models;


use Illuminate\Http\Request;

class Restaurant extends BaseModel
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'restaurants';

    public static function getRestaurantById($id){
        return self::findorfail($id);
    }

    public static function getAllRestaurants()
    {
        return self::query()->get();
    }

    public static function getRestaurantList(Request $request){
        return self::get();
    }
}
