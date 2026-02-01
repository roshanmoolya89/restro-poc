"use client";

import { getApiCuisines } from "@/src/api/cuisines/cuisines";
import type {
    Cuisine,
    Location,
    Restaurant,
} from "@/src/api/kitchenSpursAPI.schemas";
import { getApiLocations } from "@/src/api/locations/locations";
import { postApiRestaurants } from "@/src/api/restaurants/restaurants";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Dashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "revenue">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Top 3 restaurants with date filter
  const [topRestaurants, setTopRestaurants] = useState<Restaurant[]>([]);
  const [topRestaurantsDateFrom, setTopRestaurantsDateFrom] = useState("");
  const [topRestaurantsDateTo, setTopRestaurantsDateTo] = useState("");

  // Fetch locations and cuisines on mount
  useEffect(() => {
    Promise.all([getApiLocations(), getApiCuisines()])
      .then(([locationsRes, cuisinesRes]) => {
        setLocations(locationsRes.data.data || []);
        setCuisines(cuisinesRes.data.data || []);
      })
      .catch((error) => {
        console.error("Failed to fetch filters:", error);
      });
  }, []);

  // Fetch restaurants with filters
  useEffect(() => {
    setLoading(true);
    postApiRestaurants({
      page: currentPage,
      search: search || undefined,
      location: selectedLocation || undefined,
      cuisine: selectedCuisine || undefined,
      sort_by: sortBy,
      sort_direction: sortDirection,
    })
      .then(({ data }) => {
        setRestaurants(data.data?.data || []);
        setTotal(data.data?.total || 0);
        setTotalPages(
          Math.ceil((data.data?.total || 0) / (data.data?.per_page || 10)),
        );
      })
      .catch((error) => {
        console.error("Failed to fetch restaurants:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    search,
    selectedLocation,
    selectedCuisine,
    sortBy,
    sortDirection,
    currentPage,
  ]);

  // Fetch top 3 restaurants by revenue with date filter
  useEffect(() => {
    postApiRestaurants({
      sort_by: "revenue",
      sort_order: "desc",
      page: 1,
      order_date_range: {
        from: topRestaurantsDateFrom || undefined,
        to: topRestaurantsDateTo || undefined,
      },
    })
      .then(({ data }) => {
        setTopRestaurants((data.data?.data || []).slice(0, 3));
      })
      .catch((error) => {
        console.error("Failed to fetch top restaurants:", error);
      });
  }, [topRestaurantsDateFrom, topRestaurantsDateTo]);

  return (
    <div className="w-full min-h-screen bg-primary p-6 rounded-3xl">
      <header className="mb-8">
        <h1 className="text-5xl font-bold mb-2 text-white">
          Restaurant Dashboard
        </h1>
        <p className="text-gray-300 text-lg">
          Manage and monitor your restaurant performance
        </p>
      </header>

      {/* Top 3 Restaurants by Revenue */}
      <section className="mb-8 p-8 bg-primary-light rounded-2xl shadow-2xl border-2 border-primary-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">
            Top 3 Restaurants by Revenue
          </h2>
          <div className="flex gap-2 items-center flex-wrap">
            <input
              type="date"
              value={topRestaurantsDateFrom}
              onChange={(e) => {
                setTopRestaurantsDateFrom(e.target.value);
                //reset to date
                setTopRestaurantsDateTo("");
              }}
              className="px-4 py-2 border-2 border-primary-border bg-primary text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent shadow-md font-medium"
              placeholder="From"
            />
            <input
              type="date"
              value={topRestaurantsDateTo}
              onChange={(e) => setTopRestaurantsDateTo(e.target.value)}
              className="px-4 py-2 border-2 border-primary-border bg-primary text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent shadow-md font-medium"
              placeholder="To"
            />
            {(topRestaurantsDateFrom || topRestaurantsDateTo) && (
              <button
                onClick={() => {
                  setTopRestaurantsDateFrom("");
                  setTopRestaurantsDateTo("");
                }}
                className="px-4 py-2 bg-accent text-primary text-sm rounded-lg hover:bg-accent-hover transition font-bold shadow-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topRestaurants.map((restaurant, index) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              className="block p-8 border-2 border-primary-border rounded-2xl shadow-xl bg-primary-light hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-accent">
                    #{index + 1}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold mb-1">
                    Revenue
                  </p>
                  <span className="text-3xl font-bold text-accent">
                    ${Number(restaurant.revenue || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                {restaurant.name}
              </h3>
              <div className="space-y-2">
                <p className="text-base text-gray-300">
                  <span className="font-bold">Location:</span>{" "}
                  <span className="font-semibold">
                    {restaurant.location?.name}
                  </span>
                </p>
                <p className="text-base text-gray-300">
                  <span className="font-bold">Cuisine:</span>{" "}
                  <span className="font-semibold">
                    {restaurant.cuisine?.name}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="mb-8 p-6 border-2 border-primary-border rounded-2xl bg-primary-light shadow-xl">
        <h3 className="text-2xl font-bold mb-4 text-white">
          Search & Filter Restaurants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 border-2 border-primary-border bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent shadow-sm font-medium"
          />

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-3 border-2 border-primary-border bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent shadow-sm font-medium"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="px-4 py-3 border-2 border-primary-border bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent shadow-sm font-medium"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine.id} value={cuisine.id}>
                {cuisine.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "revenue")}
            className="px-4 py-3 border-2 border-primary-border bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent shadow-sm font-medium"
          >
            <option value="name">Sort by Name</option>
            <option value="revenue">Sort by Revenue</option>
          </select>

          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
            className="px-4 py-3 border-2 border-primary-border bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent shadow-sm font-medium"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setSelectedLocation("");
              setSelectedCuisine("");
              setSortBy("name");
              setSortDirection("asc");
              setCurrentPage(1);
            }}
            className="px-4 py-3 bg-accent text-primary rounded-lg hover:bg-accent-hover transition shadow-md font-bold"
          >
            Reset
          </button>
        </div>
      </section>

      {/* Restaurant List */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            All Restaurants
            <span className="text-2xl text-gray-400 ml-2">({total} total)</span>
          </h2>
          {currentPage > 1 || currentPage < totalPages ? (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-5 py-3 bg-accent text-primary rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-accent-hover transition font-bold shadow-md"
              >
                Previous
              </button>
              <span className="px-5 py-3 border-2 border-primary-border rounded-lg font-bold bg-primary-light text-white shadow-md">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-5 py-3 bg-accent text-primary rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-accent-hover transition font-bold shadow-md"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="text-center py-16 bg-primary-light rounded-2xl border-2 border-primary-border shadow-lg">
            <p className="text-xl font-semibold text-white">
              Loading restaurants...
            </p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-16 bg-primary-light rounded-2xl border-2 border-primary-border shadow-lg">
            <p className="text-xl text-white">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="p-6 border-2 border-primary-border rounded-2xl shadow-lg hover:shadow-2xl hover:border-accent transition-all duration-300 bg-primary-light"
              >
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {restaurant.name}
                </h3>
                <div className="space-y-3 mb-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-accent">Location:</span>{" "}
                    <span className="font-medium">
                      {restaurant.location?.name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-accent">Cuisine:</span>{" "}
                    <span className="font-medium">
                      {restaurant.cuisine?.name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-accent">Address:</span>{" "}
                    <span className="font-medium">{restaurant.address}</span>
                  </p>
                </div>
                {restaurant.revenue !== null &&
                  restaurant.revenue !== undefined && (
                    <div className="mb-4 p-4 bg-primary rounded-lg border-2 border-primary-border">
                      <p className="text-xs text-gray-400 font-bold mb-1">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold text-accent">
                        ${Number(restaurant.revenue).toFixed(2)}
                      </p>
                    </div>
                  )}
                <Link
                  href={`/restaurants/${restaurant.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-block w-full text-center px-5 py-3 bg-accent text-primary text-sm font-bold rounded-lg hover:bg-accent-hover transition shadow-md"
                >
                  View Details & Orders
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
