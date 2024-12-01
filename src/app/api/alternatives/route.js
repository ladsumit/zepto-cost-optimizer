import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing OpenAI API Key" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { subscriptionName, usageDetails } = await req.json();

    if (!subscriptionName || !usageDetails) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Construct the OpenAI prompt
    const prompt = `Suggest cost-effective alternatives or pay-per-use options if any to the subscription "${subscriptionName}" based on this usage pattern: "${usageDetails}". Provide concise, actionable recommendations.`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert in subscription alternatives." },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Validate OpenAI response
    if (!data.choices || data.choices.length === 0) {
      return new Response(
        JSON.stringify({ error: "No choices returned from OpenAI API" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const alternatives = data.choices[0].message.content.trim().split("\n");

    // Save the alternatives to Firestore
    const collectionRef = collection(db, "alternatives");
    await addDoc(collectionRef, {
      subscriptionName,
      usageDetails,
      alternatives,
      timestamp: new Date(),
    });

    return new Response(
      JSON.stringify({ alternatives }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in POST /api/alternatives:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
