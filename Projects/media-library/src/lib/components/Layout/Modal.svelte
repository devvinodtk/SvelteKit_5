<script lang="ts">
  import { ManageFolder, ManageMedia } from "$components";
  import type { Folder, Media } from "$lib/state/user-state.svelte";
  import { Modal } from "flowbite-svelte";

  let {
    open = $bindable(),
    modalHeading,
    currentForm,
    itemToEdit,
  }: {
    open: boolean;
    modalHeading: string;
    currentForm: "manage-media" | "manage-folder";
    itemToEdit: Folder | Media | undefined;
  } = $props();

  const closeModal = () => {
    open = false;
  };
</script>

<Modal bind:open title={modalHeading} size="md" class="m-4">
  {#if currentForm === "manage-media"}
    <ManageMedia {itemToEdit} {closeModal} />
  {/if}
  {#if currentForm === "manage-folder"}
    <ManageFolder {itemToEdit} {closeModal} />
  {/if}
</Modal>
