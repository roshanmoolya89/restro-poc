"use client";

import { getApiRestaurants } from "@/src/api/restaurants/restaurants";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Dashboard() {
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApiRestaurants()
      .then(({ data }) => {
        console.log("Restaurants Data:", data.data);
        setRestaurants(data.data || []);
        setRestaurantCount(data?.data?.total || 0);
      })
      .catch((error) => {
        console.error("Failed to fetch restaurants:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full h-full rounded-xl px-2 py-4 shadow border border-zinc-100 my-2">
      <h2 className="text-2xl p-3 font-semibold mb-4">Dashboard Overview</h2>
      {/* List Restaurants from API */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 pl-3">Restaurants</h2>
        {loading ? (
          <p>Loading restaurants...</p>
        ) : (
          <>
            {restaurants.data &&
              restaurants?.data.map((restaurant: any) => (
                <Link
                  href={`/restaurants/${restaurant.id}`}
                  key={restaurant.id}
                >
                  <div
                    key={restaurant.id}
                    className="p-4 border border-zinc-100 rounded-lg shadow mb-4"
                  >
                    <h3 className="text-lg font-medium">{restaurant.name}</h3>
                    <p className="text-sm text-zinc-500">
                      Location: {restaurant.location.name}
                    </p>
                  </div>
                </Link>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
