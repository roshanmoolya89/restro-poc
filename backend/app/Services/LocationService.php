<?php

namespace App\Services;

use App\Dto\ResponseDto;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationService{

    public static function getAllLocation(){
        try{
            return Location::getLocationList();
        }catch(\Exception $e){
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getLocationList(Request $request){
        try{
            return Location::getLocationList();
        }catch(\Exception $e){
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getLocationById($location_id){
        try{
            return Location::getLocationById($location_id);
        }catch(\Exception $e){
            return ResponseDto::error($e->getMessage());
        }
    }
}
