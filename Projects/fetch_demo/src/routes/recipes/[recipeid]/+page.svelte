<script lang="ts">
  let {data} = $props();
</script>
<h2>{data.name}</h2>

<h3>Ingredients</h3>
<ul>
{#each data.ingredients as ing}
  <li>{ing}</li>
{/each}
</ul>

<h3>Cooking Instructions</h3>
<ul>
{#each data.instructions as instr}
  <li>{instr}</li>
{/each}
</ul>
