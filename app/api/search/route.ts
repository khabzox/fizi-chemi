import { NextResponse } from "next/server";
import config from "@/config/app";

async function fetchTutorialData() {
  const response = await fetch(`${config.domainName}/api/tutorial`);
  if (!response.ok) {
    throw new Error("Failed to fetch tutorial data");
  }
  return response.json();
}

export async function GET(request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  // Fetch tutorial data
  let data;
  try {
    data = await fetchTutorialData();
  } catch (error) {
    return NextResponse.error();
  }

  // Normalize query to lowercase and split into words
  const words = query.toLowerCase().split(/\s+/);

  // Helper function to recursively search through nested data
  const searchNestedData = (obj) => {
    let results = [];
    if (obj.title && words.some((word) => obj.title.toLowerCase().includes(word))) {
      results.push(obj);
    }
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        results = results.concat(searchNestedData(obj[key]));
      }
    }
    return results;
  };

  // Filter results based on the query
  const results = searchNestedData(data);

  return NextResponse.json({ results });
}
