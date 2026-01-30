<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            $orders = resource_path('dummy-json/orders.json');
            if (!File::exists($orders)) {
                Log::error("OrderSeeder: orders.json file not found at path: " . json_encode($orders));
                return;
            }

            $data = json_decode(File::get($orders), true);
            Log::info("OrderSeeder: Loaded " . count($data) . " order records from JSON.");
            $ordersData = [];
            foreach ($data as $item) {
                $now = Carbon::now();
                $ordersData[] = [
                    'id' => $item['id'],
                    'restaurant_id' => $item['restaurant_id'],
                    'order_amount' => $item['order_amount'],
                    'order_time' => Carbon::parse($item['order_time']),
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }
            Order::insertOrIgnore($ordersData);
            Log::info("OrderSeeder: Seeded " . count($ordersData) . " orders.");
        }catch (\Exception $e){
            Log::error("OrderSeeder: ".$e->getMessage());
            return;
        }
    }
}
