import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url }) => {
  const params = url.searchParams.get("q") || "";

  const response = await fetch(
    `https://dummyjson.com/recipes/search?q=${params}`
  );

  const recipes = await response.json();
  return {
    recipes
  };
};
