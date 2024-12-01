"use client";

import { useState } from "react";
import fetchAlternatives from "@/lib/fetchAlternatives";

export default function ExplorePage() {
  const [subscriptionName, setSubscriptionName] = useState("");
  const [usageDetails, setUsageDetails] = useState("");
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchAlternatives = async () => {
    setLoading(true);
    setError("");
    try {
      const fetchedAlternatives = await fetchAlternatives(
        subscriptionName,
        usageDetails
      );
      setAlternatives(fetchedAlternatives);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-8">Explore Low Cost Alternatives or Pay-Per-Use Options</h1>
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-4">Subscription Name</label>
          <input
            type="text"
            className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
            value={subscriptionName}
            onChange={(e) => setSubscriptionName(e.target.value)}
            placeholder="e.g., Netflix"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-4">Usage Details</label>
          <input
            type="text"
            className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
            value={usageDetails}
            onChange={(e) => setUsageDetails(e.target.value)}
            placeholder="e.g., I watch 3 movies per month"
          />
        </div>
        <button
          onClick={handleFetchAlternatives}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded font-bold"
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Alternatives"}
        </button>
      </div>
      <div className="mt-6 w-full max-w-md">
        {alternatives.length > 0 && (
          <ul className="bg-gray-800 p-4 rounded shadow-lg">
            {alternatives.map((alt, index) => (
              <li key={index} className="text-sm mb-2 last:mb-0">
                {alt}
              </li>
            ))}
          </ul>
        )}
        {alternatives.length === 0 && !loading && (
          <p className="text-gray-400 text-center">No alternatives found. Try exploring!</p>
        )}
      </div>
    </div>
  );
}

