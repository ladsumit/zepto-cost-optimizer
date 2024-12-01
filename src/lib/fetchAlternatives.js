export default async function fetchAlternatives(subscriptionName, usageDetails) {
    try {
      // Make the POST request to your API endpoint
      const res = await fetch("/api/alternatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionName, usageDetails }),
      });
  
      // Handle HTTP errors
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch alternatives");
      }
  
      // Parse the JSON response
      const data = await res.json();
  
      // Validate and return alternatives
      if (!data || !Array.isArray(data.alternatives)) {
        throw new Error("Invalid API response");
      }
      return data.alternatives;
    } catch (err) {
      console.error("Error in fetchAlternatives:", err);
      throw err;
    }
  }
  