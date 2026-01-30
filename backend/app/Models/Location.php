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


    public static function getLocationList()
    {
        return self::select('id', 'name', 'slug')->get();
    }
}
