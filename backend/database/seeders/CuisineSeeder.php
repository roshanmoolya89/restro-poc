<?php

namespace Database\Seeders;

use App\Models\Cuisine;
use Illuminate\Support\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CuisineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            $restaurants = resource_path('dummy-json/restaurants.json');
            if (!File::exists($restaurants)) {
                Log::error("CuisineSeeder: restaurants.json file not found at path: " . json_encode($restaurants));
                return;
            }

            $data = json_decode(File::get($restaurants), true);
            Log::info("CuisineSeeder: Loaded " . count($data) . " restaurant records from JSON.");
            $cuisines = [];
            foreach ($data as $item) {
                if (isset($item['cuisine'])) {
                    $now = Carbon::now();
                    $cuisines[] = [
                        'name' => $item['cuisine'],
                        'slug' => Str::slug($item['cuisine'], '_'),
                        'description' => 'Delicious ' . $item['cuisine'] . ' cuisine.',
                        'created_at' => $now,
                        'updated_at' => $now
                    ];
                }
            }
            $uniqueCuisines = collect($cuisines)->unique('slug')->values()->all();
            Cuisine::insertOrIgnore($uniqueCuisines);
            Log::info("CuisineSeeder: Seeded " . count($uniqueCuisines) . " unique cuisines.");
        } catch (\Exception $e) {
            Log::error("CuisineSeeder: " . $e->getMessage());
            return;
        }
    }
}
