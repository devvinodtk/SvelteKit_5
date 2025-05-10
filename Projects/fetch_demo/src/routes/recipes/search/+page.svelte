<script lang="ts">
  let { data } = $props();
  let recipe = $derived(data.recipes?.recipes[0]);
</script>
{#if recipe }
<h2>{recipe.name}</h2>

<h3>Ingredients</h3>
<ul>
{#each recipe.ingredients as ing}
  <li>{ing}</li>
{/each}
</ul>

<h3>Cooking Instructions</h3>
<ul>
{#each recipe.instructions as instr}
  <li>{instr}</li>
{/each}
</ul>
{:else}
<h1>No recipes found</h1>
{/if}
