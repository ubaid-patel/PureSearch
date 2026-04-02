import axios from "axios";

export async function fetchSearchResults(query) {
  const url = `${process.env.SEARXNG_URL}/search?q=${encodeURIComponent(query)}&format=json`;

  const response = await axios.get(url);

  return response.data;
}