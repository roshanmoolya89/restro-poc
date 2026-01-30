<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Support\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LocationSeeder extends Seeder
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

            $data = json_decode(File::get($restaurants), true);
            Log::info("LocationSeeder: Loaded ".count($data)." restaurant records from JSON.");
            $locations = [];
            foreach ($data as $item) {
                if (isset($item['location'])) {
                    $now = Carbon::now();
                    $locations[] =  [
                        'name' => $item['location'],
                        'slug' => Str::slug($item['location'],'_'),
                        'created_at' => $now,
                        'updated_at' => $now
                    ];
                }
            }

            $uniqueLocations = collect($locations)->unique('slug')->values()->all();
            Location::insertOrIgnore($uniqueLocations);
            Log::info("LocationSeeder: Seeded ".count($uniqueLocations)." unique locations.");
        }catch (\Exception $e){
            Log::error("LocationSeeder: ".$e->getMessage());
            return;
        }
    }
}
