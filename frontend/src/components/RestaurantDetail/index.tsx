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
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("100");
  const [maxAmount, setMaxAmount] = useState("1000");

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
    getApiRestaurantsId(restaurantId)
      .then(({ data }) => {
        setRestaurant(data.data || null);
      })
      .catch((error) => {
        console.error("Failed to fetch restaurant:", error);
      });
  }, [restaurantId]);

  // Fetch orders
  useEffect(() => {
    const requestBody: {
      page: number;
      order_date_range?: {
        from?: string;
        to?: string;
      };
      order_amount_range?: {
        from?: number;
        to?: number;
      };
    } = {
      page: currentPage,
    };

    if (dateFrom)
      requestBody.order_date_range = {
        ...requestBody.order_date_range,
        from: dateFrom,
      };
    if (dateTo)
      requestBody.order_date_range = {
        ...requestBody.order_date_range,
        to: dateTo,
      };
    if (minAmount)
      requestBody.order_amount_range = {
        ...requestBody.order_amount_range,
        from: parseFloat(minAmount),
      };
    if (maxAmount)
      requestBody.order_amount_range = {
        ...requestBody.order_amount_range,
        to: parseFloat(maxAmount),
      };

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
    const params: Record<string, string> = {};
    if (trendsDateFrom) params.from = trendsDateFrom;
    if (trendsDateTo) params.to = trendsDateTo;

    getApiRestaurantsIdTrends(restaurantId, params)
      .then(({ data }) => {
        setTrends(
          data.data
            ? {
                total_orders: data.data.total_orders,
                total_revenue: data.data.total_revenue,
                average_order_value: data.data.average_order_value,
                peak_hours: data.data.peak_hours as
                  | Record<string, number>
                  | undefined,
              }
            : {
                total_orders: 0,
                total_revenue: 0,
                average_order_value: 0,
                peak_hours: {},
              },
        );
      })
      .catch((error) => {
        console.error("Failed to fetch trends:", error);
      })
      .finally(() => {
        setTrendsLoading(false);
      });
  }, [restaurantId, trendsDateFrom, trendsDateTo]);

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

  if (!restaurant) {
    return (
      <div className="w-full min-h-screen bg-primary p-6">
        <p className="text-center py-8 text-red-400 text-lg font-semibold">
          Restaurant not found
        </p>
        <div className="text-center">
          <Link href="/" className="text-accent hover:underline text-lg">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-primary p-6 rounded-3xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent-hover transition shadow-md font-semibold"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Restaurant Info */}
      <section className="mb-8 p-8 border-2 border-primary-border rounded-2xl shadow-xl bg-primary-light">
        <h1 className="text-4xl font-bold mb-6 text-white">
          {restaurant.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-base text-gray-300">
              <span className="text-accent font-bold">Location:</span>{" "}
              <span className="font-medium">{restaurant.location?.name}</span>
            </p>
            <p className="text-base text-gray-300">
              <span className="text-accent font-bold">Cuisine:</span>{" "}
              <span className="font-medium">{restaurant.cuisine?.name}</span>
            </p>
            <p className="text-base text-gray-300">
              <span className="text-accent font-bold">Address:</span>{" "}
              <span>{restaurant.address}</span>
            </p>
          </div>
          <div className="space-y-3">
            {restaurant.phone && (
              <p className="text-base text-gray-300">
                <span className="text-accent font-bold">Phone:</span>{" "}
                <span>{restaurant.phone}</span>
              </p>
            )}
            {restaurant.email && (
              <p className="text-base text-gray-300">
                <span className="text-accent font-bold">Email:</span>{" "}
                <span>{restaurant.email}</span>
              </p>
            )}
            {restaurant.revenue !== null &&
              restaurant.revenue !== undefined && (
                <div className="mt-4 p-4 bg-primary rounded-lg border-2 border-primary-border">
                  <p className="text-sm text-gray-400 font-semibold mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    ${Number(restaurant.revenue).toFixed(2)}
                  </p>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Order Trends Section */}
      <section className="mb-8 p-6 border-2 border-primary-border rounded-2xl shadow-xl bg-primary-light">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">
            Order Trends & Analytics
          </h2>
          <div className="flex gap-2 items-center flex-wrap">
            <input
              type="date"
              value={trendsDateFrom}
              onChange={(e) => setTrendsDateFrom(e.target.value)}
              className="px-3 py-2 border-2 border-primary-border bg-primary text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="From"
            />
            <input
              type="date"
              value={trendsDateTo}
              onChange={(e) => setTrendsDateTo(e.target.value)}
              className="px-3 py-2 border-2 border-primary-border bg-primary text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="To"
            />
            {(trendsDateFrom || trendsDateTo) && (
              <button
                onClick={() => {
                  setTrendsDateFrom("");
                  setTrendsDateTo("");
                }}
                className="px-3 py-2 bg-accent text-primary text-sm rounded-lg hover:bg-accent-hover transition font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {trendsLoading ? (
          <p className="text-center py-8 text-white">Loading trends...</p>
        ) : trends ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-6 bg-primary border-2 border-primary-border rounded-xl shadow-lg hover:shadow-xl transition">
                <h3 className="text-sm font-bold text-gray-400 mb-2">
                  Total Orders
                </h3>
                <p className="text-4xl font-bold text-accent">
                  {trends.total_orders || 0}
                </p>
              </div>
              <div className="p-6 bg-primary border-2 border-primary-border rounded-xl shadow-lg hover:shadow-xl transition">
                <h3 className="text-sm font-bold text-gray-400 mb-2">
                  Total Revenue
                </h3>
                <p className="text-4xl font-bold text-accent">
                  ${(trends.total_revenue || 0).toFixed(2)}
                </p>
              </div>
              <div className="p-6 bg-primary border-2 border-primary-border rounded-xl shadow-lg hover:shadow-xl transition">
                <h3 className="text-sm font-bold text-gray-400 mb-2">
                  Avg Order Value
                </h3>
                <p className="text-4xl font-bold text-accent">
                  ${(trends.average_order_value || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {trends.peak_hours && Object.keys(trends.peak_hours).length > 0 && (
              <div className="bg-primary p-6 border-2 border-primary-border rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Peak Hours Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {Object.entries(trends.peak_hours)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([hour, count]) => (
                      <div
                        key={hour}
                        className="p-4 bg-primary-light border-2 border-primary-border rounded-lg text-center hover:shadow-lg transition"
                      >
                        <p className="text-sm font-bold text-gray-400 mb-1">
                          {hour}:00
                        </p>
                        <p className="text-2xl font-bold text-accent">
                          {count as number}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold">
                          orders
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-primary rounded-lg border-2 border-primary-border">
            <p className="text-gray-400">No trends data available</p>
          </div>
        )}
      </section>

      {/* Orders Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-6 text-white">Orders History</h2>

        {/* Filters */}
        <div className="mb-6 p-6 border-2 border-primary-border rounded-xl bg-primary-light shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-white">Filter Orders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border-2 border-primary-border bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border-2 border-primary-border bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">
                Min Amount
              </label>
              <input
                type="number"
                step="100"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 border-2 border-primary-border bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">
                Max Amount
              </label>
              <input
                type="number"
                step="100"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="1000.50"
                className="w-full px-3 py-2 border-2 border-primary-border bg-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleFilterReset}
              className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent-hover transition font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Pagination Info and Controls */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
          <p className="text-sm font-semibold text-white">
            Showing {orders.length > 0 ? (currentPage - 1) * perPage + 1 : 0} to{" "}
            {Math.min(currentPage * perPage, total)} of {total} orders
          </p>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-accent text-primary rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-accent-hover transition font-semibold"
              >
                Previous
              </button>
              <span className="px-4 py-2 border-2 border-primary-border rounded-lg font-semibold bg-primary-light text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-accent text-primary rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-accent-hover transition font-semibold"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Orders Table */}
        {ordersLoading ? (
          <div className="text-center py-12 bg-primary-light rounded-xl border-2 border-primary-border">
            <p className="text-lg text-white">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 border-2 border-primary-border rounded-xl bg-primary-light shadow-lg">
            <p className="text-white text-lg">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-primary-border rounded-xl shadow-lg">
            <table className="w-full bg-primary-light">
              <thead className="bg-primary border-b-2 border-primary-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-accent">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-accent">
                    Order Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider text-accent">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-primary transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDateTime(order.order_time || "")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-accent">
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
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-accent text-primary rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-accent-hover transition font-semibold"
              >
                Previous
              </button>
              <span className="px-4 py-2 border-2 border-primary-border rounded-lg font-semibold bg-primary-light text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-accent text-primary rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-accent-hover transition font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
