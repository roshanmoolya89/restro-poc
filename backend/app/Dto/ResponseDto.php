<?php

namespace App\Dto;

Class ResponseDto {

    public static function info($message = "Info", $data = null, $code = 200) {
        return response()->json([
            'status' => true,
            'message' => $message
        ], $code);
    }

    public static function success($data = null, $message = "Success", $code = 200) {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    public static function error($message = "Error", $data = null, $code = 400) {
        return response()->json([
            'status' => false,
            'message' => $message,
            'data' => $data
        ], $code);
    }
}


