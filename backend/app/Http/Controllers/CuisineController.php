<?php

namespace App\Http\Controllers;

use App\Dto\ResponseDto;
use App\Services\CuisineService;
use Illuminate\Http\Request;

class CuisineController extends Controller
{
    public static function getAllCuisines(Request $request)
    {
        try {
            return ResponseDto::success(CuisineService::getAllCuisines());
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }

    public static function getCuisineById($cuisine_id)
    {
        try {
            return ResponseDto::success(CuisineService::getCuisineById($cuisine_id));
        } catch (\Exception $e) {
            return ResponseDto::error($e->getMessage());
        }
    }
}
