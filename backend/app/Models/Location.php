<?php

namespace App\Models;


class Location extends BaseModel
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'locations';

    public function restaurants()
    {
        return $this->hasMany(Restaurant::class, 'location_id', 'id');
    }

    public static function getLocationList()
    {
        return self::select('id', 'name', 'slug')->get();
    }

    public static function getLocationById($location_id){
        return self::findorfail($location_id);
    }
}
