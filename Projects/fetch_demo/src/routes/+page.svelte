<h1>Navigate to Posts</h1>
{#each {length: 10}, i}
  <a href="/posts/{i+1}">Post-{i+1}</a>
  <br />
{/each}
<br /><br /><br />
<h1>Navigate to Recipes</h1>
{#each {length: 10}, i}
  <a href="/recipes/{i+1}">Recipe-{i+1}</a>
  <br />
{/each}


