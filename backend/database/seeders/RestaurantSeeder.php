<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use App\Models\User;
use App\Services\CuisineService;
use App\Services\LocationService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            $restaurants = resource_path('dummy-json/restaurants.json');
            if(!File::exists($restaurants)){
                Log::error("LocationSeeder: restaurants.json file not found at path: ".json_encode($restaurants));
                return;
            }
            $locations = LocationService::getAllLocation();
            $cuisines = CuisineService::getAllCuisines();

            $data = json_decode(File::get($restaurants), true);
            Log::info("RestaurantSeeder: Loaded ".count($data)." restaurant records from JSON.");
            $restores = [];
            foreach ($data as $item) {
                $now = Carbon::now();
                $restores[] = [
                    'id' => $item['id'],
                    'name' => $item['name'],
                    'address' => $item['location'],
                    'phone' => User::factory()->make()->phone,
                    'email' => User::factory()->make()->email,
                    'location_id' => $locations->where('slug' , Str::slug($item['location'], '_'))->first()->id,
                    'cuisine_id' => $cuisines->where('slug' , Str::slug($item['cuisine'], '_'))->first()->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }
            Restaurant::insertOrIgnore($restores);
            Log::info("RestaurantSeeder: Seeded ".count($restores)." restaurants.");
        }catch (\Exception $e){
            Log::error("RestaurantSeeder: ".$e->getMessage());
            return;
        }
    }
}
