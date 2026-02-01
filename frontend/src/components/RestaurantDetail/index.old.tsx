"use client";

import type { Order, Restaurant } from "@/src/api/kitchenSpursAPI.schemas";
import {
  getApiRestaurantsId,
  getApiRestaurantsIdTrends,
  postApiRestaurantsIdOrders,
} from "@/src/api/restaurants/restaurants";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RestaurantDetailProps {
  restaurantId: number;
}

export function RestaurantDetail({ restaurantId }: RestaurantDetailProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Trends states
  const [trends, setTrends] = useState<{
    total_orders?: number;
    total_revenue?: number;
    average_order_value?: number;
    peak_hours?: Record<string, number>;
  } | null>(null);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsDateFrom, setTrendsDateFrom] = useState("");
  const [trendsDateTo, setTrendsDateTo] = useState("");

  // Fetch restaurant details
  useEffect(() => {
    setLoading(true);
    getApiRestaurantsId(restaurantId)
      .then(({ data }) => {
        setRestaurant(data.data || null);
      })
      .catch((error) => {
        console.error("Failed to fetch restaurant:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [restaurantId]);

  // Fetch orders
  useEffect(() => {
    setOrdersLoading(true);

    const requestBody: {
      page: number;
      from?: string;
      to?: string;
      min_amount?: number;
      max_amount?: number;
    } = {
      page: currentPage,
    };

    if (dateFrom) requestBody.from = dateFrom;
    if (dateTo) requestBody.to = dateTo;
    if (minAmount) requestBody.min_amount = parseFloat(minAmount);
    if (maxAmount) requestBody.max_amount = parseFloat(maxAmount);

    postApiRestaurantsIdOrders(restaurantId, requestBody)
      .then(({ data }) => {
        setOrders(data.data?.data || []);
        setTotal(data.data?.total || 0);
        setPerPage(data.data?.per_page || 10);
        setTotalPages(
          Math.ceil((data.data?.total || 0) / (data.data?.per_page || 10)),
        );
      })
      .catch((error) => {
        console.error("Failed to fetch orders:", error);
      })
      .finally(() => {
        setOrdersLoading(false);
      });
  }, [restaurantId, currentPage, dateFrom, dateTo, minAmount, maxAmount]);

  // Fetch trends
  useEffect(() => {
    setTrendsLoading(true);

    const params: Record<string, string> = {};
    if (trendsDateFrom) params.from = trendsDateFrom;
    if (trendsDateTo) params.to = trendsDateTo;

    getApiRestaurantsIdTrends(restaurantId, params)
      .then(({ data }) => {
        setTrends(data.data || null);
      })
      .catch((error) => {
        console.error("Failed to fetch trends:", error);
      })
      .finally(() => {
        setTrendsLoading(false);
      });
  }, [restaurantId, trendsDateFrom, trendsDateTo]);

  const handleFilterApply = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleFilterReset = () => {
    setDateFrom("");
    setDateTo("");
    setMinAmount("");
    setMaxAmount("");
    setCurrentPage(1);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white p-6">
        <p className="text-center py-8">Loading restaurant details...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="w-full min-h-screen bg-white p-6">
        <p className="text-center py-8 text-red-600">Restaurant not found</p>
        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      {/* Restaurant Info */}
      <div className="mb-8 p-6 border border-zinc-200 rounded-lg shadow-md bg-gradient-to-r from-blue-50 to-white">
        <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-zinc-600 mb-2">
              <span className="font-semibold">Location:</span>{" "}
              {restaurant.location?.name}
            </p>
            <p className="text-sm text-zinc-600 mb-2">
              <span className="font-semibold">Cuisine:</span>{" "}
              {restaurant.cuisine?.name}
            </p>
            <p className="text-sm text-zinc-600 mb-2">
              <span className="font-semibold">Address:</span>{" "}
              {restaurant.address}
            </p>
          </div>
          <div>
            {restaurant.phone && (
              <p className="text-sm text-zinc-600 mb-2">
                <span className="font-semibold">Phone:</span> {restaurant.phone}
              </p>
            )}
            {restaurant.email && (
              <p className="text-sm text-zinc-600 mb-2">
                <span className="font-semibold">Email:</span> {restaurant.email}
              </p>
            )}
            {restaurant.revenue !== null &&
              restaurant.revenue !== undefined && (
                <p className="text-xl font-bold text-green-600 mt-2">
                  Total Revenue: ${Number(restaurant.revenue).toFixed(2)}
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Orders</h2>

        {/* Filters */}
        <div className="mb-6 p-4 border border-zinc-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Filter Orders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Min Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleFilterApply}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={handleFilterReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Pagination Info and Controls */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-zinc-600">
            Showing {orders.length > 0 ? (currentPage - 1) * perPage + 1 : 0} to{" "}
            {Math.min(currentPage * perPage, total)} of {total} orders
          </p>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 border border-zinc-300 rounded-md">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Orders Table */}
        {ordersLoading ? (
          <p className="text-center py-8">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 border border-zinc-200 rounded-lg bg-gray-50">
            <p className="text-zinc-600">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
                    Order Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">
                      {formatDateTime(order.order_time || "")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${Number(order.order_amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Pagination */}
        {!ordersLoading && totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 border border-zinc-300 rounded-md">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
