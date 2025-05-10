import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ params }) => {
  const response = await fetch(
    `https://dummyjson.com/recipes/${params.recipeid}`
  );
  const recipe = await response.json();
  return {
    name: recipe.name,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions
  };
};
