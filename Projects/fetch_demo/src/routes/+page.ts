import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const [postsResp, recipesResp] = await Promise.all([
    fetch(`https://dummyjson.com/posts?limit=10`),
    fetch(`https://dummyjson.com/recipes?limit=10`)
  ]);

  const posts = await postsResp.json();
  const recipes = await recipesResp.json();
  return {
    posts,
    recipes
  };
};
