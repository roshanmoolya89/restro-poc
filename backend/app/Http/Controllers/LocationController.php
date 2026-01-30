<?php

namespace App\Http\Controllers;

use App\Dto\ResponseDto;
use App\Services\LocationService;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public static function getLocationList(Request $request){
        try{
            return ResponseDto::success(LocationService::getLocationList($request));
        }catch(\Exception $e){
            return ResponseDto::error($e->getMessage());
        }
    }
}
