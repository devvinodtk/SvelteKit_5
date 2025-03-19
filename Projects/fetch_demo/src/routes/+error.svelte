<script lang="ts">
import { page } from '$app/state';
</script>

<h1>Failed - {page.status}: {page.error?.message}</h1>