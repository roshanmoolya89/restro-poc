<?php

namespace App\Services;


use App\Dto\ResponseDto;
use App\Models\Cuisine;

class CuisineService{
    public static function getAllCuisines(){
        try{
            return Cuisine::getAllCuisines();
        }catch(\Exception $e){
            return ResponseDto::error($e->getMessage());
        }
    }
}
