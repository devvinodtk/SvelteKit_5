import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const response = await fetch(`https://dummyjson.com/posts/${params.postid}`);
  const post = await response.json();

  return {
    title: post.title,
    message: post.body
  };
};
