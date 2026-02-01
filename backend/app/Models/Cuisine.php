<?php

namespace App\Models;



use Illuminate\Support\Facades\Request;

class Cuisine extends BaseModel
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'cuisines';

    public function restaurants()
    {
        return $this->hasMany(Restaurant::class, 'cuisine_id', 'id');
    }

    public static function getCuisineById($id)
    {
        return self::findorfail($id);
    }

    public static function getAllCuisines()
    {
        return self::query()->get();
    }

    public static function getCuisineList(Request $request){
        return self::select('id', 'name', 'slug')->get();
    }
}
