<?php

namespace Database\Seeders;

use Exception;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        try {
            // User::factory(10)->create();
            $seeds = [
                LocationSeeder::class,
                CuisineSeeder::class,
                RestaurantSeeder::class,
                OrderSeeder::class
            ];

            foreach ($seeds as $seed){
                $this->call($seed);
                $this->command->info('Seed '.$seed.' Successful');
            }
        }catch( Exception $e){
            $this->command->error($e->getMessage());
        }
    }
}
