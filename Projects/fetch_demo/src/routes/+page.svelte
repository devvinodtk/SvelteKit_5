<script lang="ts">
  let { data } = $props();
  let posts = $derived(data.posts?.posts)
  let recipes = $derived(data.recipes?.recipes);
</script>

<h1>Navigate to Posts</h1>
{#if posts && posts.length}
  {#each posts as post}
    {post.id} - <a href="/posts/{post.id}">{post.title}</a>
    <br />
  {/each}
{/if}
<br /><br /><br />
<h1>Navigate to Recipes</h1>
{#if recipes && recipes.length}
  {#each recipes as recipe}
    {recipe.id} - <a href="/recipes/search?q={encodeURI(recipe.name)}">{recipe.name}</a>
    <br />
  {/each}
{/if}


